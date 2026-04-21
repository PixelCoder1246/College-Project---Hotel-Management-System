import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/landing.css';

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <nav className="nav" aria-label="Main navigation">
      <div className="nav__container">
        <Link to="/" className="nav__brand" id="nav-brand">
          <span className="nav__brand-icon">⚜</span>
          <span className="nav__brand-name">Hotel MS</span>
        </Link>

        <div className="nav__links">
          {isLanding && (
            <a href="#features" className="nav__link">
              Features
            </a>
          )}
        </div>

        <div className="nav__actions">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav__link" id="nav-dashboard">
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="btn btn--primary btn--sm"
                id="nav-profile"
              >
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn--ghost btn--sm"
                id="nav-login"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn btn--primary btn--sm"
                id="nav-register"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
