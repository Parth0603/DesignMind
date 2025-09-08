import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import DownloadModal from './DownloadModal'
import ConstructionLoader from './ConstructionLoader'
import { addWatermark } from '../utils/watermark'

const ImageDisplay = ({ image, originalImage, isLoading, loadingMessage, className = '' }) => {
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [watermarkedImage, setWatermarkedImage] = useState(null)
  const [cleanImage, setCleanImage] = useState(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (image?.url) {
      setCleanImage(image.url)
      if (image.isGenerated) {
        addWatermark(image.url).then(setWatermarkedImage)
      } else {
        setWatermarkedImage(null)
      }
    }
  }, [image])

  if (!image && !isLoading) {
    return (
      <div className={`image-display empty ${className}`}>
        <div className="empty-state">
          <div className="empty-icon">🏠</div>
          <h3>No Image Selected</h3>
          <p>Upload a room image to start designing</p>
        </div>

        <style>{`
          .image-display.empty {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            background: #f8f9fa;
            border: 2px dashed #dee2e6;
            border-radius: 0.75rem;
          }

          .empty-state {
            text-align: center;
            color: #6c757d;
          }

          .empty-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
          }

          .empty-state h3 {
            margin-bottom: 0.5rem;
            color: #495057;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className={`image-display ${className}`}>
      {isLoading && (
        <ConstructionLoader message={loadingMessage || 'Generating your room design...'} />
      )}
      
      {image && (
        <div className="image-container">
          <div className="image-controls">
            <button 
              className="control-btn"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
            >
              {isFullscreen ? '🔳' : '⛶'}
            </button>
            <button 
              className="control-btn"
              onClick={() => setShowDownloadModal(true)}
              title="Download image"
            >
              💾
            </button>
          </div>
          
          <img
            src={watermarkedImage || image.url}
            alt={image.isGenerated ? 'Generated room design' : 'Room photo'}
            className={`room-image ${isFullscreen ? 'fullscreen' : ''}`}
            onLoad={() => console.log('Image loaded successfully')}
            onError={(e) => console.error('Image failed to load:', e)}
          />
          
          {isFullscreen && (
            <button 
              className="fullscreen-close"
              onClick={() => setIsFullscreen(false)}
              title="Exit fullscreen"
            >
              ✕
            </button>
          )}
        </div>
      )}
      
      {image && image.isGenerated && image.prompt && (
        <div className="image-caption">
          <div className="caption-card">
            <div className="caption-header">
              <span className="caption-icon">🎨</span>
              <span className="caption-title">Generated Design</span>
            </div>
            <div className="caption-text">
              {image.prompt.length > 80 
                ? `${image.prompt.substring(0, 80)}...` 
                : image.prompt
              }
            </div>
          </div>
        </div>
      )}

      <DownloadModal 
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        onDownload={() => {
          window.open('https://your-subscription-page.com', '_blank')
          setShowDownloadModal(false)
        }}
        onSkip={async () => {
          const link = document.createElement('a')
          link.download = `homecanvas-design-${Date.now()}.jpg`
          link.href = cleanImage || image?.url
          link.click()
          setShowDownloadModal(false)
        }}
      />

      <style>{`
        .image-display {
          position: relative;
          width: 100%;
          background: white;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .image-container {
          position: relative;
          width: 100%;
        }

        .image-controls {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          gap: 0.5rem;
          z-index: 5;
        }

        .control-btn {
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 0.5rem;
          padding: 0.5rem;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s ease;
          backdrop-filter: blur(4px);
        }

        .control-btn:hover {
          background: white;
          transform: scale(1.1);
        }

        .room-image {
          width: 100%;
          height: auto;
          max-height: 800px;
          object-fit: contain;
          display: block;
          transition: all 0.3s ease;
        }

        .room-image.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          max-height: none;
          object-fit: contain;
          background: rgba(0, 0, 0, 0.9);
          z-index: 1000;
          cursor: pointer;
        }

        .fullscreen-close {
          position: fixed;
          top: 2rem;
          right: 2rem;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 3rem;
          height: 3rem;
          font-size: 1.5rem;
          cursor: pointer;
          z-index: 1001;
          transition: all 0.2s ease;
        }

        .fullscreen-close:hover {
          background: white;
          transform: scale(1.1);
        }

        .image-caption {
          margin-top: 1rem;
          padding: 0;
        }

        .caption-card {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          padding: 1rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          text-align: left;
        }

        .caption-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .caption-icon {
          font-size: 1.1rem;
        }

        .caption-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .caption-text {
          font-size: 0.9rem;
          color: #4b5563;
          line-height: 1.4;
          margin-bottom: 0.5rem;
          font-style: italic;
        }

        .caption-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .generation-time {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .room-image {
            max-height: 400px;
          }
          
          .caption-card {
            padding: 1rem;
          }
          
          .caption-text {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  )
}

ImageDisplay.propTypes = {
  image: PropTypes.shape({
    url: PropTypes.string.isRequired,
    prompt: PropTypes.string,
    isGenerated: PropTypes.bool,
    id: PropTypes.number
  }),
  originalImage: PropTypes.shape({
    url: PropTypes.string.isRequired,
    id: PropTypes.number
  }),
  isLoading: PropTypes.bool,
  loadingMessage: PropTypes.string,
  className: PropTypes.string
}

export default ImageDisplay