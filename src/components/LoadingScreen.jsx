import { useEffect, useState } from 'react'

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => onComplete(), 500)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="logo-container">
          <svg width="80" height="80" viewBox="0 0 80 80" className="loading-logo">
            <circle
              cx="40"
              cy="40"
              r="35"
              fill="none"
              stroke="#8b7355"
              strokeWidth="2"
              strokeDasharray="220"
              strokeDashoffset="220"
              className="logo-circle"
            />
            <path
              d="M25 35 L40 25 L55 35 L55 55 L25 55 Z"
              fill="none"
              stroke="#8b7355"
              strokeWidth="2.5"
              strokeDasharray="100"
              strokeDashoffset="100"
              className="logo-house"
            />
            <rect
              x="35"
              y="45"
              width="10"
              height="10"
              fill="none"
              stroke="#8b7355"
              strokeWidth="2"
              strokeDasharray="40"
              strokeDashoffset="40"
              className="logo-door"
            />
          </svg>
        </div>
        
        <h1 className="loading-title">DesignMind</h1>
        <p className="loading-subtitle">AI-powered interior design</p>
        
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-text">{progress}%</span>
        </div>
      </div>

      <style>{`
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .loading-content {
          text-align: center;
          animation: fadeInUp 1s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .logo-container {
          margin-bottom: 2rem;
        }

        .loading-logo {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .logo-circle {
          animation: drawCircle 2s ease-out forwards;
        }

        .logo-house {
          animation: drawHouse 1.5s ease-out 0.5s forwards;
        }

        .logo-door {
          animation: drawDoor 1s ease-out 1.5s forwards;
        }

        @keyframes drawCircle {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes drawHouse {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes drawDoor {
          to {
            stroke-dashoffset: 0;
          }
        }

        .loading-title {
          font-family: 'Poppins', sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--primary, #8b7355);
          margin-bottom: 0.5rem;
          animation: slideInUp 1s ease-out 0.3s both;
        }

        .loading-subtitle {
          font-size: 1.1rem;
          color: var(--neutral-600, #6b7280);
          margin-bottom: 3rem;
          animation: slideInUp 1s ease-out 0.5s both;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .progress-container {
          display: flex;
          align-items: center;
          gap: 1rem;
          animation: slideInUp 1s ease-out 0.7s both;
        }

        .progress-bar {
          width: 200px;
          height: 4px;
          background: rgba(139, 115, 85, 0.2);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b7355, #d4b996);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-weight: 600;
          color: var(--primary, #8b7355);
          min-width: 40px;
        }
      `}</style>
    </div>
  )
}

export default LoadingScreen