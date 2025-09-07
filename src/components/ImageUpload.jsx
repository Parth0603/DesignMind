import { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { validateImageFile, formatFileSize } from '../utils/imageUtils'

const ImageUpload = ({ onImageUpload, isLoading, uploadProgress, className = '' }) => {
  const fileInputRef = useRef(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState('')
  const [dragCounter, setDragCounter] = useState(0)

  const handleFileSelect = async (file) => {
    const validation = validateImageFile(file)
    if (!validation.valid) {
      setError(validation.error)
      return
    }
    
    setError('')
    await onImageUpload(file)
  }

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    if (file) handleFileSelect(file)
    e.target.value = '' // Reset input
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    setDragCounter(0)
    
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    setDragCounter(prev => prev + 1)
    setIsDragOver(true)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragCounter(prev => {
      const newCount = prev - 1
      if (newCount === 0) {
        setIsDragOver(false)
      }
      return newCount
    })
  }

  return (
    <div className={`image-upload ${className}`}>
      <div
        className={`upload-area ${isDragOver ? 'drag-over' : ''} ${isLoading ? 'loading' : ''}`}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isLoading && fileInputRef.current?.click()}
      >
        {isLoading ? (
          <div className="upload-content">
            <div className="upload-progress">
              <div className="progress-circle">
                <div className="progress-text">{uploadProgress}%</div>
              </div>
              <p>Processing your image...</p>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="upload-content">
            <div className="upload-icon">📸</div>
            <h3>Upload Your Room Photo</h3>
            <p>Drag and drop an image here, or click to browse</p>
            <small>Supports JPEG, PNG, WebP (max 10MB)</small>
            <div className="upload-tips">
              <div className="tip">💡 Best results with well-lit rooms</div>
              <div className="tip">📐 Clear view of furniture works best</div>
            </div>
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileInput}
        style={{ display: 'none' }}
        aria-label="Upload room image"
        disabled={isLoading}
      />
      
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <style>{`
        .image-upload {
          width: 100%;
        }

        .upload-area {
          border: 2px dashed var(--neutral-400);
          border-radius: 0.75rem;
          padding: 3rem 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: var(--neutral-100);
          position: relative;
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .upload-area:hover:not(.loading),
        .upload-area.drag-over {
          border-color: var(--primary);
          background: var(--neutral-200);
          transform: translateY(-2px);
        }

        .upload-area.loading {
          cursor: not-allowed;
          border-color: var(--secondary);
          background: var(--neutral-50);
        }

        .upload-content {
          width: 100%;
        }

        .upload-content h3 {
          margin: 1rem 0 0.5rem;
          color: var(--neutral-800);
          font-size: 1.25rem;
        }

        .upload-content p {
          color: var(--neutral-600);
          margin-bottom: 0.5rem;
        }

        .upload-content small {
          color: var(--neutral-500);
          font-size: 0.875rem;
          display: block;
          margin-bottom: 1rem;
        }

        .upload-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .upload-tips {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 1rem;
          flex-wrap: wrap;
        }

        .tip {
          font-size: 0.75rem;
          color: var(--neutral-500);
          background: var(--neutral-200);
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
        }

        .upload-progress {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .progress-circle {
          width: 60px;
          height: 60px;
          border: 3px solid var(--neutral-300);
          border-top: 3px solid var(--primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: spin 1s linear infinite;
        }

        .progress-text {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--primary);
        }

        .progress-bar {
          width: 200px;
          height: 4px;
          background: var(--neutral-300);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--primary);
          transition: width 0.3s ease;
        }

        .error-message {
          margin-top: 1rem;
          padding: 0.75rem;
          background: #fed7d7;
          color: var(--error);
          border-radius: 0.5rem;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .error-icon {
          font-size: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .upload-area {
            padding: 2rem 1rem;
          }
          
          .upload-icon {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  )
}

ImageUpload.propTypes = {
  onImageUpload: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  uploadProgress: PropTypes.number,
  className: PropTypes.string
}

export default ImageUpload