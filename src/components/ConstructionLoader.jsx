import PropTypes from 'prop-types'

const ConstructionLoader = ({ message = "AI robots are building your dream room..." }) => {
  return (
    <div className="construction-loader">
      <div className="blueprint-bg">
        <div className="grid-lines"></div>
        <div className="diagonal-lines"></div>
      </div>
      
      <div className="robots">
        <div className="robot robot-1">🤖🔨</div>
        <div className="robot robot-2">🤖🔧</div>
        <div className="robot robot-3">🤖🎨</div>
      </div>
      
      <div className="construction-elements">
        <div className="element wall">🧱</div>
        <div className="element furniture">🪑</div>
        <div className="element decor">🖼️</div>
        <div className="element lighting">💡</div>
      </div>
      
      <div className="loading-text">
        <h2>🏗️ Building...</h2>
        <div className="dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <style>{`
        .construction-loader {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
          z-index: 10;
          overflow: hidden;
          border-radius: 0.75rem;
        }

        .blueprint-bg {
          position: absolute;
          inset: 0;
          opacity: 0.3;
        }

        .grid-lines {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px);
          background-size: 20px 20px;
          animation: gridMove 4s linear infinite;
        }

        .diagonal-lines {
          position: absolute;
          inset: 0;
          background-image: 
            repeating-linear-gradient(45deg, rgba(16, 185, 129, 0.2) 0px, rgba(16, 185, 129, 0.2) 2px, transparent 2px, transparent 20px);
          animation: diagonalMove 6s linear infinite;
        }

        .robots {
          position: absolute;
          inset: 0;
        }

        .robot {
          position: absolute;
          font-size: 2rem;
          animation: robotWork 3s ease-in-out infinite;
        }

        .robot-1 {
          top: 20%;
          left: 15%;
          animation-delay: 0s;
        }

        .robot-2 {
          top: 50%;
          right: 20%;
          animation-delay: 1s;
        }

        .robot-3 {
          top: 15%;
          right: 15%;
          animation-delay: 2s;
        }

        .construction-elements {
          position: absolute;
          inset: 0;
        }

        .element {
          position: absolute;
          font-size: 1.5rem;
          animation: elementFloat 4s ease-in-out infinite;
        }

        .wall {
          top: 45%;
          left: 50%;
          animation-delay: 0s;
        }

        .furniture {
          top: 35%;
          left: 65%;
          animation-delay: 1s;
        }

        .decor {
          top: 60%;
          left: 25%;
          animation-delay: 2s;
        }

        .lighting {
          top: 55%;
          right: 35%;
          animation-delay: 3s;
        }

        .loading-text {
          position: absolute;
          bottom: 15%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          z-index: 4;
        }

        .loading-text h2 {
          color: #1f2937;
          margin-bottom: 0.75rem;
          font-size: 1.1rem;
        }

        .dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
        }

        .dots span {
          width: 8px;
          height: 8px;
          background: #3b82f6;
          border-radius: 50%;
          animation: dotPulse 1.5s ease-in-out infinite;
        }

        .dots span:nth-child(1) { animation-delay: 0s; }
        .dots span:nth-child(2) { animation-delay: 0.3s; }
        .dots span:nth-child(3) { animation-delay: 0.6s; }

        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(20px, 20px); }
        }

        @keyframes diagonalMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(20px); }
        }

        @keyframes robotWork {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(5deg); }
          50% { transform: translateY(0) rotate(0deg); }
          75% { transform: translateY(-5px) rotate(-5deg); }
        }

        @keyframes elementFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-15px) rotate(10deg); opacity: 1; }
        }

        @keyframes dotPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
        }

        @media (max-width: 768px) {
          .robot {
            font-size: 1.5rem;
          }
          
          .element {
            font-size: 1.2rem;
          }
          
          .loading-text {
            padding: 1.5rem;
            margin: 1rem;
          }
          
          .loading-text h2 {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  )
}

ConstructionLoader.propTypes = {
  message: PropTypes.string
}

export default ConstructionLoader