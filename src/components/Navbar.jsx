import { Link, useNavigate, useLocation } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isEditor = location.pathname === '/editor'

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <h1>DesignMind</h1>
        </Link>
        <nav className="nav">
          <button 
            onClick={() => navigate(isEditor ? '/' : '/editor')}
            className="btn btn-primary header-cta"
          >
            {isEditor ? 'Back to Home' : 'Try Editor'}
          </button>
        </nav>
      </div>

      <style>{`
        .header {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          padding: 1rem 0;
          border-bottom: 1px solid rgba(139, 115, 85, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .logo {
          text-decoration: none;
          transition: transform 0.2s ease;
        }

        .logo:hover {
          transform: scale(1.05);
        }

        .logo h1 {
          background: linear-gradient(135deg, #8b7355 0%, #d4b996 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0;
        }

        .nav {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .nav-link {
          background: none;
          border: none;
          color: #64748b;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.95rem;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          position: relative;
        }

        .nav-link:hover {
          color: #8b7355;
          background: rgba(139, 115, 85, 0.05);
          transform: translateY(-1px);
        }

        .header-cta {
          background: linear-gradient(135deg, #8b7355 0%, #d4b996 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(139, 115, 85, 0.2);
        }

        .header-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 115, 85, 0.3);
        }

        @media (max-width: 768px) {
          .header .container {
            padding: 0 1rem;
          }
          
          .nav {
            gap: 1rem;
          }
          
          .logo h1 {
            font-size: 1.5rem;
          }
          
          .nav-link {
            padding: 0.4rem 0.8rem;
            font-size: 0.9rem;
          }
          
          .header-cta {
            padding: 0.6rem 1.2rem;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </header>
  )
}

export default Navbar