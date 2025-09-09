import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { analytics } from '../utils/analytics'

const Home = () => {
  const navigate = useNavigate()
  const [activeFeature, setActiveFeature] = useState('generate')
  const [visibleSections, setVisibleSections] = useState(new Set())
  const sectionsRef = useRef({})

  useEffect(() => {
    analytics.trackPageView('home')
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.1, rootMargin: '-50px' }
    )

    Object.values(sectionsRef.current).forEach(ref => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  const features = [
    {
      id: 'generate',
      icon: '🎨',
      title: 'AI Generate',
      description: 'Transform rooms with natural language prompts',
      demo: 'Replace the sofa with a modern sectional in navy blue'
    },
    {
      id: 'chat',
      icon: '💬',
      title: 'AI Chat',
      description: 'Get instant design advice and suggestions',
      demo: 'What colors work best for a small living room?'
    },
    {
      id: 'mood',
      icon: '🎭',
      title: 'Mood Analysis',
      description: 'Analyze and change room ambiance',
      demo: 'Transform to cozy, minimalist, or modern vibes'
    }
  ]

  return (
    <div className="home-page">


      <main className="main">
        <section 
          id="hero" 
          className={`hero ${visibleSections.has('hero') ? 'animate-in' : ''}`}
          ref={el => sectionsRef.current.hero = el}
        >
          <div className="animated-background">
            <div className="floating-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
              <div className="shape shape-4"></div>
              <div className="shape shape-5"></div>
              <div className="shape shape-6"></div>
            </div>
            <div className="gradient-orbs">
              <div className="orb orb-1"></div>
              <div className="orb orb-2"></div>
              <div className="orb orb-3"></div>
            </div>
          </div>
          <div className="container">
            <div className="hero-content">
              <div className="hero-badge">
                <span className="badge-icon">✨</span>
                <span>AI-Powered Interior Design</span>
              </div>
              
              <h1 className="hero-title">
                Transform Your Space with
                <span className="gradient-text"> AI Magic</span>
              </h1>
              
              <p className="hero-subtitle">
                Upload a room photo, describe your vision in natural language, and watch our advanced AI redesign your space in seconds
              </p>
              
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">50K+</div>
                  <div className="stat-label">Rooms Transformed</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-number">98%</div>
                  <div className="stat-label">Satisfaction Rate</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-number">&lt; 30s</div>
                  <div className="stat-label">Generation Time</div>
                </div>
              </div>
              
              <div className="hero-demo">
                <div className="transformation-showcase">
                  <div className="image-frame before-frame">
                    <div className="frame-glow"></div>
                    <img src="/before.jpeg" alt="Before - Empty Room" />
                    <div className="image-label">Before</div>
                    <div className="magic-sparkles">
                      <div className="sparkle sparkle-1">✨</div>
                      <div className="sparkle sparkle-2">✨</div>
                      <div className="sparkle sparkle-3">✨</div>
                    </div>
                  </div>
                  <div className="image-popup before-popup">
                    <img src="/before.jpeg" alt="Before - Empty Room" />
                  </div>
                  
                  <div className="transformation-arrow">
                    <div className="arrow-line"></div>
                    <div className="arrow-head">→</div>
                    <div className="ai-badge">AI Magic</div>
                  </div>
                  
                  <div className="image-frame after-frame">
                    <div className="frame-glow success-glow"></div>
                    <img src="/after.jpg" alt="After - Designed Room" />
                    <div className="image-label success">After</div>
                    <div className="success-indicator">✓</div>
                  </div>
                  <div className="image-popup after-popup">
                    <img src="/after.jpg" alt="After - Designed Room" />
                  </div>
                </div>
                <p className="demo-text">"Add modern furniture and warm lighting to create a cozy living space"</p>
              </div>
              
              <div className="hero-actions">
                <button 
                  onClick={() => navigate('/editor')}
                  className="btn btn-primary hero-cta"
                >
                  <span className="cta-icon">🎨</span>
                  Start Designing Now
                  <span className="cta-arrow">→</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="scroll-indicator">
            <div className="scroll-mouse">
              <div className="scroll-wheel"></div>
            </div>
          </div>
        </section>

        <section 
          id="features" 
          className={`features ${visibleSections.has('features') ? 'animate-in' : ''}`}
          ref={el => sectionsRef.current.features = el}
        >
          <div className="container">
            <h2 className="section-title">Powerful AI Design Tools</h2>
            
            <div className="features-grid">
              <div className="feature-tabs">
                {features.map((feature) => (
                  <button
                    key={feature.id}
                    className={`feature-tab ${activeFeature === feature.id ? 'active' : ''}`}
                    onClick={() => setActiveFeature(feature.id)}
                  >
                    <span className="tab-icon">{feature.icon}</span>
                    <span className="tab-title">{feature.title}</span>
                  </button>
                ))}
              </div>
              
              <div className="feature-content">
                {features.map((feature) => (
                  activeFeature === feature.id && (
                    <div key={feature.id} className="feature-details">
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                      <div className="feature-demo">
                        <div className="demo-input">
                          <span className="input-icon">💭</span>
                          <span className="demo-prompt">{feature.demo}</span>
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </section>

        <section 
          id="process" 
          className={`process ${visibleSections.has('process') ? 'animate-in' : ''}`}
          ref={el => sectionsRef.current.process = el}
        >
          <div className="container">
            <h2 className="section-title">How It Works</h2>
            <div className="process-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-icon">📸</div>
                <h3>Upload Room Photo</h3>
                <p>Take or upload a clear photo of your space</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-icon">✍️</div>
                <h3>Describe Changes</h3>
                <p>Tell AI what you want to modify or improve</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-icon">⚡</div>
                <h3>Get Instant Results</h3>
                <p>See your redesigned room in seconds</p>
              </div>
            </div>
          </div>
        </section>

        <section 
          id="testimonials" 
          className={`testimonials ${visibleSections.has('testimonials') ? 'animate-in' : ''}`}
          ref={el => sectionsRef.current.testimonials = el}
        >
          <div className="container">
            <h2 className="section-title">What Our Users Say</h2>
            <div className="testimonials-grid">
              <div className="testimonial">
                <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
                <div className="testimonial-content">
                  <p>"DesignMind helped me visualize my dream living room. The AI suggestions were spot-on!"</p>
                  <div className="testimonial-author">
                    <div className="author-avatar">👩‍💼</div>
                    <div>
                      <span className="author-name">Sarah M.</span>
                      <span className="author-role">Interior Design Enthusiast</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="testimonial">
                <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
                <div className="testimonial-content">
                  <p>"I redesigned my entire apartment using this tool. Amazing results in minutes!"</p>
                  <div className="testimonial-author">
                    <div className="author-avatar">👨‍🏠</div>
                    <div>
                      <span className="author-name">Mike R.</span>
                      <span className="author-role">Homeowner</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="testimonial">
                <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
                <div className="testimonial-content">
                  <p>"The mood analysis feature is incredible. It perfectly captured the vibe I wanted."</p>
                  <div className="testimonial-author">
                    <div className="author-avatar">👩‍🎓</div>
                    <div>
                      <span className="author-name">Emma L.</span>
                      <span className="author-role">Design Student</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section 
          id="cta" 
          className={`cta-section ${visibleSections.has('cta') ? 'animate-in' : ''}`}
          ref={el => sectionsRef.current.cta = el}
        >
          <div className="container">
            <div className="cta-card">
              <h2>Ready to Transform Your Space?</h2>
              <p>Join thousands creating their dream rooms with AI</p>
              <button 
                onClick={() => navigate('/editor')}
                className="btn btn-primary cta-button"
              >
                🎨 Start Designing Now
              </button>
            </div>
          </div>
        </section>
      </main>



      <style>{`
        .home-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        html {
          scroll-behavior: smooth;
        }

        section {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        section.animate-in {
          opacity: 1;
          transform: translateY(0);
        }



        .main {
          flex: 1;
          padding: 0;
        }

        .hero {
          text-align: center;
          padding: 0;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .animated-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .floating-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .shape {
          position: absolute;
          background: rgba(139, 115, 85, 0.1);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        .shape-1 {
          width: 80px;
          height: 80px;
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 60px;
          height: 60px;
          top: 60%;
          right: 15%;
          animation-delay: 1s;
        }

        .shape-3 {
          width: 100px;
          height: 100px;
          top: 10%;
          right: 20%;
          animation-delay: 2s;
        }

        .shape-4 {
          width: 40px;
          height: 40px;
          bottom: 30%;
          left: 20%;
          animation-delay: 3s;
        }

        .shape-5 {
          width: 70px;
          height: 70px;
          top: 40%;
          left: 5%;
          animation-delay: 4s;
        }

        .shape-6 {
          width: 50px;
          height: 50px;
          bottom: 20%;
          right: 10%;
          animation-delay: 5s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.6;
          }
        }

        .gradient-orbs {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          animation: pulse-move 8s ease-in-out infinite;
        }

        .orb-1 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(139, 115, 85, 0.2) 0%, transparent 70%);
          top: -150px;
          left: -150px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(212, 185, 150, 0.15) 0%, transparent 70%);
          bottom: -200px;
          right: -200px;
          animation-delay: 2s;
        }

        .orb-3 {
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, rgba(139, 115, 85, 0.1) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 4s;
        }

        @keyframes pulse-move {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
            opacity: 0.5;
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
            opacity: 0.4;
          }
        }

        .hero .container {
          position: relative;
          z-index: 1;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, rgba(139, 115, 85, 0.1), rgba(212, 185, 150, 0.1));
          border: 1px solid rgba(139, 115, 85, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--primary);
          margin-bottom: 2rem;
          animation: slideInUp 1s ease-out;
        }

        .badge-icon {
          font-size: 1rem;
        }

        .hero-title {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 4rem;
          font-weight: 700;
          color: var(--neutral-800);
          margin-bottom: 1.5rem;
          line-height: 1.1;
          animation: slideInUp 1s ease-out 0.1s both;
        }

        .gradient-text {
          background: linear-gradient(135deg, var(--primary), var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 1.3rem;
          color: var(--neutral-600);
          margin-bottom: 2.5rem;
          max-width: 650px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
          font-weight: 400;
          animation: slideInUp 1s ease-out 0.2s both;
        }

        .hero-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 3rem;
          animation: slideInUp 1s ease-out 0.3s both;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-family: 'Poppins', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary);
          line-height: 1;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--neutral-500);
          font-weight: 500;
          margin-top: 0.25rem;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: var(--neutral-300);
        }

        .hero-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
          margin-bottom: 3rem;
          animation: slideInUp 1s ease-out 0.7s both;
        }

        .hero-cta {
          font-family: 'Poppins', sans-serif;
          font-size: 1.125rem;
          font-weight: 600;
          padding: 1rem 2.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: 0 8px 25px rgba(139, 115, 85, 0.25);
          transition: all 0.3s ease;
        }

        .hero-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(139, 115, 85, 0.35);
        }

        .cta-icon {
          font-size: 1.25rem;
        }

        .cta-arrow {
          transition: transform 0.3s ease;
        }

        .hero-cta:hover .cta-arrow {
          transform: translateX(4px);
        }

        .trust-indicators {
          display: flex;
          gap: 1.5rem;
          font-size: 0.875rem;
          color: var(--neutral-500);
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .scroll-indicator {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          animation: slideInUp 1s ease-out 1s both;
          z-index: 10;
        }

        .hero {
          position: relative;
        }

        .scroll-mouse {
          width: 24px;
          height: 40px;
          border: 2px solid var(--primary);
          border-radius: 12px;
          position: relative;
          opacity: 0.6;
        }

        .scroll-wheel {
          width: 4px;
          height: 8px;
          background: var(--primary);
          border-radius: 2px;
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          animation: scrollWheel 2s infinite;
        }

        @keyframes scrollWheel {
          0%, 20% {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateX(-50%) translateY(16px);
            opacity: 0;
          }
        }

        .hero-demo {
          max-width: 400px;
          margin: 0 auto;
        }

        .demo-card {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          background: white;
          padding: 2rem;
          border-radius: 1.5rem;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          margin-bottom: 1.5rem;
          animation: slideInUp 1s ease-out 0.4s both;
          border: 1px solid #e5e7eb;
        }

        .transformation-showcase {
          display: flex;
          align-items: center;
          gap: 2rem;
          justify-content: center;
        }

        .image-frame {
          position: relative;
          width: 160px;
          height: 120px;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .image-frame {
          cursor: pointer;
        }

        .image-frame:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .before-frame:hover + .before-popup,
        .before-popup:hover,
        .after-frame:hover + .after-popup,
        .after-popup:hover {
          opacity: 1;
          visibility: visible;
        }

        .image-popup {
          position: fixed;
          top: 50%;
          width: 450px;
          height: 320px;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .before-popup {
          left: 8%;
          transform: translateY(-50%) translateX(-20px) scale(0.9);
        }

        .before-frame:hover + .before-popup,
        .before-popup:hover {
          transform: translateY(-50%) translateX(0) scale(1);
        }

        .after-popup {
          right: 8%;
          transform: translateY(-50%) translateX(20px) scale(0.9);
        }

        .after-frame:hover + .after-popup,
        .after-popup:hover {
          transform: translateY(-50%) translateX(0) scale(1);
        }

        .image-popup::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          z-index: -1;
        }

        .image-popup img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .image-frame:hover img {
          transform: scale(1.05);
        }

        .frame-glow {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #fbbf24, #f59e0b);
          border-radius: 1rem;
          z-index: -1;
          opacity: 0.6;
          animation: pulse 2s ease-in-out infinite;
        }

        .success-glow {
          background: linear-gradient(45deg, #10b981, #059669) !important;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.02); }
        }

        .image-label {
          position: absolute;
          bottom: 8px;
          left: 8px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .image-label.success {
          background: rgba(16, 185, 129, 0.9);
        }

        .magic-sparkles {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .sparkle {
          position: absolute;
          font-size: 1rem;
          animation: sparkle 2s ease-in-out infinite;
        }

        .sparkle-1 {
          top: 10px;
          right: 10px;
          animation-delay: 0s;
        }

        .sparkle-2 {
          bottom: 20px;
          left: 15px;
          animation-delay: 0.7s;
        }

        .sparkle-3 {
          top: 50%;
          right: 20px;
          animation-delay: 1.4s;
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }

        .success-indicator {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #10b981;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.875rem;
          animation: successPop 0.6s ease-out 1s both;
        }

        @keyframes successPop {
          0% { opacity: 0; transform: scale(0); }
          80% { transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }

        .transformation-arrow {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          position: relative;
        }

        .arrow-line {
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, #8b7355, #d4b996);
          position: relative;
          overflow: hidden;
        }

        .arrow-line::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
          animation: shimmer 2s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .arrow-head {
          font-size: 1.5rem;
          color: var(--primary);
          animation: bounce 1s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }

        .ai-badge {
          background: linear-gradient(135deg, #8b7355, #d4b996);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 8px rgba(139, 115, 85, 0.3);
        }

        .demo-text {
          font-style: italic;
          color: var(--neutral-600);
          font-size: 0.9rem;
        }

        .features {
          padding: 4rem 0;
          background: white;
        }

        .section-title {
          text-align: center;
          font-size: 2rem;
          color: var(--neutral-800);
          margin-bottom: 3rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 3rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .feature-tabs {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .feature-tab {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .feature-tab:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
        }

        .feature-tab.active {
          border-color: var(--primary);
          background: #f0f8ff;
        }

        .tab-icon {
          font-size: 1.5rem;
        }

        .tab-title {
          font-weight: 600;
          color: var(--neutral-800);
        }

        .feature-content {
          background: #f8f9fa;
          border-radius: 1rem;
          padding: 2rem;
        }

        .feature-details h3 {
          color: var(--neutral-800);
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .feature-details p {
          color: var(--neutral-600);
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }

        .demo-input {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: white;
          padding: 1rem;
          border-radius: 0.5rem;
          border: 1px solid #d1d5db;
        }

        .input-icon {
          font-size: 1.2rem;
        }

        .demo-prompt {
          color: var(--neutral-700);
          font-style: italic;
        }

        .process {
          padding: 4rem 0;
          background: #f8fafc;
        }

        .process-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .step {
          text-align: center;
          padding: 2rem;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          position: relative;
          transform: translateY(20px);
          opacity: 0;
          transition: all 0.6s ease;
        }

        .process.animate-in .step {
          transform: translateY(0);
          opacity: 1;
        }

        .process.animate-in .step:nth-child(1) { transition-delay: 0.1s; }
        .process.animate-in .step:nth-child(2) { transition-delay: 0.2s; }
        .process.animate-in .step:nth-child(3) { transition-delay: 0.3s; }

        .step-number {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--primary);
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .step-icon {
          font-size: 2.5rem;
          margin: 1rem 0;
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

        .testimonials {
          padding: 4rem 0;
          background: #f8fafc;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .testimonial {
          background: white;
          border-radius: 1.5rem;
          padding: 2.5rem;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
          transform: translateY(20px);
          opacity: 0;
          transition: all 0.6s ease;
          position: relative;
        }

        .testimonial::before {
          content: '"';
          position: absolute;
          top: 1rem;
          left: 1.5rem;
          font-size: 4rem;
          color: #8b7355;
          opacity: 0.2;
          font-family: serif;
        }

        .testimonials.animate-in .testimonial {
          transform: translateY(0);
          opacity: 1;
        }

        .testimonials.animate-in .testimonial:nth-child(1) { transition-delay: 0.1s; }
        .testimonials.animate-in .testimonial:nth-child(2) { transition-delay: 0.2s; }
        .testimonials.animate-in .testimonial:nth-child(3) { transition-delay: 0.3s; }

        .testimonial-content p {
          color: #475569;
          margin-bottom: 2rem;
          font-size: 1.125rem;
          line-height: 1.7;
          font-weight: 400;
          position: relative;
          z-index: 1;
        }

        .testimonial-rating {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          text-align: center;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }

        .author-avatar {
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #8b7355, #d4b996);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(139, 115, 85, 0.2);
        }

        .author-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .author-name {
          font-weight: 600;
          color: #1e293b;
          font-size: 1rem;
        }

        .author-role {
          font-size: 0.875rem;
          color: #64748b;
        }

        .cta-section {
          text-align: center;
          padding: 4rem 0;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
        }

        .cta-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 1.5rem;
          padding: 3rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .cta-card h2 {
          color: white;
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .cta-card p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.2rem;
          margin-bottom: 2rem;
        }

        .cta-button {
          font-size: 1.25rem;
          padding: 1rem 2rem;
          background: white;
          color: var(--primary);
          border: none;
        }

        .cta-button:hover {
          background: #f8f9fa;
          transform: translateY(-2px);
        }

        .cta-subtitle {
          color: var(--neutral-600);
          font-size: 1rem;
        }



        @media (max-width: 768px) {
          .hero {
            padding: 4rem 0;
            min-height: 80vh;
          }
          
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-subtitle {
            font-size: 1.125rem;
          }
          
          .hero-stats {
            flex-direction: column;
            gap: 1rem;
          }
          
          .stat-divider {
            display: none;
          }
          
          .transformation-showcase {
            flex-direction: column;
            gap: 1.5rem;
          }
          
          .transformation-arrow {
            transform: rotate(90deg);
          }
          
          .trust-indicators {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }
          
          .scroll-indicator {
            margin-top: 3rem;
          }
          
          .process-steps {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .testimonials-grid {
            grid-template-columns: 1fr;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .cta-card h2 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  )
}

export default Home