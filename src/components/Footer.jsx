import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <h2>DesignMind</h2>
            <p>AI-powered interior design that transforms your space with intelligent creativity and effortless style.</p>
          </div>
          
          <div className="footer-links">
            <div className="link-group">
              <h3>Navigation</h3>
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/about" className="footer-link">About Us</Link>
              <Link to="/editor" className="footer-link">Try Editor</Link>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>© 2024 DesignMind. All rights reserved.</p>
          </div>
          <div className="footer-social">
            <span>Follow us:</span>
            <div className="social-icons">
              <span className="social-icon">🐦</span>
              <span className="social-icon">📷</span>
              <span className="social-icon">💼</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .footer {
          background: var(--neutral-800);
          color: var(--warm-white);
          padding: var(--space-3xl) 0 var(--space-lg) 0;
          position: relative;
        }

        .footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
          pointer-events: none;
        }

        .footer-main {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: var(--space-3xl);
          margin-bottom: var(--space-2xl);
          position: relative;
          z-index: 1;
        }

        .footer-brand h2 {
          font-family: var(--font-heading);
          color: var(--warm-white);
          font-size: 2.5rem;
          margin-bottom: var(--space-lg);
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .footer-brand p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
          line-height: 1.7;
          max-width: 400px;
        }

        .link-group h3 {
          font-family: var(--font-heading);
          color: var(--warm-white);
          font-size: 1.3rem;
          margin-bottom: var(--space-lg);
          font-weight: 600;
        }

        .footer-link {
          display: block;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: var(--space-md);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          padding-left: var(--space-sm);
        }

        .footer-link::before {
          content: '→';
          position: absolute;
          left: 0;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .footer-link:hover {
          color: var(--warm-white);
          transform: translateX(var(--space-sm));
        }

        .footer-link:hover::before {
          opacity: 1;
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          padding-top: var(--space-lg);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .footer-copyright p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.95rem;
          margin: 0;
        }

        .footer-social {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .footer-social span {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
        }

        .social-icons {
          display: flex;
          gap: var(--space-sm);
        }

        .social-icon {
          width: 35px;
          height: 35px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
        }

        .social-icon:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px) scale(1.1);
        }

        @media (max-width: 768px) {
          .footer-main {
            grid-template-columns: 1fr;
            gap: var(--space-2xl);
            text-align: center;
          }
          
          .footer-brand h2 {
            font-size: 2rem;
          }
          
          .footer-brand p {
            max-width: none;
          }
          
          .footer-bottom {
            flex-direction: column;
            gap: var(--space-lg);
            text-align: center;
          }
          
          .footer-social {
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  )
}

export default Footer