import React, { useState, useRef } from 'react';
import ImageUpload from './ImageUpload';

// Component for composing a new post with text content and optional image upload

const PostComposer = ({ 
  onSubmit, 
  onCancel,
  placeholder = "What's on your mind?",
  userInitial = "Y",
  userAvatar,
  className = ''
}) => {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef(null);

  //handle form submission

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    //reset error state
    setError('');

    //validate content
    const trimmed = content.trim();
    if (!trimmed && !imageFile) {
      setError('Please enter some content or select an image.');
      return;
    }

    //call onSubmit prop with content and image file, and handle loading state
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit({ content: trimmed, imageFile });
      }
        // Clear form on success
      setContent('');
      setImageFile(null);
      
    } catch (err) {
      // Handle submission error
      setError(err.message || 'Failed to create post. Please try again.');
      console.error('Post submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  //handle clear form
  const handleClear = () => {
    setContent('');
    setImageFile(null);
    setError('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={`bg-white p-4 rounded-lg shadow ${className}`}>
      <div className="flex items-start gap-3">
        {userAvatar ? (
          <img src={userAvatar} alt="User Avatar" className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="h-10 w-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold">
            {userInitial}
          </div>
        )}
        <textarea
          ref={textareaRef}
          className="flex-1 resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 focus:outline-none"
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <ImageUpload onImageSelect={setImageFile} className="flex-shrink-0" />
        <div className="flex items-center gap-2">
          {error && <span className="text-sm text-red-500">{error}</span>}
          <button
            type="button"
            onClick={handleClear}
            className="text-sm text-gray-600 hover:text-gray-900"
            disabled={isSubmitting}
          >
            Clear
          </button>
          <button
            type="submit"
            className="rounded-full bg-green-600 px-4 py-1.5 text-sm text-white hover:bg-green-700 disabled:opacity-60"
            disabled={isSubmitting || (!content.trim() && !imageFile)}
          >
            Post
          </button>
        </div>
      </div>
    </form>
  );
};

export default PostComposer;
