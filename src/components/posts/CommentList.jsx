import react from 'react';

/**
 * CommentList component displays a list of comments for a post
  * It shows the commenter's name, content, and creation date
 */
const CommentList = ({ comments, isLoading, onDelete, currentUserId }) => {
  if (isLoading) {
    return <div>Loading comments...</div>;
  }

  if (!comments || comments.length === 0) {
    return <div className="text-sm text-gray-500">No comments yet.</div>;
  }
// Render each comment with author initials, name, content, and created date. If onDelete is provided and the comment belongs to the current user, show a delete button
  return (
    <ul className="space-y-3">
      {comments.map((comment) => (
        <li key={comment.id} className="flex items-start gap-3">
          <div className="h-6 w-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-xs font-semibold">
            {comment.author?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-800">
              <span className="font-semibold">{comment.author?.name || 'Anonymous'}</span>{' '}
              {comment.content}
            </p>
            {comment.createdAt && (
              <p className="text-xs text-gray-500">{comment.createdAt}</p>
            )}
          </div>
          {(onDelete && (comment.author?.id === currentUserId)) && (
            <button
              onClick={() => onDelete(comment.id)}
              className="text-red-500 hover:text-red-700 text-xs"
            >
              Delete
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default CommentList;