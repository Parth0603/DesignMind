import { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

const SpotEditor = ({ image, onSpotEdit, onApplyEdit, isLoading, className = '' }) => {
  const [showModal, setShowModal] = useState(false)
  const [editZones, setEditZones] = useState([])
  const [activeZone, setActiveZone] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const imageRef = useRef(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleImageClick = (e) => {
    if (!imageRef.current) return

    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    const newZone = {
      id: Date.now(),
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
      prompt: '',
      status: 'pending'
    }

    setEditZones(prev => [...prev, newZone])
    setActiveZone(newZone.id)
  }

  const handlePromptSubmit = async (zoneId, prompt) => {
    if (!prompt.trim()) return

    const zone = editZones.find(z => z.id === zoneId)
    if (!zone) return

    setEditZones(prev => prev.map(z => 
      z.id === zoneId ? { ...z, status: 'processing', prompt } : z
    ))

    try {
      // Use current preview image as base, or original image if no preview yet
      const baseImage = previewImage || image.url
      
      const result = await onSpotEdit({
        coordinates: { x: zone.x, y: zone.y },
        prompt,
        zoneId,
        baseImage
      })
      
      console.log('Spot edit result:', result)
      
      if (result && result.imageUrl) {
        console.log('Updating preview image with accumulated changes')
        setPreviewImage(result.imageUrl)
        setEditZones(prev => prev.map(z => 
          z.id === zoneId ? { ...z, status: 'completed', prompt } : z
        ))
      } else {
        console.log('No image URL in result')
        setEditZones(prev => prev.map(z => 
          z.id === zoneId ? { ...z, status: 'error' } : z
        ))
      }
    } catch (error) {
      console.error('Spot edit error:', error)
      setEditZones(prev => prev.map(z => 
        z.id === zoneId ? { ...z, status: 'error' } : z
      ))
    }

    setActiveZone(null)
  }

  const applyChanges = () => {
    if (previewImage && onApplyEdit) {
      const lastCompletedZone = editZones.find(z => z.status === 'completed')
      onApplyEdit(previewImage, lastCompletedZone?.prompt || 'Spot edit')
      setShowModal(false)
      setEditZones([])
      setPreviewImage(null)
    }
  }

  const removeZone = (zoneId) => {
    setEditZones(prev => prev.filter(z => z.id !== zoneId))
    if (activeZone === zoneId) setActiveZone(null)
  }

  const clearAllZones = () => {
    setEditZones([])
    setActiveZone(null)
  }

  if (!image) return null

  return (
    <div className={`spot-editor ${className}`}>
      <div className="spot-editor-controls">
        <button
          className="edit-mode-btn"
          onClick={() => setShowModal(true)}
          title="Open Spot Editor"
        >
          🎯 Spot Edit Mode
        </button>
      </div>

      {showModal && (
        <div className="spot-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="spot-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🎯 Spot Editor</h3>
              <div className="modal-controls">
                {editZones.length > 0 && (
                  <>
                    <span className="zone-counter">{editZones.length} zones</span>
                    <button onClick={clearAllZones} className="clear-zones-btn">
                      🗑️ Clear
                    </button>
                  </>
                )}
                <button onClick={() => setShowModal(false)} className="close-btn">
                  ✕
                </button>
              </div>
            </div>
            
            <div className="modal-content">
              <div className="editor-layout">
                <div className="edit-panel">
                  <p className="instructions">Click anywhere on the image to add edit zones</p>
                  <div className="image-container">
                    <img
                      ref={imageRef}
                      src={image.url}
                      alt="Room for spot editing"
                      className="spot-image edit-mode"
                      onClick={handleImageClick}
                      onLoad={() => setImageLoaded(true)}
                    />

                    {imageLoaded && editZones.map((zone) => (
                      <EditZone
                        key={zone.id}
                        zone={zone}
                        isActive={activeZone === zone.id}
                        onPromptSubmit={handlePromptSubmit}
                        onRemove={removeZone}
                        isLoading={isLoading && zone.status === 'processing'}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="preview-panel">
                  <h4>Preview</h4>
                  {previewImage ? (
                    <div className="preview-container">
                      <img src={previewImage} alt="Preview" className="preview-image" />
                      <button onClick={applyChanges} className="apply-btn">
                        ✨ Apply Changes
                      </button>
                    </div>
                  ) : (
                    <div className="no-preview">
                      <p>Make edits to see preview</p>
                      <small>Preview state: {previewImage ? 'has image' : 'no image'}</small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .spot-editor {
          position: relative;
          width: 100%;
        }

        .spot-editor-controls {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .spot-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .spot-modal {
          background: white;
          border-radius: 1rem;
          max-width: 95vw;
          max-height: 90vh;
          overflow: visible;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          min-width: 800px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background: #007bff;
          color: white;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.25rem;
        }

        .modal-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .modal-content {
          padding: 1.5rem;
          max-height: 70vh;
          overflow: visible;
        }

        .editor-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 1.5rem;
        }

        .edit-panel {
          min-width: 0;
        }

        .preview-panel {
          border-left: 1px solid #e5e7eb;
          padding-left: 1.5rem;
        }

        .preview-panel h4 {
          margin: 0 0 1rem 0;
          color: #374151;
          font-size: 1rem;
        }

        .preview-container {
          text-align: center;
        }

        .preview-image {
          width: 100%;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .apply-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
        }

        .apply-btn:hover {
          background: #218838;
          transform: translateY(-1px);
        }

        .no-preview {
          text-align: center;
          color: #9ca3af;
          padding: 2rem;
          border: 2px dashed #d1d5db;
          border-radius: 0.5rem;
        }

        .instructions {
          text-align: center;
          color: #6b7280;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.2s;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .edit-mode-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .edit-mode-btn:hover {
          background: #0056b3;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
        }

        .zone-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .zone-counter {
          font-size: 0.85rem;
          color: #6b7280;
          font-weight: 500;
        }

        .clear-zones-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-zones-btn:hover {
          background: #c82333;
        }

        .image-container {
          position: relative;
          width: 100%;
          border-radius: 0.5rem;
          overflow: visible;
        }

        .spot-image {
          width: 100%;
          height: auto;
          display: block;
          transition: all 0.3s ease;
        }

        .spot-image.edit-mode {
          cursor: crosshair;
        }

        .spot-image.edit-mode:hover {
          filter: brightness(1.05);
        }


      `}</style>
    </div>
  )
}

const EditZone = ({ zone, isActive, onPromptSubmit, onRemove, isLoading }) => {
  const [prompt, setPrompt] = useState('')
  const [showChat, setShowChat] = useState(isActive)
  const inputRef = useRef(null)

  useEffect(() => {
    setShowChat(isActive)
    if (isActive && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isActive])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (prompt.trim()) {
      onPromptSubmit(zone.id, prompt)
      setPrompt('')
    }
  }

  const getStatusColor = () => {
    switch (zone.status) {
      case 'processing': return '#f59e0b'
      case 'completed': return '#10b981'
      case 'error': return '#ef4444'
      default: return '#007bff'
    }
  }

  const getStatusIcon = () => {
    switch (zone.status) {
      case 'processing': return '⏳'
      case 'completed': return '✅'
      case 'error': return '❌'
      default: return '🎯'
    }
  }

  return (
    <>
      <div
        className="edit-zone-marker"
        style={{
          left: `${zone.x}%`,
          top: `${zone.y}%`,
          borderColor: getStatusColor()
        }}
        onClick={(e) => {
          e.stopPropagation()
          setShowChat(!showChat)
        }}
      >
        <div className="zone-pulse" style={{ borderColor: getStatusColor() }} />
        <div className="zone-icon">{getStatusIcon()}</div>
      </div>

      {showChat && (
        <div
          className="edit-zone-chat"
          style={{
            left: `${Math.min(zone.x, 70)}%`,
            top: `${Math.max(zone.y - 10, 5)}%`
          }}
        >
          <div className="chat-header">
            <span>Edit this spot</span>
            <button onClick={() => onRemove(zone.id)} className="remove-btn">×</button>
          </div>
          
          <form onSubmit={handleSubmit} className="chat-form">
            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe changes for this area..."
              className="prompt-input"
              disabled={isLoading}
            />
            <div className="chat-actions">
              <button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className="apply-btn"
              >
                {isLoading ? '⏳' : '✨'} Apply
              </button>
              <button
                type="button"
                onClick={() => setShowChat(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>

          {zone.prompt && (
            <div className="zone-history">
              <small>Last edit: {zone.prompt}</small>
            </div>
          )}
        </div>
      )}

      <style>{`
        .edit-zone-marker {
          position: absolute;
          width: 24px;
          height: 24px;
          border: 3px solid;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          cursor: pointer;
          z-index: 10;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .edit-zone-marker:hover {
          transform: translate(-50%, -50%) scale(1.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .zone-pulse {
          position: absolute;
          width: 40px;
          height: 40px;
          border: 2px solid;
          border-radius: 50%;
          animation: zonePulse 2s infinite;
          opacity: 0.6;
        }

        .zone-icon {
          font-size: 12px;
          z-index: 1;
        }

        @keyframes zonePulse {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }

        .edit-zone-chat {
          position: absolute;
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          border: 1px solid #e5e7eb;
          min-width: 280px;
          z-index: 9999;
          animation: scaleIn 0.2s ease-out;
        }

        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #007bff;
          color: white;
          border-radius: 0.5rem 0.5rem 0 0;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .remove-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0.2rem;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .remove-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .chat-form {
          padding: 1rem;
        }

        .prompt-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
          transition: border-color 0.2s;
        }

        .prompt-input:focus {
          outline: none;
          border-color: #007bff;
        }

        .chat-actions {
          display: flex;
          gap: 0.5rem;
        }

        .apply-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          flex: 1;
          transition: all 0.2s ease;
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
          background: #6c757d;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cancel-btn:hover {
          background: #5a6268;
        }

        .zone-history {
          padding: 0.5rem 1rem;
          background: #f8f9fa;
          border-top: 1px solid #e5e7eb;
          font-size: 0.8rem;
          color: #6b7280;
        }
      `}</style>
    </>
  )
}

SpotEditor.propTypes = {
  image: PropTypes.shape({
    url: PropTypes.string.isRequired
  }),
  onSpotEdit: PropTypes.func.isRequired,
  onApplyEdit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  className: PropTypes.string
}

EditZone.propTypes = {
  zone: PropTypes.shape({
    id: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    prompt: PropTypes.string,
    status: PropTypes.string.isRequired
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  onPromptSubmit: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
}

export default SpotEditor