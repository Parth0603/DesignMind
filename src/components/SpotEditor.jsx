import { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

const SpotEditor = ({ image, onSpotEdit, onApplyEdit, isLoading, className = '' }) => {
  const [showModal, setShowModal] = useState(false)
  const [editZones, setEditZones] = useState([])
  const [activeZone, setActiveZone] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const imageRef = useRef(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  // Reset state when modal opens
  useEffect(() => {
    if (showModal) {
      setEditZones([])
      setActiveZone(null)
      setPreviewImage(null)
    }
  }, [showModal])

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showModal) {
        if (e.key === 'Escape') {
          setShowModal(false)
        }
      }
    }

    if (showModal) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showModal])

  const handleImageClick = (e) => {
    if (!imageRef.current) return

    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // Create ripple effect at click position
    const ripple = document.createElement('div')
    ripple.className = 'click-ripple'
    ripple.style.left = `${e.clientX - rect.left}px`
    ripple.style.top = `${e.clientY - rect.top}px`
    imageRef.current.parentElement.appendChild(ripple)
    
    setTimeout(() => ripple.remove(), 600)

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
      let baseImage = previewImage || image.url
      if (baseImage.startsWith('data:')) {
        baseImage = baseImage.split(',')[1]
      }
      
      const result = await onSpotEdit({
        coordinates: { x: zone.x, y: zone.y },
        prompt,
        zoneId,
        baseImage
      })
      
      if (result && result.imageUrl) {
        setPreviewImage(result.imageUrl)
        setEditZones(prev => prev.map(z => 
          z.id === zoneId ? { ...z, status: 'completed', prompt } : z
        ))
      } else {
        setEditZones(prev => prev.map(z => 
          z.id === zoneId ? { ...z, status: 'error' } : z
        ))
      }
    } catch (error) {
      setEditZones(prev => prev.map(z => 
        z.id === zoneId ? { ...z, status: 'error' } : z
      ))
    }

    setActiveZone(null)
  }

  const applyChangesToMainImage = () => {
    if (previewImage && onApplyEdit) {
      const completedZones = editZones.filter(z => z.status === 'completed')
      const promptSummary = completedZones.length > 1 
        ? `Multiple spot edits (${completedZones.length} areas)` 
        : completedZones[0]?.prompt || 'Spot edit'
      
      onApplyEdit(previewImage, promptSummary)
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
                    <span className="zone-counter">
                      {editZones.length} zone{editZones.length !== 1 ? 's' : ''}
                      {editZones.filter(z => z.status === 'completed').length > 0 && 
                        ` (${editZones.filter(z => z.status === 'completed').length} completed)`
                      }
                    </span>
                    <button onClick={clearAllZones} className="clear-zones-btn">
                      🗑️ Clear All
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
                  <div className="instructions-panel">
                    <p className="instructions">Click anywhere on the image to add edit zones</p>
                    <div className="keyboard-shortcuts">
                      <small>
                        <kbd>Esc</kbd> Close editor • 
                        <kbd>Enter</kbd> Apply edit • 
                        <kbd>Del</kbd> Remove zone
                      </small>
                    </div>
                  </div>
                  <div className="image-container">
                    <div className="image-wrapper">
                      <img
                        ref={imageRef}
                        src={image.url}
                        alt="Room for spot editing"
                        className={`spot-image ${isEditMode ? 'edit-mode' : ''}`}
                        onClick={handleImageClick}
                        onLoad={() => setImageLoaded(true)}
                        onMouseEnter={() => setIsEditMode(true)}
                        onMouseLeave={() => setIsEditMode(false)}
                      />
                      {isEditMode && (
                        <div className="edit-overlay">
                          <div className="crosshair-h"></div>
                          <div className="crosshair-v"></div>
                        </div>
                      )}
                    </div>

                    {imageLoaded && editZones.map((zone) => (
                      <div key={zone.id} className="zone-wrapper">
                        <EditZone
                          zone={zone}
                          isActive={activeZone === zone.id}
                          onPromptSubmit={handlePromptSubmit}
                          onRemove={removeZone}
                          isLoading={isLoading && zone.status === 'processing'}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="preview-panel">
                  {previewImage ? (
                    <div className="preview-container">
                      <img src={previewImage} alt="Preview" className="preview-image" />
                      <button onClick={applyChangesToMainImage} className="apply-main-btn">
                        ✅ Apply to Main Image
                      </button>
                    </div>
                  ) : (
                    <div className="no-preview">
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
          width: 90vw;
          max-width: 1200px;
          max-height: 85vh;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
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
          max-height: calc(85vh - 80px);
          overflow: hidden;
          position: relative;
        }

        .editor-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
          height: 100%;
        }

        .edit-panel {
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .preview-panel {
          border-left: 1px solid #e5e7eb;
          padding-left: 1.5rem;
          display: flex;
          flex-direction: column;
          min-width: 250px;
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

        .apply-main-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          font-size: 0.9rem;
        }

        .apply-main-btn:hover {
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

        .instructions-panel {
          text-align: center;
          margin-bottom: 1rem;
        }

        .instructions {
          color: #6b7280;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .keyboard-shortcuts {
          color: #9ca3af;
          font-size: 0.75rem;
        }

        .keyboard-shortcuts kbd {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 0.25rem;
          padding: 0.125rem 0.25rem;
          font-size: 0.7rem;
          font-family: monospace;
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
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
          box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
        }

        .edit-mode-btn:hover {
          background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4);
        }

        .edit-mode-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
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
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }

        .image-wrapper {
          position: relative;
          display: inline-block;
          width: 100%;
        }

        .zone-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .zone-wrapper > * {
          pointer-events: auto;
        }

        .edit-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          opacity: 0.3;
        }

        .crosshair-h, .crosshair-v {
          position: absolute;
          background: #007bff;
          pointer-events: none;
        }

        .crosshair-h {
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          transform: translateY(-50%);
        }

        .crosshair-v {
          top: 0;
          bottom: 0;
          left: 50%;
          width: 1px;
          transform: translateX(-50%);
        }

        .spot-image {
          max-width: 100%;
          max-height: 60vh;
          height: auto;
          display: block;
          transition: all 0.3s ease;
          border-radius: 0.5rem;
        }

        .spot-image.edit-mode {
          cursor: crosshair;
        }

        .spot-image.edit-mode:hover {
          filter: brightness(1.05);
        }

        .click-ripple {
          position: absolute;
          width: 40px;
          height: 40px;
          border: 3px solid #007bff;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: clickRipple 0.6s ease-out;
          pointer-events: none;
          z-index: 5;
        }

        @keyframes clickRipple {
          0% {
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }


      `}</style>
    </div>
  )
}

const EditZone = ({ zone, isActive, onPromptSubmit, onRemove, isLoading }) => {
  const [prompt, setPrompt] = useState('')
  const [showChat, setShowChat] = useState(isActive)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef(null)

  const promptSuggestions = [
    'Change the wall color to sage green',
    'Add a modern floor lamp here',
    'Replace with a leather armchair',
    'Add floating shelves on this wall',
    'Change to hardwood flooring',
    'Add a large window with natural light',
    'Replace with a marble countertop',
    'Add indoor plants in this corner'
  ]

  useEffect(() => {
    setShowChat(isActive)
    if (isActive && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100)
    }
  }, [isActive])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showChat) {
        if (e.key === 'Escape') {
          setShowChat(false)
        } else if (e.key === 'Enter' && e.ctrlKey && prompt.trim()) {
          handleSubmit(e)
        } else if (e.key === 'Delete' && e.shiftKey) {
          onRemove(zone.id)
        }
      }
    }

    if (showChat) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showChat, prompt, zone.id, onRemove])

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
          borderColor: getStatusColor(),
          transform: 'translate(-50%, -50%)'
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
            position: 'fixed',
            left: Math.min(Math.max(zone.x, 20), 80) + '%',
            top: Math.min(Math.max(zone.y, 10), 70) + '%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="chat-header">
            <span>Edit this spot</span>
            <button onClick={() => onRemove(zone.id)} className="remove-btn">×</button>
          </div>
          
          <form onSubmit={handleSubmit} className="chat-form">
            <div className="input-container">
              <input
                ref={inputRef}
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
                placeholder="Describe changes for this area... (Enter to apply)"
                className="prompt-input"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="suggestions-btn"
                title="Show suggestions"
              >
                💡
              </button>
            </div>
            
            {showSuggestions && (
              <div className="suggestions-panel">
                <div className="suggestions-header">Quick suggestions:</div>
                <div className="suggestions-grid">
                  {promptSuggestions.slice(0, 4).map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setPrompt(suggestion)
                        setShowSuggestions(false)
                        inputRef.current?.focus()
                      }}
                      className="suggestion-btn"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
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
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          border: 1px solid #e5e7eb;
          width: 280px;
          z-index: 999999;
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

        .input-container {
          position: relative;
          margin-bottom: 0.75rem;
        }

        .prompt-input {
          width: 100%;
          padding: 0.75rem 3rem 0.75rem 0.75rem;
          border: 2px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.9rem;
          transition: border-color 0.2s;
        }

        .prompt-input:focus {
          outline: none;
          border-color: #007bff;
        }

        .suggestions-btn {
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 0.25rem;
          transition: background 0.2s;
        }

        .suggestions-btn:hover {
          background: #f3f4f6;
        }

        .suggestions-panel {
          background: #f8f9fa;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          padding: 0.75rem;
          margin-bottom: 0.75rem;
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .suggestions-header {
          font-size: 0.8rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .suggestions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }

        .suggestion-btn {
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 0.25rem;
          padding: 0.5rem;
          font-size: 0.75rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
          line-height: 1.2;
        }

        .suggestion-btn:hover {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .chat-actions {
          display: flex;
          gap: 0.5rem;
        }

        .chat-actions .apply-btn {
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

        .chat-actions .apply-btn:hover:not(:disabled) {
          background: #0056b3;
          transform: translateY(-1px);
        }

        .chat-actions .apply-btn:disabled {
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

        @media (max-width: 768px) {
          .spot-modal {
            width: 95vw;
            max-height: 90vh;
          }
          
          .editor-layout {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .preview-panel {
            border-left: none;
            border-top: 1px solid #e5e7eb;
            padding-left: 0;
            padding-top: 1rem;
          }
          
          .spot-image {
            max-height: 40vh;
          }
          
          .edit-zone-chat {
            width: 280px;
            left: 10px !important;
          }
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