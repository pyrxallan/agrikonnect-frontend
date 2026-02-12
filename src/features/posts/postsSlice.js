// postslice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Constants & Config
const USE_MOCK_DATA = false;
const STORAGE_KEY = "agrikonnect_offline_posts";

// Helper Functions

// Get posts from local storage
const getOfflinePosts = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    // Ensure we mark them as offline-only
    return parsed.map((p) => ({ ...p, isLocal: true }));
  } catch (err) {
    console.error("Failed to load offline posts:", err);
    return [];
  }
};

// Save posts to local storage
const saveOfflinePosts = (posts) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (err) {
    console.error("Failed to save offline posts:", err);
  }
};

// Helper to format the author object consistently
const formatAuthor = (rawPost, currentUser) => {
  // If anonymous, return early
  if (rawPost.isAnonymous || rawPost.is_anonymous) {
    return { id: rawPost.author_id || rawPost.authorId, name: "Anonymous" };
  }

  let authorData = rawPost.author || rawPost.user || {};

  // Handle if author is just a string ID
  if (typeof authorData === "string") {
    authorData = { name: authorData };
  }

  // Determine name
  let name = authorData.name || authorData.username;
  
  if (!name) {
    const first = authorData.first_name || authorData.firstName || "";
    const last = authorData.last_name || authorData.lastName || "";
    name = `${first} ${last}`.trim();
  }

  // Fallback: check if the current user owns this post
  const authorId = rawPost.author_id || rawPost.authorId || rawPost.user_id;
  if (!name && currentUser && String(authorId) === String(currentUser.id)) {
    name = currentUser.name || "You";
  }

  return { ...authorData, id: authorId, name: name || "Unknown User" };
};

// Main function to clean up post data from the API
const standardizePost = (rawPost, currentUser) => {
  if (!rawPost) return null;

  const isLocal = !!(
    rawPost.isLocal ||
    rawPost.clientId ||
    String(rawPost.id).startsWith("local-")
  );

  const author = formatAuthor(rawPost, currentUser);

  return {
    ...rawPost,
    author,
    isLocal,
    isRemote: !isLocal,
    isAnonymous: !!(rawPost.isAnonymous || rawPost.is_anonymous),
    createdAt: rawPost.createdAt || rawPost.created_at,
    updatedAt: rawPost.updatedAt || rawPost.updated_at,
    // Handle different API field names for likes
    likeCount: rawPost.likeCount || rawPost.likes_count || rawPost.likes?.length || 0,
    isLiked: !!(rawPost.isLiked || rawPost.is_liked || rawPost.user_liked),
    // Handle different API field names for comments
    commentCount: rawPost.commentCount || rawPost.comments_count || rawPost.comments?.length || 0,
  };
};

// Helper to extract array of posts from various API response shapes
const getPostsArray = (response) => {
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.posts)) return data.posts;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.results)) return data.results;
  return [];
};

const initialState = {
  items: [],
  isLoading: false,
  errorMsg: null,
  page: 1,
  maxPages: 1,
  hasMoreItems: false,
};

export const fetchPosts = createAsyncThunk(
  "posts/loadPosts",
  async (pageNum = 1, { rejectWithValue, getState }) => {
    const user = getState().auth?.user;

    if (USE_MOCK_DATA) {
      return {
        posts: MOCK_DATA.map((p) => standardizePost(p, user)),
        page: 1,
        totalPages: 1,
      };
    }

    try {
      const response = await api.get(`/posts?page=${pageNum}`);
      const data = response.data;
      const rawPosts = Array.isArray(data) ? data : (data.posts || data.data || data.results || []);
      
      // Merge with offline posts if on first page
      let finalPosts = rawPosts.map((p) => standardizePost(p, user));
      
      const totalPages = (typeof data === 'object' && !Array.isArray(data)) ? (data.totalPages || data.pages || 1) : 1;

      return {
        posts: finalPosts,
        page: pageNum,
        totalPages,
      };
    } catch (err) {
      // Fallback to offline mode if server error
      if (err.response?.status >= 500) {
        const offlinePosts = getOfflinePosts();
        return {
          posts: offlinePosts.map((p) => standardizePost(p, user)),
          page: 1,
          totalPages: 1,
        };
      }
      return rejectWithValue(err.response?.data?.message || "Could not load posts");
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createNew",
  async ({ content, imageFile, isAnonymous }, { rejectWithValue, getState }) => {
    const user = getState().auth?.user;

    try {
      let response;
      
      if (imageFile) {
        const payload = new FormData();
        payload.append("content", content);
        payload.append("is_anonymous", isAnonymous ? "true" : "false");
        payload.append("image", imageFile);
        response = await api.post("/posts", payload);
      } else {
        response = await api.post("/posts", {
          content,
          is_anonymous: isAnonymous
        });
      }
      
      const newPost = response.data?.post || response.data;
      return standardizePost(newPost, user);

    } catch (err) {
      // Create a local post if network fails
      if (err.response?.status === 405 || err.message === "Network Error") {
        const tempPost = {
          id: `local-${Date.now()}`,
          clientId: `local-${Date.now()}`,
          content,
          imageUrl: imageFile ? URL.createObjectURL(imageFile) : null,
          isAnonymous,
          isLocal: true,
          author: { name: isAnonymous ? "Anonymous" : "You" },
          createdAt: new Date().toISOString(),
          likeCount: 0,
          isLiked: false,
          comments: [],
        };

        // Save to local storage
        const currentLocal = getOfflinePosts();
        saveOfflinePosts([tempPost, ...currentLocal]);

        return standardizePost(tempPost, user);
      }

      return rejectWithValue(err.response?.data?.message || "Failed to create post");
    }
  }
);

export const toggleLikePost = createAsyncThunk(
  "posts/toggleLike",
  async ({ postId, currentlyLiked }, { rejectWithValue }) => {
    try {
      // If liked, we unlike (delete), else we like (post)
      const path = `/posts/${postId}/like`;
      const response = currentlyLiked 
        ? await api.delete(path) 
        : await api.post(path);
        
      return { postId, data: response.data };
    } catch (err) {
      return rejectWithValue("Failed to update like");
    }
  }
);

export const submitComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, text }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/posts/${postId}/comments`, { content: text });
      return { postId, comment: response.data };
    } catch (err) {
      return rejectWithValue("Comment failed");
    }
  }
);

export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      await api.delete(`/posts/${postId}/comments/${commentId}`);
      return { postId, commentId };
    } catch (err) {
      return rejectWithValue("Failed to delete comment");
    }
  }
);

export const removePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, { rejectWithValue, getState }) => {
    try {
      // Check if it's a local-only post
      const post = getState().posts.items.find((p) => p.id === postId);
      const isLocal = post?.isLocal || String(postId).startsWith("local-");

      if (!isLocal) {
        await api.delete(`/posts/${postId}`);
      }
      
      return postId;
    } catch (err) {
      if (err.response?.status === 404) return postId; // Already gone
      return rejectWithValue("Delete failed");
    }
  }
);

// Slice Definition

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearPostsState: () => initialState,
    
    clearError: (state) => {
      state.errorMsg = null;
    },
    
    // Optimistic update for likes (optional, but good UX)
    setLikeStatus: (state, action) => {
        const { postId, isLiked } = action.payload;
        const post = state.items.find(p => p.id === postId);
        if(post) {
            post.isLiked = isLiked;
            post.likeCount = isLiked ? post.likeCount + 1 : post.likeCount - 1;
        }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.errorMsg = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        const { posts, page, totalPages } = action.payload;

        // Replace if page 1, otherwise append
        state.items = page === 1 ? posts : [...state.items, ...posts];
        state.page = page;
        state.maxPages = totalPages;
        state.hasMoreItems = page < totalPages;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMsg = action.payload;
      })

      // Create Post
      .addCase(createPost.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      
      // Toggle Like
      .addCase(toggleLikePost.fulfilled, (state, action) => {
        const { postId, data } = action.payload;
        const post = state.items.find((p) => p.id === postId);
        if (post) {
            // Use server response if available, otherwise toggle logically
            post.isLiked = data.liked ?? data.isLiked ?? !post.isLiked;
            post.likeCount = data.likeCount ?? data.likes_count ?? post.likeCount;
        }
      })

      // Add Comment
      .addCase(submitComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        const post = state.items.find((p) => p.id === postId);
        if (post) {
          if (!post.comments) post.comments = [];
          post.comments.push(comment);
          post.commentCount += 1;
        }
      })

      // Delete Comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { postId, commentId } = action.payload;
        const post = state.items.find((p) => p.id === postId);
        if (post && post.comments) {
          post.comments = post.comments.filter((c) => c.id !== commentId);
          post.commentCount = Math.max(0, post.commentCount - 1);
        }
      })

      // Delete Post
      .addCase(removePost.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.items = state.items.filter((p) => p.id !== deletedId);
        
        // Also remove from local storage if present
        const currentLocal = getOfflinePosts();
        const updatedLocal = currentLocal.filter(p => p.id !== deletedId);
        saveOfflinePosts(updatedLocal);
      });
  },
});

// Export Actions
export const { clearPostsState, clearError, setLikeStatus } = postsSlice.actions;

// Export Selectors
export const selectAllPosts = (state) => state.posts.items;
export const selectIsLoading = (state) => state.posts.isLoading;
export const selectError = (state) => state.posts.errorMsg;
export const selectPaginationInfo = (state) => ({
  currentPage: state.posts.page,
  totalPages: state.posts.maxPages,
  hasMore: state.posts.hasMoreItems,
});

export default postsSlice.reducer;