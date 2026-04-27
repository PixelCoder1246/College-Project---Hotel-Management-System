import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/landing.css';

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <nav className="navbar" aria-label="Main navigation">
      <Link to="/" className="navbar__brand" id="nav-brand">
        <div className="navbar__brand-icon">⚜</div>
        Royal Orchid
      </Link>

      <div className="navbar__links">
        {isLanding && (
          <>
            <a href="#rooms" className="navbar__link">
              Rooms
            </a>
            <a href="#features" className="navbar__link">
              Features
            </a>
          </>
        )}

        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="navbar__link" id="nav-dashboard">
              Dashboard
            </Link>
            <Link
              to="/profile"
              className="btn btn--primary btn--sm"
              id="nav-profile"
            >
              My Profile
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar__link" id="nav-login">
              Sign In
            </Link>
            <Link
              to="/register"
              className="btn btn--primary btn--sm"
              id="nav-register"
            >
              Book Now
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
