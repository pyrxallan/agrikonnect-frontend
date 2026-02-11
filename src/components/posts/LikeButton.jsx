import React, { useState } from 'react';

// Component for a like button that toggles between liked and unliked states, with a count of likes

const LikeButton = ({ 
  postId, 
  isLiked: initialIsLiked = false, 
  likeCount: initialLikeCount = 0, 
  onLikeToggle,
  className = ''
}) => {

// State to track whether the post is currently liked and the count of likes
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isProcessing, setIsProcessing] = useState(false);

  //like and unlike handling

  const handleToggleLike = async () => {
    if (isProcessing) return; // remove spamming
    setIsProcessing(true);
    try {
      const nextLiked = !isLiked;
      if (onLikeToggle) {
        await onLikeToggle(postId, nextLiked);
      }
      setIsLiked(nextLiked);
      setLikeCount((count) => Math.max(0, count + (nextLiked ? 1 : -1)));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      disabled={isProcessing}
      className={`flex items-center gap-1 text-sm font-medium ${isLiked ? 'text-green-600' : 'text-gray-500'} ${className}`}
    >
      {isLiked ? 'Liked' : 'Like'}
      <span className="text-xs text-gray-400">{likeCount}</span>
    </button>
  );
};

export default LikeButton;