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

export default function ForCouples() {
  return (
    <div className="mp-page">
      <HomeNav />

      {/* ── HERO ── */}
      <section className="mp-hero">
        <div className="mp-hero-content mp-inner">
          <div className="mp-hero-text">
            <p className="mp-eyebrow">FOR COUPLES</p>
            <h1 className="mp-hero-title">Stay on the same page about money</h1>
            <p className="mp-hero-sub">Create a shared view of your finances, track progress together, and make money check-ins a breeze.</p>
          </div>
        </div>
      </section>

      {/* ── HOUSEHOLD DASHBOARD ── */}
      <section className="mp-section">
        <div className="mp-inner mp-alt-row">
          <div className="mp-alt-text">
            <h2 className="mp-h2">Your entire household in a single dashboard</h2>
            <div className="mp-checks">
              <div className="mp-check"><span className="mp-check-icon">💰</span> Get a full picture of your finances by bringing separate and joint accounts together, all into one view.</div>
              <div className="mp-check"><span className="mp-check-icon">📊</span> Know how you spend as a household, no matter who makes the purchase.</div>
              <div className="mp-check"><span className="mp-check-icon">📈</span> See how your net worth grows together over time.</div>
            </div>
          </div>
          <div className="mp-alt-visual">
            <div className="mp-white-card" style={{ maxWidth: 340 }}>
              <div className="mp-card-label">Net Worth</div>
              <div className="mp-card-amount">ETB 215,000.00</div>
              <div className="mp-avatars-row">
                <div className="mp-avatar blue">D</div>
                <div className="mp-avatar green">J</div>
                <span style={{ fontSize: '0.8rem', color: '#6b7280', marginLeft: 8 }}>Dylan &amp; Jessie</span>
              </div>
              {[
                { name: 'Joint Checking', last: '9701', amt: 'ETB 40,000' },
                { name: "Jessie's Savings", last: '4251', amt: 'ETB 25,000' },
                { name: "Dylan's 401(k)", last: '6632', amt: 'ETB 150,000' },
              ].map(a => (
                <div key={a.name} className="mp-account-row">
                  <div className="mp-acct-dot" />
                  <div style={{ flex: 1 }}>
                    <div className="mp-acct-name">{a.name}</div>
                    <div className="mp-acct-last">•••• {a.last}</div>
                  </div>
                  <div className="mp-acct-amt">{a.amt}</div>
                  <div className="mp-acct-time">1 min ago</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COLLABORATION ── */}
      <section className="mp-section mp-dark-section">
        <div className="mp-inner mp-alt-row reverse">
          <div className="mp-alt-visual">
            <div className="mp-white-card" style={{ maxWidth: 340 }}>
              <div className="mp-card-label" style={{ fontWeight: 700, color: '#111827' }}>Transactions <span className="mp-tx-need">5 need review</span></div>
              {[
                { name: 'Starbucks', cat: 'Coffee', person: 'Anyone' },
                { name: 'Apple', cat: 'Entertainment', person: 'Jessie' },
                { name: 'Urban Items', cat: 'Gifts', amt: 'ETB 650' },
                { name: 'Whole Foods', cat: 'Groceries', amt: 'ETB 850' },
              ].map((t, i) => (
                <div key={i} className="mp-tx-row">
                  <div className="mp-tx-dot" />
                  <span className="mp-tx-name">{t.name}</span>
                  <span className="mp-tx-cat">{t.cat}</span>
                  {t.amt && <span className="mp-tx-amt">{t.amt}</span>}
                </div>
              ))}
            </div>
          </div>
          <div className="mp-alt-text">
            <h2 className="mp-h2">Collaboration made easy</h2>
            <div className="mp-checks">
              <div className="mp-check"><span className="mp-check-icon">🏷️</span> Tag your partner to review transactions and be sure everything looks right.</div>
              <div className="mp-check"><span className="mp-check-icon">📅</span> Make money check-ins quick and easy with a monthly summary and interactive reports.</div>
              <div className="mp-check"><span className="mp-check-icon">💰</span> Partner on a budget that gives you both the flexibility to spend on what's important to you.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GO FURTHER ── */}
      <section className="mp-section">
        <div className="mp-inner mp-alt-row">
          <div className="mp-alt-text">
            <h2 className="mp-h2">Go further, together</h2>
            <div className="mp-checks">
              <div className="mp-check"><span className="mp-check-icon">🎯</span> Align on goals you feel good about and track progress along the way.</div>
              <div className="mp-check"><span className="mp-check-icon">➕</span> Contribute toward goals together in FinTrackET, even if you keep your money in separate accounts.</div>
              <div className="mp-check"><span className="mp-check-icon">🔍</span> Use reports to see trends in your household spending and identify easy ways to save.</div>
            </div>
          </div>
          <div className="mp-alt-visual">
            <div className="mp-white-card" style={{ maxWidth: 340 }}>
              {[
                { name: 'Emergency Fund', target: 48000, current: 48000, color: '#10b981' },
                { name: 'Vacation', target: 8000, current: 4310, color: '#e8572a' },
                { name: 'College Fund', target: 55000, current: 21014, color: '#3b82f6' },
                { name: 'Home Down Payment', target: 100000, current: 9018, color: '#f59e0b' },
              ].map(g => (
                <div key={g.name} className="mp-goal-row">
                  <div className="mp-goal-header">
                    <span className="mp-goal-name">{g.name}</span>
                    <span className="mp-goal-amt">ETB {g.current.toLocaleString()}</span>
                  </div>
                  <div className="mp-goal-track">
                    <div className="mp-goal-fill" style={{ width: Math.min(100, Math.round(g.current / g.target * 100)) + '%', background: g.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MORE WAYS ── */}
      <section className="mp-section mp-dark-section">
        <div className="mp-inner mp-alt-row">
          <div className="mp-alt-text">
            <h2 className="mp-h2">More ways to collaborate with FinTrackET</h2>
            <p className="mp-sub-desc">Invite your advisor, coach, or tax professional to FinTrackET, to get input from the pros without the heavy lifting.</p>
            <Link to="/register" className="btn btn-primary" style={{ marginTop: '1.5rem', width: 'fit-content' }}>Sign up</Link>
          </div>
          <div className="mp-alt-visual">
            {/* Styled collaboration visual instead of static image */}
            <div className="mp-collab-visual">
              <div className="mp-collab-badge">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="20" fill="rgba(232,87,42,0.15)"/>
                  <path d="M13 20a7 7 0 1 1 14 0 7 7 0 0 1-14 0z" stroke="#e8572a" strokeWidth="1.75" fill="none"/>
                  <path d="M20 17v3l2 2" stroke="#e8572a" strokeWidth="1.75" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="mp-collab-title">More ways to collaborate</h3>
              <p className="mp-collab-desc">Invite your advisor, coach, or tax professional to get expert input without the heavy lifting.</p>
              <div className="mp-collab-avatars">
                {['You', 'Partner', 'Advisor'].map((r, i) => (
                  <div key={r} className="mp-collab-user">
                    <div className="mp-collab-avatar" style={{ background: ['#e8572a','#3b82f6','#10b981'][i] }}>{r[0]}</div>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section className="mp-section mp-quote-section">
        <div className="mp-inner mp-quote-inner">
          <blockquote className="mp-big-quote">
            "FinTrackET is the best budgeting app overall for 2024. It's the best for anyone looking to cut expenses and increase savings — especially couples or families."
          </blockquote>
          <div className="mp-quote-source">
            <strong>Wall Street Journal</strong>
            <span>The 5 Best Budgeting Apps to Make Managing Your Money Easier in 2024</span>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="mp-section">
        <div className="mp-inner">
          <h2 className="mp-h2">FAQ</h2>
          <div className="mp-faq">
            <FaqItem q="How does FinTrackET work for couples? Does it cost extra to add additional household members?" a="FinTrackET lets you invite a partner to your account at no extra cost. You both get a shared view of all finances while maintaining individual privacy settings." />
            <FaqItem q="What can my partner see in my shared account?" a="By default, both partners can see all shared transactions and budgets. You can customize visibility settings for individual accounts." />
            <FaqItem q="Can we set up joint budgets and goals?" a="Yes! You can create shared budgets and goals that both partners can contribute to and track together in real time." />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mp-cta">
        <div className="mp-inner mp-cta-inner">
          <h2>Track, budget, and feel good about your money with FinTrackET in your corner.</h2>
          <Link to="/register" className="btn mp-cta-btn">Get started today</Link>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}
