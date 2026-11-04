import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { IconChevronDown, IconChevronUp, IconChart, IconWallet, IconTarget, IconMenu, IconX } from './Icons';
import './HomeNav.css';

const featuresMenu = [
  {
    Icon: IconChart,
    title: 'Tracking',
    desc: 'Sync all of your accounts and transactions in one place.',
    features: ['Net Worth Tracking', 'Custom Reports', 'Credit Score Tracking'],
  },
  {
    Icon: IconWallet,
    title: 'Budgeting',
    desc: 'Stick to your budget with our flexible budgeting tools.',
    features: ['Flex Budget System', 'Custom Categories', 'Powerful Notifications'],
  },
  {
    Icon: IconTarget,
    title: 'Planning',
    desc: 'Track your goals and make progress toward completion.',
    features: ['Savings Goals', 'Debt Paydown Goals', 'Goal Forecasting'],
  },
];

// FinTrackET wordmark logo (SVG)
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
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setFeaturesOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
          <div className="hn-dropdown" ref={dropRef}>
            <button
              className={`hn-link hn-link--drop ${featuresOpen ? 'open' : ''}`}
              onClick={() => setFeaturesOpen(!featuresOpen)}
              aria-expanded={featuresOpen}
              aria-haspopup="true"
            >
              Features
              <span className="hn-chevron-icon">
                {featuresOpen ? <IconChevronUp size={14} color="#a8a89a" /> : <IconChevronDown size={14} color="#a8a89a" />}
              </span>
            </button>

            {featuresOpen && (
              <div className="hn-drop-menu" role="menu">
                {featuresMenu.map((item) => (
                  <div key={item.title} className="hn-drop-col" role="none">
                    <div className="hn-drop-icon">
                      <item.Icon size={20} color="white" />
                    </div>
                    <h4 className="hn-drop-title">{item.title}</h4>
                    <p className="hn-drop-desc">{item.desc}</p>
                    <div className="hn-drop-features-label">FEATURES</div>
                    <ul className="hn-drop-list">
                      {item.features.map((f) => (
                        <li key={f}>
                          <span className="hn-drop-bullet">›</span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link to="/for-couples" className="hn-link">For Couples</Link>
          <Link to="/for-professionals" className="hn-link">For Professionals</Link>
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
          <div className="hn-mobile-section">
            <div className="hn-mobile-label">Features</div>
            {featuresMenu.map((f) => (
              <div key={f.title} className="hn-mobile-feature">
                <f.Icon size={16} color="#e8572a" /> {f.title}
              </div>
            ))}
          </div>
          <Link to="/for-couples" className="hn-mobile-link" onClick={() => setMobileOpen(false)}>For Couples</Link>
          <Link to="/for-professionals" className="hn-mobile-link" onClick={() => setMobileOpen(false)}>For Professionals</Link>
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
