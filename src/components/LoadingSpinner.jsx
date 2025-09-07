import PropTypes from 'prop-types'

const LoadingSpinner = ({ size = 'medium', message, className = '' }) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  }

  return (
    <div className={`loading-spinner ${className}`}>
      <div className={`spinner ${sizeClasses[size]}`}></div>
      {message && <p className="loading-message">{message}</p>}

      <style jsx>{`
        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .spinner {
          border: 2px solid var(--neutral-300);
          border-top: 2px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .spinner-small {
          width: 16px;
          height: 16px;
          border-width: 1px;
        }

        .spinner-medium {
          width: 24px;
          height: 24px;
          border-width: 2px;
        }

        .spinner-large {
          width: 40px;
          height: 40px;
          border-width: 3px;
        }

        .loading-message {
          color: var(--neutral-600);
          font-size: 0.875rem;
          text-align: center;
          margin: 0;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  message: PropTypes.string,
  className: PropTypes.string
}

export default LoadingSpinner