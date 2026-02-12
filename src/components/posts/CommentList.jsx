import react from 'react';

const CommentList = ({ comments, isLoading, onDelete, currentUserId }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
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
  if (isLoading) {
    return <div>Loading comments...</div>;
  }

  if (!comments || comments.length === 0) {
    return <div className="text-sm text-gray-500">No comments yet.</div>;
  }

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
              <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
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