import { Link } from 'react-router-dom';
import './HomeFooter.css';

function HomeFooter() {
  return (
    <footer className="hf">
      <div className="hf-inner">
        <div className="hf-top">
          <div className="hf-brand">
            <Link to="/" className="hf-logo">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect width="28" height="28" rx="6" fill="#e8572a" />
                <path d="M7 8h10M7 14h7M7 20h10" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                <circle cx="21" cy="20" r="3" fill="white" />
              </svg>
              <span>FinTrack<span className="hf-accent">ET</span></span>
            </Link>
            <p className="hf-tagline">Personal finance in ETB — simple, honest, yours.</p>
          </div>
          <div className="hf-cols">
            <div className="hf-col">
              <div className="hf-col-title">Product</div>
              <Link to="/login"       className="hf-col-link">Dashboard</Link>
              <Link to="/login"       className="hf-col-link">Transactions</Link>
              <Link to="/login"       className="hf-col-link">Budgets</Link>
              <Link to="/login"       className="hf-col-link">Reports</Link>
            </div>
            <div className="hf-col">
              <div className="hf-col-title">Account</div>
              <Link to="/login"    className="hf-col-link">Sign in</Link>
              <Link to="/register" className="hf-col-link">Create account</Link>
            </div>
          </div>
        </div>
        <div className="hf-bottom">
          <span>© 2026 FinTrackET. Built for Ethiopia.</span>
        </div>
      </div>
    </footer>
  );
}

export default HomeFooter;
