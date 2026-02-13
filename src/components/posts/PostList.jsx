import React, { useEffect, useRef, useState } from 'react';
import PostCard from './PostCard';

const PostList = ({
  posts = [],
  isLoading = false,
  hasMore = false,
  onLoadMore,
  onLikeToggle,
  onCommentSubmit,
  onCommentDelete,
  onDeletePost,
  currentUserId,
  emptyMessage = "No posts yet.",
  className = '',
}) => {
  const sentinelRef = useRef(null);
  const [isFetchingPage, setIsFetchingPage] = useState(false);

  useEffect(() => {
    if (isLoading || !hasMore || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && !isFetchingPage) {
          setIsFetchingPage(true);
          Promise.resolve(onLoadMore())
            .finally(() => setIsFetchingPage(false));
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, isFetchingPage, onLoadMore]);

  const showInitialLoader = isLoading && posts.length === 0;
  const showEmptyState = !isLoading && posts.length === 0;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Render Posts */}
      {posts.map((post, index) => {
        const postKey = post.id || post.clientId || `post-${index}`;
        
        return (
          <PostCard
            key={postKey}
            post={post}
            currentUserId={currentUserId}
            onLikeToggle={onLikeToggle}
            onCommentSubmit={onCommentSubmit}
            onCommentDelete={onCommentDelete}
            onDeletePost={onDeletePost}
            isOwnPost={String(post.author?.id) === String(currentUserId)}
          />
        );
      })}

      {/* Empty State */}
      {showEmptyState && (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}

      {/* Initial Loading State */}
      {showInitialLoader && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      )}

      <div ref={sentinelRef} className="py-4 flex justify-center min-h-[40px]">
        {!isLoading && hasMore && (
          <span className="text-sm text-gray-400">Scroll for more</span>
        )}
        {isLoading && posts.length > 0 && (
           <div className="flex items-center gap-2 text-gray-500">
             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
             <span className="text-xs">Loading...</span>
           </div>
        )}
      </div>
    </div>
  );
};

export default PostList;