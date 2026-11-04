import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { IconUser, IconLogout, IconChevronDown } from './Icons';
import './Navbar.css';

// FinTrackET logo SVG
function Logo() {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="28" height="28" rx="6" fill="#e8572a"/>
      <path d="M7 8h10M7 14h7M7 20h10" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx="21" cy="20" r="3" fill="white"/>
    </svg>
  );
}

function Navbar() {
  const { user, setUser, setIsAuthenticated } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <Logo />
          <span>FinTrack<span className="navbar-logo-accent">ET</span></span>
        </Link>

        <div className="navbar-right">
          <div className="navbar-user" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="navbar-avatar" aria-label="User menu">{initials}</div>
            <div className="navbar-user-info">
              <span className="navbar-user-name">{user?.name || 'User'}</span>
              <span className="navbar-user-email">{user?.email || ''}</span>
            </div>
            <span className="navbar-chevron-icon">
              <IconChevronDown size={14} color="#9ca3af" />
            </span>
          </div>

          {menuOpen && (
            <>
              <div className="navbar-menu-backdrop" onClick={() => setMenuOpen(false)} />
              <div className="navbar-menu" role="menu">
                <div className="navbar-menu-header">
                  <span className="navbar-menu-name">{user?.name}</span>
                  <span className="navbar-menu-email">{user?.email}</span>
                </div>
                <div className="navbar-menu-divider" />
                <Link to="/profile" className="navbar-menu-item" onClick={() => setMenuOpen(false)} role="menuitem">
                  <IconUser size={16} /> Profile
                </Link>
                <button className="navbar-menu-item navbar-menu-logout" onClick={handleLogout} role="menuitem">
                  <IconLogout size={16} /> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
