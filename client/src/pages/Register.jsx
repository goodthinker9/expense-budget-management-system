import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/app.js';
import AuthContext from '../context/AuthContext.jsx';
import './Auth.css';

function Register() {
  const { setUser, setIsAuthenticated } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (err) {
      const message = err?.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-left">
        <video
          className="auth-video"
          autoPlay
          muted
          loop
          playsInline
          poster="/image/image.png"
        >
          <source src="https://videos.pexels.com/video-files/7735813/7735813-hd_1920_1080_25fps.mp4" type="video/mp4" />
        </video>
        <div className="auth-left-overlay" />
        <div className="auth-left-content">
          <Link to="/" className="auth-logo">
            <span>💰</span>
            <span>FinTrack<span className="auth-logo-accent">ET</span></span>
          </Link>
          <div className="auth-tagline">
            <h2>Your Financial<br />Journey Starts Here.</h2>
            <p>Create your free account and start tracking your expenses, budgets, and savings today.</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-header">
            <h1 className="auth-title">Create account</h1>
            <p className="auth-subtitle">Start managing your finances for free</p>
          </div>

          {error && (
            <div className="alert alert-error" role="alert">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <div className="input-wrap">
                <span className="input-icon">👤</span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-input with-icon"
                  placeholder="Abebe Kebede"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email address</label>
              <div className="input-wrap">
                <span className="input-icon">✉️</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input with-icon"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input with-icon with-icon-right"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input with-icon"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>

          <div className="auth-home-link">
            <Link to="/">← Back to home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
