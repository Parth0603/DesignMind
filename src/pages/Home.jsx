import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { analytics } from '../utils/analytics'

const Home = () => {
  const navigate = useNavigate()

  useEffect(() => {
    analytics.trackPageView('home')
  }, [])

  return (
    <div className="home-page">
      <header className="header">
        <div className="container">
          <div className="logo">
            <h1>🧠 DesignMind</h1>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <section className="hero">
            <div className="hero-content">
              <h1 className="hero-title">DesignMind</h1>
              <p className="hero-subtitle">
                AI-powered interior design. Transform your space with intelligent design suggestions.
              </p>
              
              <div className="process-steps">
                <div className="step">
                  <div className="step-icon">📸</div>
                  <h3>1. Upload</h3>
                  <p>Take a photo of your room</p>
                </div>
                <div className="step">
                  <div className="step-icon">✍️</div>
                  <h3>2. Describe</h3>
                  <p>Tell us what you want to change</p>
                </div>
                <div className="step">
                  <div className="step-icon">✨</div>
                  <h3>3. Visualize</h3>
                  <p>See your new design instantly</p>
                </div>
              </div>
            </div>
          </section>

          <section className="cta-section">
            <div className="cta-container">
              <button 
                onClick={() => navigate('/editor')}
                className="btn btn-primary cta-button"
              >
                🎨 Start Designing
              </button>
              <p className="cta-subtitle">Upload your room photo and transform it with AI</p>
            </div>
          </section>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>Built for the AI Interior Design Hackathon 2024</p>
        </div>
      </footer>

      <style>{`
        .home-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .header {
          background: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 1rem 0;
        }

        .logo h1 {
          color: var(--primary);
          font-size: 1.5rem;
          font-weight: 700;
        }

        .main {
          flex: 1;
          padding: 3rem 0;
        }

        .hero {
          text-align: center;
          margin-bottom: 4rem;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 800;
          color: var(--neutral-800);
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--neutral-600);
          margin-bottom: 3rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .process-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .step {
          text-align: center;
          padding: 1.5rem;
        }

        .step-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .step h3 {
          color: var(--neutral-800);
          margin-bottom: 0.5rem;
          font-size: 1.125rem;
        }

        .step p {
          color: var(--neutral-600);
          font-size: 0.9rem;
        }

        .cta-section {
          text-align: center;
          margin: 2rem auto;
        }

        .cta-button {
          font-size: 1.25rem;
          padding: 1rem 2rem;
          margin-bottom: 1rem;
        }

        .cta-subtitle {
          color: var(--neutral-600);
          font-size: 1rem;
        }

        .footer {
          background: var(--neutral-100);
          padding: 2rem 0;
          text-align: center;
          border-top: 1px solid var(--neutral-200);
        }

        .footer p {
          color: var(--neutral-500);
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-subtitle {
            font-size: 1.125rem;
          }
          
          .process-steps {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .main {
            padding: 2rem 0;
          }
        }
      `}</style>
    </div>
  )
}

export default Home