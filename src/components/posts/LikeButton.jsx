import React, { useState } from 'react';

const LikeButton = ({
  postId,
  isLiked = false,
  likeCount = 0,
  onLikeToggle,
  className = '',
}) => {
  const [isBusy, setIsBusy] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isBusy) return;

    setIsBusy(true);
    try {
      if (onLikeToggle) {
        await onLikeToggle(postId, isLiked);
      }
    } catch (error) {
      console.error('Like action failed:', error);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isBusy}
      aria-label={isLiked ? 'Unlike this post' : 'Like this post'}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium 
        transition-colors duration-200 group
        ${isLiked 
          ? 'bg-red-50 text-red-500 hover:bg-red-100' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }
        ${isBusy ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-4 w-4 transition-transform duration-150 ${isBusy ? 'animate-pulse' : 'group-hover:scale-110'}`}
        fill={isLiked ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>

      <span className="text-xs font-semibold">{likeCount}</span>
    </button>
  );
};

export default LikeButton;