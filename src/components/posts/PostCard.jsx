import React from 'react';
import LikeButton from './LikeButton';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

//post card component displaying post details, like button, comments, and comment form

const PostCard = ({ 
  post, 
  onLikeToggle, 
  onCommentSubmit,
  onDeletePost,
  isOwnPost = false,
  className = ''
}) => {
  // Destructure post properties
  const {
    id,
    title,
    body,
    content,
    imageUrl,
    author = {},
    createdAt,
    likeCount = 0,
    commentCount = 0,
    isLiked = false,
    comments = []
  } = post;

  //get author initials for avatar
  const authorInitials = author.name
    ? author.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'A';

  // Format creation date
  const formattedDate = createdAt ? new Date(createdAt).toLocaleString() : '';

  return (
    <div className={`border rounded-lg p-4 bg-white shadow-sm ${className}`}>
      <div className="flex items-center mb-3">
        <div className="h-10 w-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-lg font-semibold mr-3">
          {authorInitials}
        </div>
        <div>
          <p className="font-semibold">{author.name || 'Anonymous'}</p>
          <p className="text-xs text-gray-500">{formattedDate}</p>
        </div>
        {isOwnPost && onDeletePost && (
          <button
            onClick={() => onDeletePost(id)}
            className="ml-auto text-red-500 hover:text-red-700 text-sm"
          >
            Delete
          </button>
        )}
      </div>

      {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
      {body && <p className="text-gray-800 mb-2">{body}</p>}
      {content && <p className="text-gray-800 mb-2">{content}</p>}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Post visual content"
          className="w-full h-auto rounded-lg mb-3"
        />
      )}

      <div className="flex items-center justify-between mb-3">
        <LikeButton
          postId={id}
          isLiked={isLiked}
          likeCount={likeCount}
          onLikeToggle={(postId, nextLiked) => onLikeToggle?.(postId, nextLiked)}
        />
        <span className="text-sm text-gray-500">{commentCount} Comments</span>
      </div>

      <CommentList comments={comments} />

      <CommentForm
        postId={id}
        onSubmit={(content) => onCommentSubmit(id, content)}
      />
    </div>
  );
};

export default PostCard;