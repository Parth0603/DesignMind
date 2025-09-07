import { Component } from 'react'
import PropTypes from 'prop-types'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('HomeCanvas Error:', error, errorInfo)
    // Clear any corrupted localStorage data
    try {
      localStorage.removeItem('homecanvas_state')
    } catch (e) {
      console.warn('Failed to clear storage:', e)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h2>Something went wrong</h2>
            <p>We're sorry, but something unexpected happened.</p>
            <button 
              onClick={() => {
                // Clear storage and reload
                try {
                  localStorage.clear()
                } catch (e) {
                  console.warn('Failed to clear storage:', e)
                }
                window.location.href = '/'
              }}
              className="btn btn-primary"
            >
              Go to Home
            </button>
          </div>

          <style>{`
            .error-boundary {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: var(--neutral-100);
              padding: 2rem;
            }

            .error-content {
              text-align: center;
              background: white;
              padding: 3rem 2rem;
              border-radius: 1rem;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              max-width: 400px;
            }

            .error-icon {
              font-size: 3rem;
              margin-bottom: 1rem;
            }

            .error-content h2 {
              color: var(--neutral-800);
              margin-bottom: 1rem;
            }

            .error-content p {
              color: var(--neutral-600);
              margin-bottom: 2rem;
            }
          `}</style>
        </div>
      )
    }

    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
}

export default ErrorBoundary