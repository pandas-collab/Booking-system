import React, { useState, useRef } from 'react';
import './AvatarUpload.css';

const AvatarUpload = ({ 
  currentAvatar, 
  onUpload, 
  onError,
  maxSize = 5 * 1024 * 1024, // 5MB default
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
  size = 120,
  disabled = false
}) => {
  const [preview, setPreview] = useState(currentAvatar || null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!file) return false;

    if (!allowedTypes.includes(file.type)) {
      onError?.('Invalid file type. Please select a JPEG, PNG, or GIF image.');
      return false;
    }

    if (file.size > maxSize) {
      onError?.(`File size too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB.`);
      return false;
    }

    return true;
  };

  const handleFileSelect = (file) => {
    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    handleUpload(file);
  };

  const handleUpload = async (file) => {
    if (!onUpload) return;

    setUploading(true);
    try {
      await onUpload(file);
    } catch (error) {
      onError?.(error.message || 'Failed to upload avatar');
      setPreview(currentAvatar);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled && !uploading) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    if (disabled || uploading) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="avatar-upload">
      <div
        className={`avatar-upload__container ${dragOver ? 'drag-over' : ''} ${uploading ? 'uploading' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ width: size, height: size }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedTypes.join(',')}
          onChange={handleFileInputChange}
          className="avatar-upload__input"
          disabled={disabled || uploading}
        />
        
        {preview ? (
          <img
            src={preview}
            alt="Avatar preview"
            className="avatar-upload__preview"
          />
        ) : (
          <div className="avatar-upload__placeholder">
            <svg
              className="avatar-upload__icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        )}
        
        {uploading && (
          <div className="avatar-upload__overlay">
            <div className="avatar-upload__spinner">
              <svg className="spinner" viewBox="0 0 50 50">
                <circle
                  className="path"
                  cx="25"
                  cy="25"
                  r="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeMiterlimit="10"
                />
              </svg>
            </div>
          </div>
        )}
        
        <div className="avatar-upload__hover-overlay">
          <svg
            className="avatar-upload__camera-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="avatar-upload__hover-text">
            {preview ? 'Change Photo' : 'Add Photo'}
          </span>
        </div>
      </div>
      
      <div className="avatar-upload__info">
        <p className="avatar-upload__instructions">
          Click to upload or drag and drop
        </p>
        <p className="avatar-upload__requirements">
          {allowedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} up to {formatFileSize(maxSize)}
        </p>
      </div>
    </div>
  );
};

export { AvatarUpload };