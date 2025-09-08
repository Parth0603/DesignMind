import { useState, useRef } from 'react'
import PropTypes from 'prop-types'

const SimpleSpotEditor = ({ image, onSpotEdit, isLoading }) => {
  const [spots, setSpots] = useState([])
  const [activeSpot, setActiveSpot] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const imageRef = useRef(null)

  const handleImageClick = (e) => {
    if (!imageRef.current) return
    
    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    const newSpot = {
      id: Date.now(),
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y)),
      prompt: ''
    }
    
    setSpots([...spots, newSpot])
    setActiveSpot(newSpot.id)
  }

  const addRedDotToImage = (imageUrl, x, y) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        
        // For demo: just return original image without marker
        // const dotX = (x / 100) * img.width
        // const dotY = (y / 100) * img.height
        
        resolve(canvas.toDataURL('image/jpeg', 0.9))
      }
      
      img.src = imageUrl
    })
  }

  const handlePromptSubmit = async (spotId, prompt) => {
    if (!prompt.trim()) return
    
    try {
      const spot = spots.find(s => s.id === spotId)
      let baseImage = previewImage || image.url
      if (baseImage.startsWith('data:')) {
        baseImage = baseImage
      } else {
        baseImage = image.url
      }
      const imageWithRedDot = await addRedDotToImage(baseImage, spot.x, spot.y)
      
      const result = await onSpotEdit({
        coordinates: { x: spot.x, y: spot.y },
        prompt: `Transform this room image by making this specific change: ${prompt}. Show the room after this modification has been applied.`,
        baseImage: baseImage
      })
      
      if (result?.imageUrl) {
        setPreviewImage(result.imageUrl)
        setSpots(spots.map(s => s.id === spotId ? { ...s, prompt } : s))
      }
    } catch (error) {
      console.error('Spot edit failed:', error)
    }
    
    setActiveSpot(null)
  }

  const applyToMain = () => {
    if (previewImage && onSpotEdit) {
      // Apply preview to main image
      window.location.reload() // Simple way to update main image
    }
  }

  return (
    <div className="simple-spot-editor">
      <div className="editor-container">
        <div className="image-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4>Click on image to edit spots</h4>
            <button onClick={() => setSpots([])} style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
              Clear Spots
            </button>
          </div>
          <div className="image-wrapper">
            <img
              ref={imageRef}
              src={image.url}
              alt="Room"
              onClick={handleImageClick}
              style={{ width: '100%', cursor: 'crosshair' }}
            />
            
            {spots.map(spot => (
              <div
                key={spot.id}
                className="spot-marker"
                style={{
                  position: 'absolute',
                  left: `${spot.x}%`,
                  top: `${spot.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '12px',
                  height: '12px',
                  background: '#ff0000',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  zIndex: 10
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveSpot(spot.id)
                }}
              />
            ))}
            
            {activeSpot && (
              <div style={{
                position: 'absolute',
                left: '10px',
                bottom: '10px',
                background: 'white',
                padding: '10px',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                zIndex: 100,
                width: '250px'
              }}>
                <input
                  type="text"
                  placeholder="Describe changes..."
                  style={{ width: '100%', padding: '8px', marginBottom: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      handlePromptSubmit(activeSpot, e.target.value)
                      e.target.value = ''
                      setActiveSpot(null)
                    }
                  }}
                  autoFocus
                />
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button 
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Describe changes..."]')
                      if (input.value.trim()) {
                        handlePromptSubmit(activeSpot, input.value)
                        input.value = ''
                        setActiveSpot(null)
                      }
                    }}
                    style={{ flex: 1, padding: '6px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
                  >
                    Apply
                  </button>
                  <button 
                    onClick={() => setActiveSpot(null)}
                    style={{ padding: '6px 12px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {previewImage && (
          <div className="preview-section">
            <h4>Preview</h4>
            <img src={previewImage} alt="Preview" className="preview-img" />
            <button onClick={applyToMain} className="apply-main-btn">
              Apply to Main Image
            </button>
          </div>
        )}
      </div>
      
      <style>{`
        .simple-spot-editor {
          padding: 20px;
        }
        .editor-container {
          display: grid;
          grid-template-columns: ${previewImage ? '2fr 1fr' : '1fr'};
          gap: 20px;
        }
        .image-wrapper {
          position: relative;
          display: inline-block;
        }
        .preview-section {
          border-left: 1px solid #ddd;
          padding-left: 20px;
        }
        .preview-img {
          width: 100%;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .apply-main-btn {
          width: 100%;
          padding: 12px;
          margin-top: 15px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .apply-main-btn:hover {
          background: #218838;
          transform: translateY(-1px);
        }
        .spot-marker {
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
        }
        .spot-marker:hover {
          transform: translate(-50%, -50%) scale(1.2);
        }
      `}</style>
    </div>
  )
}

const SpotPrompt = ({ spot, onSubmit, onClose, isLoading }) => {
  const [prompt, setPrompt] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (prompt.trim()) {
      onSubmit(spot.id, prompt)
      setPrompt('')
    }
  }

  return (
    <>
      <div className="spot-overlay" onClick={onClose} />
      <div className="spot-prompt">
        <div className="prompt-header">
          <h4>🎯 Edit this spot</h4>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe changes for this area..."
            className="prompt-input"
            autoFocus
          />
          <div className="prompt-actions">
            <button type="submit" disabled={!prompt.trim() || isLoading} className="apply-btn">
              {isLoading ? '⏳ Processing...' : '✨ Apply'}
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
      
      <style>{`
        .spot-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999998;
        }
        
        .spot-prompt {
          position: fixed;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          z-index: 999999;
          width: 350px;
          max-width: 90vw;
        }
        
        .prompt-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 20px 0 20px;
        }
        
        .prompt-header h4 {
          margin: 0;
          color: #333;
          font-size: 1.1rem;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .close-btn:hover {
          background: #f0f0f0;
        }
        
        .spot-prompt form {
          padding: 20px;
        }
        
        .prompt-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 16px;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        
        .prompt-input:focus {
          outline: none;
          border-color: #007bff;
        }
        
        .prompt-actions {
          display: flex;
          gap: 12px;
        }
        
        .apply-btn {
          flex: 1;
          background: #007bff;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .apply-btn:hover:not(:disabled) {
          background: #0056b3;
          transform: translateY(-1px);
        }
        
        .apply-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .cancel-btn {
          background: #f8f9fa;
          color: #666;
          border: 1px solid #dee2e6;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .cancel-btn:hover {
          background: #e9ecef;
        }
      `}</style>
    </>
  )
}

SimpleSpotEditor.propTypes = {
  image: PropTypes.object.isRequired,
  onSpotEdit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
}

SpotPrompt.propTypes = {
  spot: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
}

export default SimpleSpotEditor