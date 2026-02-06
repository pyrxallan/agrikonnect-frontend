import React, { useEffect, useRef, useState } from 'react';
import PostCard from './PostCard';

//List of posts with infinite scroll loading and error handling

const PostList = ({
  posts = [],
  isLoading = false,
  hasMore = false,
  onLoadMore,
  onLikeToggle,
  onCommentSubmit,
  onDeletePost,
  currentUserId,
  emptyMessage = "No posts yet. Be the first to post something!",
  className = ''
}) => {
  const LoadMoreRef = useRef(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  //setup intersection observer for infinite scroll

  useEffect(() => {
    if (!LoadMoreRef.current || isLoading || !onLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingMore) {
          setIsFetchingMore(true);
          onLoadMore().finally(() => setIsFetchingMore(false));
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(LoadMoreRef.current);
    return () => observer.disconnect();
  }, [onLoadMore, hasMore, isLoading, isFetchingMore]);

  return (
    <div className={`space-y-4 ${className}`}>
      {posts.length === 0 && !isLoading ? (
        <p className="text-center text-gray-500">{emptyMessage}</p>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={currentUserId}
            onLikeToggle={onLikeToggle}
            onCommentSubmit={(postId, content) => onCommentSubmit(postId, content)}
            onDeletePost={onDeletePost}
            isOwnPost={post.author?.id === currentUserId}
          />
        ))
      )}
      <div ref={LoadMoreRef} className="h-10 flex items-center justify-center">
        {isLoading && <span className="text-sm text-gray-500">Loading...</span>}
        {!isLoading && hasMore && <span className="text-sm text-gray-500">Load more...</span>}
      </div>
    </div>
  );
};

export default PostList;