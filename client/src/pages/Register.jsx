import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService.js';
import AuthContext from '../context/AuthContext.jsx';
import { IconMail, IconLock, IconEye, IconEyeOff, IconUser } from '../components/Icons';
import './Auth.css';

function Register() {
  const { setUser, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match.'); return; }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setIsLoading(true);
    setError(null);
    try {
      // register() returns response.data: { message, data: { token, user } }
      // Accept nested shape (.data.token) or flat top-level (.token).
      const payload = await register({ name: formData.name, email: formData.email, password: formData.password });
      const token = payload?.data?.token ?? payload?.token;
      const user  = payload?.data?.user  ?? payload?.user;

      if (token && user) {
        // API returned credentials -- log in immediately
        localStorage.setItem('token', token);
        setUser(user);
        setIsAuthenticated(true);
        navigate('/dashboard', { replace: true });
      } else {
        // No token returned (e.g. email verification required) -- redirect to login
        navigate('/login', { replace: true, state: { message: 'Account created! Please sign in.' } });
      }
    } catch (err) {
      setError(err?.response?.data?.message ?? err?.message ?? 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <video className="auth-video" autoPlay muted loop playsInline poster="/image/image.png">
          <source src="https://videos.pexels.com/video-files/7735813/7735813-hd_1920_1080_25fps.mp4" type="video/mp4" />
        </video>
        <div className="auth-left-overlay" />
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
            <h2>Your Financial<br />Journey Starts Here.</h2>
            <p>Create your free account and start tracking your expenses, budgets, and savings today.</p>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-header">
            <h1 className="auth-title">Create account</h1>
            <p className="auth-subtitle">Start managing your finances for free</p>
          </div>

          {error && <div className="alert alert-error" role="alert">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Full Name</label>
              <div className="input-wrap">
                <span className="input-icon"><IconUser size={16} color="#6b6b5e" /></span>
                <input id="reg-name" name="name" type="text" className="form-input with-icon"
                  placeholder="Abebe Kebede" value={formData.name} onChange={handleChange} required autoComplete="name" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email address</label>
              <div className="input-wrap">
                <span className="input-icon"><IconMail size={16} color="#6b6b5e" /></span>
                <input id="reg-email" name="email" type="email" className="form-input with-icon"
                  placeholder="you@example.com" value={formData.email} onChange={handleChange} required autoComplete="email" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <div className="input-wrap">
                <span className="input-icon"><IconLock size={16} color="#6b6b5e" /></span>
                <input id="reg-password" name="password" type={showPassword ? 'text' : 'password'}
                  className="form-input with-icon with-icon-right" placeholder="At least 6 characters"
                  value={formData.password} onChange={handleChange} required autoComplete="new-password" />
                <button type="button" className="input-icon-right" onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <IconEyeOff size={16} color="#6b6b5e" /> : <IconEye size={16} color="#6b6b5e" />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
              <div className="input-wrap">
                <span className="input-icon"><IconLock size={16} color="#6b6b5e" /></span>
                <input id="reg-confirm" name="confirmPassword" type={showPassword ? 'text' : 'password'}
                  className="form-input with-icon" placeholder="Re-enter your password"
                  value={formData.confirmPassword} onChange={handleChange} required autoComplete="new-password" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-btn" disabled={isLoading}>
              {isLoading ? <><span className="btn-spinner" /> Creating account&hellip;</> : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
          <div className="auth-home-link"><Link to="/">&larr; Back to home</Link></div>
        </div>
      </div>
    </div>
  );
}

export default Register;
