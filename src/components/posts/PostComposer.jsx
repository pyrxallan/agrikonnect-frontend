import React, { useState, useRef } from 'react';
import ImageUpload from './ImageUpload';

const PostComposer = ({
  onSubmit,
  onCancel,
  placeholder = "What's on your mind?",
  userInitial = "U",
  userAvatar,
  className = '',
}) => {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [anonymous, setAnonymous] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [formError, setFormError] = useState(null);

  const textInputRef = useRef(null);

  const resetForm = () => {
    setText('');
    setSelectedImage(null);
    setAnonymous(false);
    setFormError(null);
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const hasText = text.trim().length > 0;
    const hasImage = selectedImage !== null;

    if (!hasText && !hasImage) {
      setFormError("Post cannot be empty.");
      return;
    }

    setIsPosting(true);
    try {
      if (onSubmit) {
        await onSubmit({
          content: text.trim(),
          imageFile: selectedImage,
          isAnonymous: anonymous
        });
        resetForm();
      }
    } catch (err) {
      console.error("Composer error:", err);
      setFormError(err.message || "Something went wrong.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`bg-white rounded-xl border border-gray-200 p-4 ${className}`}>
      <div className="flex gap-3">
        {/* User Avatar / Initial */}
        <div className="flex-shrink-0">
          {userAvatar ? (
            <img src={userAvatar} alt="Your avatar" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm border border-emerald-200">
              {userInitial}
            </div>
          )}
        </div>

        {/* Main Input Area */}
        <div className="flex-1">
          <textarea
            ref={textInputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            rows={3}
            disabled={isPosting}
            className="w-full resize-none bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition disabled:bg-gray-100"
          />
          
          {/* Display Form Errors */}
          {formError && (
            <p className="text-xs text-red-500 mt-1">{formError}</p>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between pl-0 sm:pl-13">
        <div className="flex items-center space-x-4">
          <ImageUpload onImageSelect={setSelectedImage} disabled={isPosting} />
          
          <label className="flex items-center space-x-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              disabled={isPosting}
              className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-xs text-gray-500 group-hover:text-gray-700 select-none">
              Post Anonymously
            </span>
          </label>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={resetForm}
            disabled={isPosting}
            className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={isPosting || (!text.trim() && !selectedImage)}
            className="px-5 py-1.5 bg-emerald-600 text-white text-sm font-semibold rounded-full hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[70px]"
          >
            {isPosting ? (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Post"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PostComposer;