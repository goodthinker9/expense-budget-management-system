import { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login } from '../services/authService.js';
import AuthContext from '../context/AuthContext.jsx';
import {
  IconMail, IconLock, IconEye, IconEyeOff,
  IconTrendUp, IconTarget, IconWallet,
} from '../components/Icons';
import './Auth.css';

function Login() {
  const { setUser, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Message passed via router state from Register when no token was returned
  const successMsg = location.state?.message ?? null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // login() returns response.data: { message, data: { token, user } }
      // Accept nested shape (.data.token) or flat top-level (.token).
      const payload = await login({ email, password });
      const token = payload?.data?.token ?? payload?.token;
      const user  = payload?.data?.user  ?? payload?.user;

      if (!token || !user) {
        throw new Error('Unexpected response from server. Please try again.');
      }

      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ??
        err?.message ??
        'Login failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <Link to="/" className="auth-logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect width="28" height="28" rx="6" fill="#e8572a"/>
              <path d="M7 8h10M7 14h7M7 20h10" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
              <circle cx="21" cy="20" r="3" fill="white"/>
            </svg>
            <span>FinTrack<span className="auth-logo-accent">ET</span></span>
          </Link>
          <div className="auth-tagline">
            <h2>Track Every Birr.<br />Build Every Dream.</h2>
            <p>Manage your money smarter with FinTrackET.</p>
          </div>
          <ul className="auth-features">
            <li>
              <span className="auth-feature-icon"><IconTrendUp size={18} color="#e8572a" /></span>
              Track every expense automatically
            </li>
            <li>
              <span className="auth-feature-icon"><IconTarget size={18} color="#e8572a" /></span>
              Set monthly budgets and stay on track
            </li>
            <li>
              <span className="auth-feature-icon"><IconWallet size={18} color="#e8572a" /></span>
              See where your money goes at a glance
            </li>
          </ul>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-header">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Sign in to your account to continue</p>
          </div>

          {successMsg && (
            <div className="alert alert-success" role="status">{successMsg}</div>
          )}

          {error && (
            <div className="alert alert-error" role="alert">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email address</label>
              <div className="input-wrap">
                <span className="input-icon"><IconMail size={16} color="#6b6b5e" /></span>
                <input
                  id="login-email"
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
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="input-wrap">
                <span className="input-icon"><IconLock size={16} color="#6b6b5e" /></span>
                <input
                  id="login-password"
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
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <IconEyeOff size={16} color="#6b6b5e" /> : <IconEye size={16} color="#6b6b5e" />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-btn" disabled={isLoading}>
              {isLoading ? <><span className="btn-spinner" /> Signing in&hellip;</> : 'Sign In'}
            </button>
          </form>

          <p className="auth-switch">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="auth-link">Create one for free</Link>
          </p>
          <div className="auth-home-link">
            <Link to="/">&larr; Back to home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
