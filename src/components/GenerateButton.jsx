import PropTypes from 'prop-types'

const GenerateButton = ({ 
  onClick, 
  isLoading, 
  disabled, 
  prompt,
  className = '' 
}) => {
  const isDisabled = disabled || isLoading || !prompt?.trim()

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`generate-button ${className} ${isLoading ? 'loading' : ''}`}
    >
      {isLoading ? (
        <div className="loading-content">
          <div className="spinner"></div>
          <span>Generating...</span>
          <div className="progress-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        </div>
      ) : (
        <div className="button-content">
          <span className="icon">✨</span>
          <span>Generate Design</span>
        </div>
      )}

      <style>{`
        .generate-button {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          border: none;
          border-radius: 0.75rem;
          padding: 1rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          min-width: 180px;
          min-height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .generate-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(139, 115, 85, 0.3);
        }

        .generate-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .generate-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .generate-button.loading {
          background: var(--secondary);
          cursor: wait;
        }

        .button-content,
        .loading-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .icon {
          font-size: 1.2rem;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .progress-dots {
          display: flex;
          gap: 0.1rem;
        }

        .progress-dots span {
          animation: bounce 1.4s ease-in-out infinite both;
        }

        .progress-dots span:nth-child(1) { animation-delay: -0.32s; }
        .progress-dots span:nth-child(2) { animation-delay: -0.16s; }
        .progress-dots span:nth-child(3) { animation-delay: 0s; }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        @media (max-width: 768px) {
          .generate-button {
            padding: 0.875rem 1.5rem;
            font-size: 0.9rem;
            min-width: 160px;
          }
        }
      `}</style>
    </button>
  )
}

GenerateButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  prompt: PropTypes.string,
  className: PropTypes.string
}

export default GenerateButton