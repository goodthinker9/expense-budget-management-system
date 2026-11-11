import { useState } from 'react';
import { Link } from 'react-router-dom';
import HomeNav from '../components/HomeNav';
import HomeFooter from '../components/HomeFooter';
import './MarketingPage.css';

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button className="faq-q" onClick={() => setOpen(!open)}>
        {q}<span className="faq-arrow">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="faq-a">{a}</div>}
    </div>
  );
}

const tabs = ['Financial Advisors', 'Money Coaches', 'Tax Professionals', 'Estate Planning Attorneys'];

export default function ForProfessionals() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="mp-page">
      <HomeNav />

      {/* ── HERO ── */}
      <section className="mp-hero">
        <div className="mp-hero-content mp-inner">
          <div className="mp-hero-text">
            <p className="mp-eyebrow">FOR PROFESSIONALS</p>
            <h1 className="mp-hero-title">All of your clients' finances at a glance</h1>
            <p className="mp-hero-sub">FinTrackET for Professionals allows you to collaborate directly with your clients on their cash flow and budgeting to guide them on their financial journeys.</p>
            <Link to="/register" className="btn btn-primary" style={{ marginTop: '1.5rem', width: 'fit-content' }}>Sign up</Link>
          </div>
          <div className="mp-hero-visual">
            <div className="mp-white-card" style={{ maxWidth: 380 }}>
              <div className="mp-card-label" style={{ fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>Clients</div>
              {['Abebe Kebede', 'Sara Haile', 'Daniel Tesfaye', 'Marta Girma'].map((name, i) => (
                <div key={name} className="mp-client-row">
                  <div className="mp-client-avatar">{name[0]}</div>
                  <span className="mp-client-name">{name}</span>
                  <span className={`mp-client-status ${i % 2 === 0 ? 'green' : 'orange'}`}>{i % 2 === 0 ? 'On Track' : 'Needs Review'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TOOLS FOR PROS ── */}
      <section className="mp-section mp-dark-section">
        <div className="mp-inner">
          <div className="mp-tabs">
            {tabs.map((t, i) => (
              <button
                key={t}
                className={`mp-tab ${activeTab === i ? 'active' : ''}`}
                onClick={() => setActiveTab(i)}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="mp-alt-row" style={{ marginTop: '3rem' }}>
            <div className="mp-alt-visual">
              <div className="mp-white-card" style={{ maxWidth: 340 }}>
                <div className="mp-card-label" style={{ fontWeight: 700, color: '#111827' }}>Client Dashboard</div>
                {[
                  { label: 'Cash Flow', val: 'ETB +12,450', color: '#10b981' },
                  { label: 'Net Worth', val: 'ETB 215,000', color: '#3b82f6' },
                  { label: 'Budget Used', val: '62%', color: '#e8572a' },
                  { label: 'Goals Active', val: '4 goals', color: '#f59e0b' },
                ].map(r => (
                  <div key={r.label} className="mp-data-row">
                    <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{r.label}</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: r.color }}>{r.val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mp-alt-text">
              <h2 className="mp-h2">Tools for pros, of all kinds</h2>
              <div className="mp-checks">
                <div className="mp-check"><span className="mp-check-icon">👁️</span> Get a full view of your clients' accounts.</div>
                <div className="mp-check"><span className="mp-check-icon">💡</span> Make recommendations based on actual habits and numbers.</div>
                <div className="mp-check"><span className="mp-check-icon">🎯</span> Use real-time data to help clients course correct.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="mp-section mp-dark-section">
        <div className="mp-inner">
          <h2 className="mp-h2">How it works</h2>
          <div className="mp-steps">
            {[
              { n: 'Step 1', label: 'Invite your client to FinTrackET. Sponsor them or have them cover the cost.' },
              { n: 'Step 2', label: 'Your client signs up and connects their accounts.' },
              { n: 'Step 3', label: 'Get real-time visibility to their accounts to better understand cash flow, net worth, budget and more.' },
              { n: 'Step 4', label: 'Easily switch between clients on your Professionals dashboard.' },
            ].map((s, i) => (
              <div key={i} className="mp-step">
                <div className="mp-step-icon">📋</div>
                <div className="mp-step-n">{s.n}</div>
                <div className="mp-step-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="mp-section">
        <div className="mp-inner mp-alt-row">
          <div className="mp-alt-text">
            <h2 className="mp-h2">Pricing</h2>
            <p className="mp-sub-desc">Signing up for a Professionals account is free, then <strong style={{ color: '#e8572a' }}>ETB 199/month</strong> for each sponsored client.</p>
            <Link to="/register" className="btn btn-primary" style={{ marginTop: '1.5rem', width: 'fit-content' }}>Sign up</Link>
          </div>
          <div className="mp-alt-visual">
            <div className="mp-white-card" style={{ maxWidth: 380 }}>
              <div className="mp-card-label" style={{ color: '#111827', fontWeight: 700 }}>Dashboard — Accounts</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: '0.5rem 0' }}>ETB 666,547.97</div>
              {['Dashboard', 'Accounts', 'Transactions', 'Cash Flow', 'Reports', 'Budget', 'Goals'].map(item => (
                <div key={item} className="mp-sidebar-item">{item}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GET IN TOUCH ── */}
      <section className="mp-section mp-dark-section">
        <div className="mp-inner" style={{ textAlign: 'center' }}>
          <h2 className="mp-h2">Get in touch</h2>
          <div className="mp-contact-row">
            <input type="text" className="mp-contact-input" placeholder="How can we help?" />
            <button className="btn btn-primary">Let's go</button>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="mp-section">
        <div className="mp-inner">
          <h2 className="mp-h2">FAQs</h2>
          <div className="mp-faq">
            <FaqItem q="How do I sign up for the FinTrackET Professionals program?" a="Simply create an account and select 'For Professionals' during signup. No credit card required to get started." />
            <FaqItem q="Will I be charged when I sign up for a professional account?" a="No — signing up is completely free. You'll only be charged when you sponsor a client account." />
            <FaqItem q="Can I sponsor clients who already have an existing FinTrackET account?" a="Yes! You can invite any existing user to be a sponsored client and gain collaborative access." />
            <FaqItem q="Is FinTrackET SOC2 certified?" a="Yes. FinTrackET maintains SOC2 Type II certification to ensure your clients' data is secure and private." />
          </div>
        </div>
      </section>

      {/* ── RESOURCES ── */}
      <section className="mp-section mp-dark-section">
        <div className="mp-inner">
          <h2 className="mp-h2">Resources</h2>
          <p className="mp-sub-desc" style={{ marginBottom: '2rem' }}>Learn more about FinTrackET for Professionals</p>
          <div className="mp-resource-cards">
            {[
              { type: 'Video', title: 'FinTrackET for Professionals Overview' },
              { type: 'Video', title: 'Getting Started with FinTrackET for Professionals' },
            ].map(r => (
              <div key={r.title} className="mp-resource-card">
                <div className="mp-resource-type">{r.type}</div>
                <div className="mp-resource-title">{r.title}</div>
                <button className="btn mp-resource-btn">Watch</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mp-cta mp-cta--purple">
        <div className="mp-inner mp-cta-inner">
          <h2>Make your great advice even better. With FinTrackET.</h2>
          <Link to="/register" className="btn mp-cta-btn">Sign up</Link>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}
