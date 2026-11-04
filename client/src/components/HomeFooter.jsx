import React from 'react';
import { Link } from 'react-router-dom';
import './HomeFooter.css';

const footerCols = [
  {
    title: 'Features',
    links: ['Tracking', 'Budgeting', 'Planning'],
  },
  {
    title: 'Compare',
    links: ['vs. YNAB', 'vs. Simplifi', 'vs. Credit Karma', 'vs. Mint'],
  },
  {
    title: 'Calculators',
    links: ['Financial Health Calculator', 'Debt Payoff Calculator', 'Mortgage Calculator'],
  },
  {
    title: 'Other Resources',
    links: ["What's New", 'Bank Connections', 'Professional Directory', 'Terms of Use', 'Privacy Policy', 'Promo Codes'],
  },
  {
    title: 'Company',
    links: ['Blog', 'About', 'Careers', 'Press', 'Partnerships', 'Privacy and Security'],
  },
  {
    title: 'Support',
    links: ['Help Center', 'System Health', 'Contact', 'Cookie Preferences'],
  },
];

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
          </div>
          <div className="hf-cols">
            {footerCols.map((col) => (
              <div key={col.title} className="hf-col">
                <div className="hf-col-title">{col.title}</div>
                {col.links.map((l) => (
                  <a key={l} href="#" className="hf-col-link">{l}</a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="hf-bottom">
          <span>© 2026 FinTrackET. Built with ❤️ for Ethiopia.</span>
          <div className="hf-stores">
            <span className="hf-store">🍎 App Store</span>
            <span className="hf-store">▶ Google Play</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default HomeFooter;
