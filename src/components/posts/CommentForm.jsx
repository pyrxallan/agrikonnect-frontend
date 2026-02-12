import React, { useState } from 'react';

const CommentForm = ({ onSubmit }) => {
  const [content, setContent] = useState('');
  
  const handleSubmit = (e) => {
	e.preventDefault();
	const trimmed = content.trim();
	if (!trimmed) return;
	if (onSubmit) {
	  onSubmit(trimmed);
	}
	setContent('');
  };

  return (
	<form onSubmit={handleSubmit} className="mt-4 flex items-center gap-3">
	  <input
		type="text"
		className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 focus:outline-none"
		placeholder="Write a comment..."
		value={content}
		onChange={(e) => setContent(e.target.value)}
	  />
	  <button
		type="submit"
		className="rounded-full bg-green-600 px-4 py-1.5 text-sm text-white hover:bg-green-700 disabled:opacity-60"
		disabled={content.trim().length === 0}
	  >
		Post
	  </button>
	</form>
  );
};

export default CommentForm;