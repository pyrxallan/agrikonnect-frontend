import React from 'react';
import { Link } from 'react-router-dom';
import LikeButton from './LikeButton';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

const PostCard = ({
  post,
  onLikeToggle,
  onCommentSubmit,
  onCommentDelete,
  onDeletePost,
  currentUserId,
  isOwnPost = false,
  className = '',
}) => {
  const {
    id,
    title,
    content,
    imageUrl,
    author,
    createdAt,
    likeCount = 0,
    commentCount = 0,
    isLiked = false,
    comments = [],
    isAnonymous,
  } = post;

  const getAuthorName = () => {
    if (isAnonymous) return 'Anonymous';
    return author?.name || 'Unknown User';
  };

  const getInitials = () => {
    const name = getAuthorName();
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const formatDate = () => {
    if (!createdAt) return '';
    const date = new Date(createdAt);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    let hour = date.getHours();
    const minute = date.getMinutes().toString().padStart(2, '0');
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    return `${month} ${day}, ${year} at ${hour}:${minute} ${ampm}`;
  };

  const handleDeleteClick = () => {
    if (onDeletePost && id) {
      if (window.confirm('Are you sure you want to delete this post?')) {
        onDeletePost(id);
      }
    }
  };

  const authorId = author?.id;
  const isProfileLinkable = !!authorId && !isAnonymous;

  return (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden ${className}`}>
      {/* Header Section */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
            {getInitials()}
          </div>
          
          {/* Author Info */}
          <div className="flex flex-col">
            {isProfileLinkable ? (
              <Link 
                to={`/profile/${authorId}`} 
                className="font-semibold text-gray-900 hover:text-emerald-600 transition-colors text-sm"
              >
                {getAuthorName()}
              </Link>
            ) : (
              <span className="font-semibold text-gray-900 text-sm">{getAuthorName()}</span>
            )}
            <span className="text-xs text-gray-400">{formatDate()}</span>
          </div>
        </div>

        {/* Actions (Delete) */}
        {isOwnPost && (
          <button
            onClick={handleDeleteClick}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
            aria-label="Delete post"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-2">
        {title && <h3 className="text-lg font-bold text-gray-800">{title}</h3>}
        {content && <p className="text-gray-700 text-sm whitespace-pre-wrap">{content}</p>}
      </div>

      {/* Image Section */}
      {imageUrl && (
        <div className="w-full bg-gray-50 border-t border-b border-gray-100">
          <img 
            src={imageUrl} 
            alt="Post content" 
            className="w-full max-h-[400px] object-contain mx-auto"
          />
        </div>
      )}

      {/* Stats & Interaction Bar */}
      <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
        <LikeButton
          postId={id}
          isLiked={isLiked}
          likeCount={likeCount}
          onLikeToggle={onLikeToggle}
        />
        
        <div className="flex items-center gap-1 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-xs font-medium">{commentCount} Comments</span>
        </div>
      </div>

      {/* Comment Section */}
      <div className="p-4 bg-white">
        <CommentList
          comments={comments}
          onDelete={onCommentDelete ? (commentId) => onCommentDelete(id, commentId) : undefined}
          currentUserId={currentUserId}
        />
        <div className="mt-3 pt-3 border-t border-gray-100">
          <CommentForm
            postId={id}
            onSubmit={(text) => onCommentSubmit(id, text)}
          />
        </div>
      </div>
    </div>
  );
};

export default PostCard;