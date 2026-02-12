import React, { useRef, useState } from 'react';

const ImageUpload = ({
  onImageSelect, 
  label = 'Add image',
  maxSizeMB = 5,
  className = ''
}) => {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setError('');
    
    if (!file) {
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB} MB.`);
      return;
    }
    
    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      if (onImageSelect) {
        onImageSelect(file);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={`flex flex-col items-start gap-2 ${className}`}>
      <button
        type="button"
        onClick={() => fileInputRef.current.click()}
        className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600 hover:bg-gray-100"
      >
        {label}
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
      {fileName && <span className="text-xs text-gray-500">{fileName}</span>}
      {preview && (
        <div className="relative mt-2">
          <img src={preview} alt="Preview" className="h-24 w-24 rounded object-cover" />
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              setFileName('');
              if (onImageSelect) {
                onImageSelect(null);
              }
            }}
            className="absolute top-0 right-0 -mt-1 -mr-1 rounded-full bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center hover:bg-red-700"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;