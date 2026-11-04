import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService.js';
import AuthContext from '../context/AuthContext.jsx';
import { IconMail, IconLock, IconEye, IconEyeOff } from '../components/Icons';
import './Auth.css';

function Login() {
  const { setUser, setIsAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await login({ email, password });
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (err) {
      const message = err?.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-left">
        {/* Background video like Monarch hero */}
        <video
          className="auth-video"
          autoPlay
          muted
          loop
          playsInline
          poster="/image/image.png"
        >
          {/* Free Pexels video: Person counting money / finance */}
          <source src="https://videos.pexels.com/video-files/6326935/6326935-hd_1920_1080_25fps.mp4" type="video/mp4" />
        </video>
        <div className="auth-left-overlay" />
        <div className="auth-left-content">
          <Link to="/" className="auth-logo">
            <span>💰</span>
            <span>FinTrack<span className="auth-logo-accent">ET</span></span>
          </Link>
          <div className="auth-tagline">
            <h2>Track Every Birr.<br />Build Every Dream.</h2>
            <p>Join thousands of Ethiopians managing their finances smarter with FinTrackET.</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-header">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="alert alert-error" role="alert">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email address</label>
              <div className="input-wrap">
                <span className="input-icon"><IconMail size={16} color="#6b6b5e" /></span>
                <input
                  id="email"
                  type="email"
                  className="form-input with-icon"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-wrap">
                <span className="input-icon"><IconLock size={16} color="#6b6b5e" /></span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input with-icon with-icon-right"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <IconEyeOff size={16} color="#6b6b5e" /> : <IconEye size={16} color="#6b6b5e" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="btn-spinner" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">Create one for free</Link>
          </p>

          <div className="auth-home-link">
            <Link to="/">← Back to home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
