import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchPosts, 
  createPost, 
  toggleLike, 
  addComment, 
  deletePost 
} from '../../features/posts/postsSlice';
import PostList from '../../components/posts/PostList';
import PostComposer from '../../components/posts/PostComposer';

const FeedPage = () => {
  const dispatch = useDispatch();
  const { posts, loading, error, hasMore } = useSelector(state => state.posts); 
  const currentUserId = useSelector(state => state.auth.user?.id);

  // Fetch initial posts on mount
  useEffect(() => {
    dispatch(fetchPosts(1));
  }, [dispatch]);
  
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      dispatch(fetchPosts(Math.floor(posts.length / 10) + 1));
    }
  };

  //create post handler
  const handlePostSubmit = async ({ content, imageFile }) => {
    try {
      await dispatch(createPost({ content, imageFile })).unwrap();
      
    } catch (error) {
      console.error('Failed to create post:', error);
      // Error is already displayed in the store, but you could show a toast here
    }
  };

  //like toggle handler
  const handleLikeToggle = (postId, isLiked) => {
    dispatch(toggleLike({ postId, isLiked }));
  };
  
  //comment submit handler
  const handleCommentSubmit = (postId, content) => {
    dispatch(addComment({ postId, content }));
  };

  //delete post handler
  const handleDeletePost = (postId) => {
    dispatch(deletePost(postId));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <PostComposer onSubmit={handlePostSubmit} userInitial={currentUserId ? currentUserId[0].toUpperCase() : 'Y'} />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <PostList
        posts={posts}
        isLoading={loading}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        onLikeToggle={handleLikeToggle}
        onCommentSubmit={handleCommentSubmit}
        onDeletePost={handleDeletePost}
        currentUserId={currentUserId}
      />
    </div>
  );
};

export default FeedPage;