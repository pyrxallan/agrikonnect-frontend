//postslice.js

import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const USE_MOCKS = false;

const MOCK_POSTS = [
  {
    id: 1,
    title: 'Maize field update',
    content: 'Sprayed today after early signs of leaf blight. Any tips on follow‑up care?',
    imageUrl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop',
    author: { id: 'u1', name: 'Samuel K.' },
    createdAt: '2026-02-06T09:15:00.000Z',
    likeCount: 12,
    isLiked: false,
    comments: [
      { id: 'c1', author: 'Dr. Amina', content: 'Monitor for 7 days and reapply if needed.' },
    ],
  },
  {
    id: 2,
    title: 'Irrigation question',
    content: 'What’s the best schedule for drip irrigation on sandy soil?',
    imageUrl: '',
    author: { id: 'u2', name: 'Faith M.' },
    createdAt: '2026-02-05T17:40:00.000Z',
    likeCount: 5,
    isLiked: true,
    comments: [],
  },
];

//init state
const initialState = {
    posts: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    hasMore: true,
};

//fetch posts async thunk
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (page = 1, { rejectWithValue }) => {
    try {
      if (USE_MOCKS) {
        return {
          posts: MOCK_POSTS,
          page: 1,
          totalPages: 1,
        };
      }
      const response = await api.get(`/posts?page=${page}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch posts');
    }
  }
);

//create posts slice
export const createPost = createAsyncThunk(
  'posts/createPost',
  async ({ content, imageFile }, { rejectWithValue }) => {
    try {
      if (USE_MOCKS) {
        return {
          id: Date.now(),
          title: '',
          content,
          imageUrl: imageFile ? URL.createObjectURL(imageFile) : '',
          author: { id: 'u0', name: 'You' },
          createdAt: new Date().toISOString(),
          likeCount: 0,
          isLiked: false,
          comments: [],
        };
      }
      const formData = new FormData();
      formData.append('content', content);
      if (imageFile) {
        formData.append('image', imageFile);
      }
      const response = await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);
 
//like post async thunk
export const toggleLike = createAsyncThunk(
  'posts/toggleLike',
  async ({ postId, isLiked }, { rejectWithValue }) => {
    try {
      const method = isLiked ? 'delete' : 'post';
      const response = await api[method](`/posts/${postId}/like`);
      return { postId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update like');
    }
  }
);

//adds comment async thunk
export const addComment = createAsyncThunk(
    'posts/addComment',
    async ({ postId, content }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/posts/${postId}/comments`, { content });
            return { postId, comment: response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
        }
    }
);

//delete post async thunk
export const deletePost = createAsyncThunk(
    'posts/deletePost',
    async (postId, { rejectWithValue }) => {
        try {
            await api.delete(`/posts/${postId}`);
            return postId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete post');
        }
    }
);

//posts slice
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Reset to initial state
    resetPosts: () => initialState,
    
    // Clear any errors
    clearError: (state) => {
      state.error = null;
    },
    
    // Update a post locally 
    updatePostLocally: (state, action) => {
      const { postId, updates } = action.payload;
      const post = state.posts.find(p => p.id === postId);
      if (post) {
        Object.assign(post, updates);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        const { posts, page, totalPages } = action.payload;

        //if first page, replace posts, otherwise append
        state.posts = page === 1 ? posts : [...state.posts, ...posts];
        state.currentPage = page;
        state.totalPages = totalPages;
        state.hasMore = page < totalPages;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch posts';
      })
      .addCase(createPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        // Add new post to the beginning
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { postId, liked, likeCount } = action.payload;
        const post = state.posts.find(p => p.id === postId);
        if (post) {
          post.liked = liked;
          post.likeCount = likeCount;
        }
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        const post = state.posts.find(p => p.id === postId);
        if (post) {
          post.comments = post.comments || [];
          post.comments.push(comment);
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const postId = action.payload;
        state.posts = state.posts.filter(p => p.id !== postId);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { resetPosts, clearError, updatePostLocally } = postsSlice.actions;

//selector to get all posts
export const selectAllPosts = (state) => state.posts.posts;
export const selectPostById = (postId) => (state) => 
  state.posts.posts.find(post => post.id === postId);
export const selectPostsLoading = (state) => state.posts.loading;
export const selectPostsError = (state) => state.posts.error;
export const selectPagination = (state) => ({
  currentPage: state.posts.currentPage,
  totalPages: state.posts.totalPages,
  hasMore: state.posts.hasMore,
});

export default postsSlice.reducer;

    