import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPosts,
  createPost,
  toggleLikePost,
  submitComment,
  deleteComment,
  removePost,
  selectAllPosts,
  selectIsLoading,
  selectError,
  selectPaginationInfo,
} from '../../features/posts/postsSlice';
import PostList from '../../components/posts/PostList';
import PostComposer from '../../components/posts/PostComposer';

const FeedPage = () => {
  const dispatch = useDispatch();

  const posts = useSelector(selectAllPosts);
  const isLoading = useSelector(selectIsLoading);
  const errorMsg = useSelector(selectError);
  const { currentPage, hasMoreItems } = useSelector(selectPaginationInfo);

  const currentUser = useSelector((state) => state.auth.user);
  const currentUserId = currentUser?.id;
  const userName = currentUser?.first_name || currentUser?.name || 'User';

  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    dispatch(fetchPosts(1));
  }, [dispatch]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!document.hidden) {
        dispatch(fetchPosts(1));
      }
    }, 20000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMoreItems) {
      dispatch(fetchPosts(currentPage + 1));
    }
  }, [dispatch, isLoading, hasMoreItems, currentPage]);

  const handlePostSubmit = useCallback(async (postData) => {
    const { content, imageFile, isAnonymous } = postData;
    try {
      await dispatch(createPost({ content, imageFile, isAnonymous })).unwrap();
    } catch (err) {
      console.error('Post creation failed inside component:', err);
    }
  }, [dispatch]);

  const handleLikeToggle = useCallback((postId, currentStatus) => {
    dispatch(toggleLikePost({ postId, currentlyLiked: currentStatus }));
  }, [dispatch]);

  const handleCommentSubmit = useCallback((postId, content) => {
    dispatch(submitComment({ postId, text: content }));
  }, [dispatch]);

  const handleCommentDelete = useCallback((postId, commentId) => {
    dispatch(deleteComment({ postId, commentId }));
  }, [dispatch]);

  const handleDeletePost = useCallback((postId) => {
    dispatch(removePost(postId));
  }, [dispatch]);

  const { filteredPosts, trendingTags } = useMemo(() => {
    const query = searchInput.toLowerCase().trim();
    const tagRegex = /#([\w-]+)/g;

    const results = posts.filter((post) => {
      if (!query) return true;

      const searchableContent = [
        post.title,
        post.content,
        post.author?.name,
        (post.comments || []).map(c => c.content).join(' ')
      ].join(' ').toLowerCase();

      return searchableContent.includes(query);
    });

    const tagSet = new Set();
    posts.forEach(post => {
      const text = `${post.title || ''} ${post.content || ''}`;
      const matches = text.match(tagRegex);
      if (matches) {
        matches.forEach(tag => tagSet.add(tag));
      }
    });

    return {
      filteredPosts: results,
      trendingTags: Array.from(tagSet).slice(0, 8) // Limit to 8 tags
    };
  }, [posts, searchInput]);

  const displayError = typeof errorMsg === 'string' ? errorMsg : errorMsg?.message;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Header Section */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Community Feed</h1>
          <p className="text-slate-500 mt-1">Welcome back, {userName}. Stay updated.</p>
        </header>

        {/* Search & Tags Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search posts, comments, or names..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          />
          
          {trendingTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {trendingTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSearchInput(tag)}
                  className="px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Post Composer */}
        <div className="mb-8">
          <PostComposer
            onSubmit={handlePostSubmit}
            userInitial={userName.charAt(0).toUpperCase()}
          />
        </div>

        {/* Error Message */}
        {displayError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-4">
            {displayError}
          </div>
        )}

        {/* Post List */}
        <PostList
          posts={filteredPosts}
          isLoading={isLoading}
          hasMore={hasMoreItems}
          onLoadMore={handleLoadMore}
          onLikeToggle={handleLikeToggle}
          onCommentSubmit={handleCommentSubmit}
          onCommentDelete={handleCommentDelete}
          onDeletePost={handleDeletePost}
          currentUserId={currentUserId}
        />
        
      </div>
    </div>
  );
};

export default FeedPage;