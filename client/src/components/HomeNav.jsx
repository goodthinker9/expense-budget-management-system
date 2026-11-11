import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { IconMenu, IconX } from './Icons';
import './HomeNav.css';

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="28" height="28" rx="6" fill="#e8572a"/>
      <path d="M7 8h10M7 14h7M7 20h10" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx="21" cy="20" r="3" fill="white"/>
    </svg>
  );
}

function HomeNav() {
  const { isAuthenticated } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="hn">
      <nav className="hn-inner">
        {/* Logo */}
        <Link to="/" className="hn-logo">
          <Logo />
          <span className="hn-logo-text">FinTrack<span>ET</span></span>
        </Link>

        {/* Desktop links */}
        <div className="hn-links">
          <Link to="/pricing" className="hn-link">Pricing</Link>
        </div>

        {/* CTA */}
        <div className="hn-cta">
          {isAuthenticated ? (
            <button className="btn btn-primary hn-signup" onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
          ) : (
            <>
              <Link to="/login" className="hn-signin">Sign in</Link>
              <Link to="/register" className="btn btn-primary hn-signup">Sign up</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="hn-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <IconX size={22} color="#c8c8bc" /> : <IconMenu size={22} color="#c8c8bc" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="hn-mobile">
          <Link to="/pricing" className="hn-mobile-link" onClick={() => setMobileOpen(false)}>Pricing</Link>
          <div className="hn-mobile-cta">
            {isAuthenticated ? (
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { navigate('/dashboard'); setMobileOpen(false); }}>
                Dashboard
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost" style={{ width: '100%', color: '#c8c8bc', borderColor: 'rgba(255,255,255,0.15)' }} onClick={() => setMobileOpen(false)}>Sign in</Link>
                <Link to="/register" className="btn btn-primary" style={{ width: '100%' }} onClick={() => setMobileOpen(false)}>Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default HomeNav;
