import { Link } from 'react-router-dom';
import './HomeFooter.css';

function HomeFooter() {
  return (
    <footer className="hf">
      <div className="hf-inner">
        <div className="hf-top">
          <div className="hf-brand">
            <Link to="/" className="hf-logo">
              <span>💰</span>
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
          <span>© 2026 FinTrackET. Built with ❤️ for Ethiopia.</span>
        </div>
      </div>
    </footer>
  );
}

export default HomeFooter;
