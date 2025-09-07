import { useState } from 'react'
import PropTypes from 'prop-types'

const DownloadModal = ({ isOpen, onClose, onDownload, onSkip }) => {
  const [isSkipping, setIsSkipping] = useState(false)

  const handleSkip = () => {
    setIsSkipping(true)
    setTimeout(() => {
      onSkip()
      setIsSkipping(false)
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>💎 Premium Download</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="modal-body">
          <div className="premium-info">
            <div className="feature-list">
              <div className="feature">✨ High-quality downloads</div>
              <div className="feature">🚫 No watermarks</div>
              <div className="feature">📱 Multiple formats</div>
              <div className="feature">⚡ Unlimited generations</div>
            </div>
            
            <div className="pricing">
              <div className="price">$9.99/month</div>
              <div className="price-desc">Cancel anytime</div>
            </div>
          </div>
          
          <div className="modal-actions">
            <button onClick={onDownload} className="btn btn-primary">
              🔓 Subscribe & Download
            </button>
            
            <div className="skip-section">
              <p className="skip-text">Testing mode only:</p>
              <button 
                onClick={handleSkip} 
                className="btn btn-secondary skip-btn"
                disabled={isSkipping}
              >
                {isSkipping ? '⏳ Skipping...' : '⏭️ Skip (Test Mode)'}
              </button>
            </div>
          </div>
        </div>

        <style>{`
          .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(4px);
          }

          .modal-content {
            background: white;
            border-radius: 1rem;
            max-width: 400px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
          }

          .modal-header h3 {
            margin: 0;
            color: #1f2937;
            font-size: 1.25rem;
          }

          .close-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #6b7280;
            padding: 0.25rem;
            border-radius: 0.25rem;
            transition: all 0.2s;
          }

          .close-btn:hover {
            background: #f3f4f6;
            color: #374151;
          }

          .modal-body {
            padding: 1.5rem;
          }

          .premium-info {
            text-align: center;
            margin-bottom: 2rem;
          }

          .feature-list {
            margin-bottom: 1.5rem;
          }

          .feature {
            padding: 0.5rem 0;
            color: #374151;
            font-size: 0.9rem;
          }

          .pricing {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem;
            border-radius: 0.75rem;
            margin-bottom: 1rem;
          }

          .price {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.25rem;
          }

          .price-desc {
            font-size: 0.85rem;
            opacity: 0.9;
          }

          .modal-actions {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 0.5rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 0.9rem;
          }

          .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }

          .btn-primary:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          }

          .skip-section {
            text-align: center;
            padding-top: 1rem;
            border-top: 1px solid #e5e7eb;
          }

          .skip-text {
            font-size: 0.8rem;
            color: #6b7280;
            margin-bottom: 0.5rem;
          }

          .skip-btn {
            background: #f3f4f6;
            color: #6b7280;
            font-size: 0.8rem;
            padding: 0.5rem 1rem;
          }

          .skip-btn:hover:not(:disabled) {
            background: #e5e7eb;
            color: #374151;
          }

          .skip-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    </div>
  )
}

DownloadModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  onSkip: PropTypes.func.isRequired
}

export default DownloadModal