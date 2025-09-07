import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useHomeCanvas } from '../hooks/useImageState'
import { analytics } from '../utils/analytics'
import ImageDisplay from '../components/ImageDisplay'
import PromptInput from '../components/PromptInput'
import ImageUpload from '../components/ImageUpload'
import AIChat from '../components/AIChat'
import MoodAnalyzer from '../components/MoodAnalyzer'
import SpotEditor from '../components/SpotEditor'

const Editor = () => {
  const {
    originalImage,
    currentImage,
    imageHistory,
    editHistory,
    isLoading,
    error,
    uploadProgress,
    loadingMessage,
    uploadImage,
    generateEdit,
    generateSpotEdit,
    selectImage,
    undoLastEdit,
    resetToOriginal,
    clearError,
    clearAll,
    canUndo,
    canReset
  } = useHomeCanvas()

  const [activeTab, setActiveTab] = useState('generate')

  const handleNewUpload = async (file) => {
    await uploadImage(file)
    clearError()
  }

  const handleGenerate = (prompt) => {
    generateEdit(prompt)
  }

  useEffect(() => {
    analytics.trackPageView('editor')
  }, [])

  return (
    <div className="editor-page">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            <h1>🏠 HomeCanvas</h1>
          </Link>
          
          <nav className="nav">
            <Link to="/" className="nav-link">← Back to Home</Link>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="editor-layout">
            <div className="image-panel">
              <div className="panel-header">
                <h2>Your Room</h2>
                {!currentImage && (
                  <p className="panel-subtitle">Upload a photo to get started</p>
                )}
              </div>
              
              {!currentImage && (
                <ImageUpload 
                  onImageUpload={handleNewUpload}
                  isLoading={isLoading}
                  uploadProgress={uploadProgress}
                />
              )}
              
              {currentImage && (
                <ImageDisplay 
                  image={currentImage} 
                  originalImage={originalImage}
                  isLoading={isLoading}
                  loadingMessage={loadingMessage}
                />
              )}
              
              {error && (
                <div className="error-banner">
                  <p>{error}</p>
                  <button onClick={clearError} className="error-close">×</button>
                </div>
              )}
              
              {imageHistory.length > 1 && (
                <div className="history-section">
                  <h3>Design History ({imageHistory.length})</h3>
                  <div className="history-grid">
                    {imageHistory.slice(0, 6).map((image) => (
                      <div 
                        key={image.id}
                        className={`history-item ${currentImage?.id === image.id ? 'active' : ''}`}
                        onClick={() => selectImage(image)}
                        title={image.isGenerated ? image.prompt : 'Original image'}
                      >
                        <img 
                          src={image.thumbnail || image.url} 
                          alt={image.isGenerated ? `Generated: ${image.prompt}` : 'Original'}
                        />
                        <div className="history-label">
                          {image.isOriginal ? (
                            '🏠 Original'
                          ) : (
                            `✨ ${image.prompt?.substring(0, 20)}...`
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="controls-panel">
              <div className="panel-header">
                <h2>AI Design Studio</h2>
                <p className="panel-subtitle">Choose your design approach</p>
              </div>
              
              <div className="feature-tabs">
                {[
                  { id: 'generate', icon: '🎨', label: 'Generate' },
                  { id: 'chat', icon: '🤖', label: 'AI Chat' },
                  { id: 'mood', icon: '🎭', label: 'Mood' },
                  { id: 'spot', icon: '🎯', label: 'Spot Edit' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="tab-icon">{tab.icon}</span>
                    <span className="tab-label">{tab.label}</span>
                  </button>
                ))}
              </div>
              
              <div className="controls-content">
                {!currentImage ? (
                  <div className="upload-prompt">
                    <h3>📷 Upload Your Room Photo</h3>
                    <p>Choose a clear photo of your room to start designing</p>
                  </div>
                ) : (
                  <div>
                    {activeTab === 'generate' && (
                      <>
                        <div className="action-buttons">
                          <button 
                            onClick={undoLastEdit}
                            disabled={!canUndo || isLoading}
                            className="btn btn-secondary"
                          >
                            ↶ Undo
                          </button>
                          
                          <button 
                            onClick={resetToOriginal}
                            disabled={!canReset || isLoading}
                            className="btn btn-secondary"
                          >
                            🏠 Original
                          </button>
                          
                          <button 
                            onClick={clearAll}
                            disabled={isLoading}
                            className="btn btn-secondary"
                          >
                            🗑️ Clear
                          </button>
                        </div>
                        
                        <PromptInput 
                          onSubmit={handleGenerate}
                          isLoading={isLoading}
                        />
                      </>
                    )}
                    
                    {activeTab === 'chat' && (
                      <AIChat roomImage={currentImage?.base64} />
                    )}
                    
                    {activeTab === 'mood' && (
                      <MoodAnalyzer 
                        roomImage={currentImage?.base64}
                        onMoodAnalysis={(analysis) => {
                          if (analysis.suggestions) {
                            handleGenerate(analysis.suggestions)
                          }
                        }}
                      />
                    )}
                    
                    {activeTab === 'spot' && (
                      <SpotEditor 
                        image={currentImage}
                        onSpotEdit={generateSpotEdit}
                        onApplyEdit={(imageUrl, prompt) => {
                          // Apply the spot edit to the current image
                          selectImage({
                            id: Date.now(),
                            url: imageUrl,
                            isGenerated: true,
                            prompt: prompt || 'Spot edit',
                            timestamp: new Date().toISOString()
                          })
                        }}
                        isLoading={isLoading}
                      />
                    )}
                  </div>
                )}
              </div>
              

            </div>
          </div>
        </div>
      </main>

      <style>{`
        .editor-page {
          min-height: 100vh;
          background: var(--neutral-100);
        }

        .header {
          background: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 1rem 0;
        }

        .header .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          text-decoration: none;
        }

        .logo h1 {
          color: var(--primary);
          font-size: 1.5rem;
          font-weight: 700;
        }

        .nav-link {
          color: var(--neutral-600);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .nav-link:hover {
          color: var(--primary);
        }

        .main {
          padding: 2rem 0;
        }

        .editor-layout {
          display: grid;
          grid-template-columns: 1fr 500px;
          gap: 1.5rem;
          min-height: calc(100vh - 200px);
          max-width: 1800px;
          margin: 0 auto;
          padding: 0 0.5rem;
        }

        .image-panel,
        .controls-panel {
          background: white;
          border-radius: 0.75rem;
          padding: 2.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          height: fit-content;
          min-width: 500px;
        }

        .panel-header {
          margin-bottom: 1.5rem;
        }

        .panel-header h2 {
          color: var(--neutral-800);
          font-size: 1.25rem;
          margin-bottom: 0.25rem;
        }

        .panel-subtitle {
          color: var(--neutral-600);
          font-size: 0.875rem;
        }

        .controls-content {
          margin-bottom: 2rem;
          min-height: 400px;
        }

        .feature-tabs {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          background: #f8f9fa;
          padding: 0.75rem;
          border-radius: 0.75rem;
        }

        .tab-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.25rem 1rem;
          border: none;
          background: transparent;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.9rem;
          min-height: 80px;
        }

        .tab-btn:hover {
          background: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .tab-btn.active {
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          color: #007bff;
        }

        .tab-icon {
          font-size: 1.5rem;
        }

        .tab-label {
          font-weight: 600;
          white-space: nowrap;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .action-buttons .btn {
          flex: 1;
          min-width: 80px;
          font-size: 0.875rem;
          padding: 0.5rem 0.75rem;
        }

        .action-buttons .btn.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          color: var(--neutral-400);
        }

        .action-buttons .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          color: var(--neutral-400);
        }



        .edit-summary {
          margin-top: 1.5rem;
          padding: 1rem;
          background: var(--neutral-50);
          border-radius: 0.5rem;
        }

        .edit-summary h4 {
          color: var(--neutral-700);
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
        }

        .edit-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .edit-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
        }

        .edit-number {
          background: var(--primary);
          color: white;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 600;
          flex-shrink: 0;
        }

        .edit-prompt {
          color: var(--neutral-600);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .upload-prompt {
          text-align: center;
          padding: 2rem;
          background: var(--neutral-50);
          border-radius: 0.75rem;
          margin-bottom: 1rem;
        }

        .upload-prompt h3 {
          color: var(--neutral-700);
          margin-bottom: 0.5rem;
        }

        .upload-prompt p {
          color: var(--neutral-600);
          font-size: 0.9rem;
        }

        .error-banner {
          background: #fed7d7;
          color: var(--error);
          padding: 1rem;
          border-radius: 0.5rem;
          margin-top: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .error-close {
          background: none;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          color: var(--error);
        }

        .history-section {
          border-top: 1px solid var(--neutral-200);
          padding-top: 1.5rem;
        }

        .history-section h3 {
          color: var(--neutral-700);
          font-size: 1rem;
          margin-bottom: 1rem;
        }

        .history-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }

        .history-item {
          position: relative;
          border-radius: 0.5rem;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .history-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .history-item.active {
          border-color: var(--primary);
        }

        .history-item img {
          width: 100%;
          height: 60px;
          object-fit: cover;
        }

        .history-label {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 0.2rem 0.4rem;
          font-size: 0.65rem;
          line-height: 1.2;
        }

        @media (max-width: 1024px) {
          .editor-layout {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .controls-panel {
            order: -1;
          }
          
          .feature-tabs {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
            padding: 0.5rem;
          }

          .tab-btn {
            padding: 1rem 0.75rem;
            min-height: 70px;
          }
          
          .history-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .feature-tabs {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .tab-btn {
            flex-direction: row;
            justify-content: center;
            gap: 0.75rem;
            padding: 1rem;
            min-height: 60px;
          }

        @media (max-width: 768px) {
          .header .container {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
          
          .main {
            padding: 1rem 0;
          }
          
          .image-panel,
          .controls-panel {
            padding: 1rem;
          }
          
          .action-buttons {
            justify-content: center;
          }
          
          .history-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  )
}

export default Editor