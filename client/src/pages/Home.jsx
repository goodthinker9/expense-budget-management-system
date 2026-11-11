import { Link } from 'react-router-dom';
import HomeNav from '../components/HomeNav';
import HomeFooter from '../components/HomeFooter';
import { IconChart, IconWallet, IconTarget, IconTransactions, IconBudget, IconReports, IconArrowRight } from '../components/Icons';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      <HomeNav />

      {/* ── HERO ── */}
      <section className="hp-hero">
        <div className="hp-hero-overlay" />
        <div className="hp-hero-content">
          <p className="hp-hero-eyebrow">THE MODERN WAY</p>
          <h1 className="hp-hero-title">The modern way to manage money</h1>
          <p className="hp-hero-sub">Budget, track, and plan for the future — all in one place.</p>
          <Link to="/register" className="btn btn-primary hp-hero-btn">
            Create better money habits
          </Link>
        </div>
      </section>

      {/* ── WHAT IS ── */}
      <section className="hp-section hp-what">
        <div className="hp-inner">
          <p className="hp-label">WHAT IS FINTRUCKET?</p>
          <h2 className="hp-h2">Your home base for money clarity</h2>
          <p className="hp-desc">
            FinTrackET simplifies finances by bringing all your accounts together into one clear view.
            Always know where your money is and where it's going, achieve your goals quicker,
            and collaborate with your partner or professional at no extra cost.
          </p>
          {/* Dashboard mock */}
          <div className="hp-dashboard-mock">
            <div className="hp-mock-sidebar">
              <div className="hp-mock-logo">💰 FinTrackET</div>
              {['Dashboard', 'Accounts', 'Transactions', 'Budgets', 'Reports', 'Goals'].map(item => (
                <div key={item} className="hp-mock-nav">{item}</div>
              ))}
            </div>
            <div className="hp-mock-main">
              <div className="hp-mock-header">Net Worth <strong>ETB 215,000</strong></div>
              <div className="hp-mock-chart">
                <svg viewBox="0 0 300 80" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e8572a" stopOpacity="0.4"/>
                      <stop offset="100%" stopColor="#e8572a" stopOpacity="0.0"/>
                    </linearGradient>
                  </defs>
                  <path d="M0,70 C30,60 60,55 90,40 C120,25 150,30 180,20 C210,10 240,15 270,5 L300,0 L300,80 L0,80 Z" fill="url(#chartGrad)"/>
                  <path d="M0,70 C30,60 60,55 90,40 C120,25 150,30 180,20 C210,10 240,15 270,5 L300,0" fill="none" stroke="#e8572a" strokeWidth="2.5"/>
                </svg>
              </div>
              <div className="hp-mock-rows">
                {[
                  { name: 'Salary', cat: 'Income', amt: '+ETB 25,000', c: 'green' },
                  { name: 'Groceries', cat: 'Food', amt: '-ETB 3,200', c: 'red' },
                  { name: 'Rent', cat: 'Housing', amt: '-ETB 8,500', c: 'red' },
                  { name: 'Transport', cat: 'Travel', amt: '-ETB 1,100', c: 'red' },
                ].map(r => (
                  <div key={r.name} className="hp-mock-row">
                    <span className="hp-mock-row-name">{r.name}</span>
                    <span className="hp-mock-row-cat">{r.cat}</span>
                    <span className={`hp-mock-row-amt ${r.c}`}>{r.amt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EVERYTHING ── */}
      <section className="hp-section hp-everything">
        <div className="hp-inner">
          <h2 className="hp-h2">Everything you need, all in one app</h2>
          <p className="hp-desc">
            Connect your accounts and FinTrackET will do the heavy lifting to categorize your finances.
            From there, you can track, budget, collaborate, and set goals specific to you.
          </p>
          <div className="hp-feat-grid">
            {[
              { Icon: IconChart, label: 'Know where you stand', desc: "Always know where your money is going and cash flow. Get real-time notifications about where you're at." },
              { Icon: IconWallet, label: 'Budgeting from first principle', desc: "Create a budget that fits your needs — and one that you'll actually stick to — with Flex Budgets." },
              { Icon: IconTarget, label: 'Make your money go further', desc: 'Visualize your path to any financial goal — from a vacation to a new house — and track progress.' },
              { Icon: IconChart, label: 'Make smarter money moves', desc: 'Access deep analytics to see trends in your spending, income, and net worth over time.' },
            ].map((f, i) => (
              <div key={i} className="hp-feat-card">
                <div className="hp-feat-icon">
                  <f.Icon size={24} color="#e8572a" />
                </div>
                <h3>{f.label}</h3>
                <p>{f.desc}</p>
                <a href="#" className="hp-feat-link">
                  Learn more <IconArrowRight size={14} color="#e8572a" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURE ALTERNATING ROWS ── */}
      <section className="hp-section hp-rows">
        <div className="hp-inner">
          {/* Row 1: Net Worth */}
          <div className="hp-alt-row">
            <div className="hp-alt-text">
              <p className="hp-label">NET WORTH</p>
              <h2 className="hp-h2-sm">All your accounts, in one place</h2>
              <p className="hp-desc-sm">Connect all your bank accounts, credit cards, loans, real estate, and investments to see your entire financial picture in one place. It's easier to align and plan when everything is together.</p>
            </div>
            <div className="hp-alt-visual">
              <div className="hp-nw-card">
                <div className="hp-nw-label">Net Worth</div>
                <div className="hp-nw-amount">ETB 215,000</div>
                {[
                  { name: 'Commercial Bank', last: '9701', amt: 'ETB 40,000' },
                  { name: 'Savings Account', last: '4251', amt: 'ETB 25,000' },
                  { name: 'Investment', last: '6632', amt: 'ETB 150,000' },
                ].map(a => (
                  <div key={a.name} className="hp-nw-row">
                    <div className="hp-nw-row-left">
                      <div className="hp-nw-dot" />
                      <div>
                        <div className="hp-nw-row-name">{a.name}</div>
                        <div className="hp-nw-row-last">•••• {a.last}</div>
                      </div>
                    </div>
                    <div className="hp-nw-row-amt">{a.amt}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Transactions */}
          <div className="hp-alt-row reverse">
            <div className="hp-alt-visual">
              <div className="hp-tx-card">
                <div className="hp-tx-header">Transactions <span className="hp-tx-badge">5 need review</span></div>
                {[
                  { name: 'Starbucks', cat: 'Coffee', amt: '-ETB 120' },
                  { name: 'Apple', cat: 'Tech', amt: '-ETB 499' },
                  { name: 'Whole Foods', cat: 'Groceries', amt: '-ETB 850' },
                  { name: 'Urban Items', cat: 'Gifts', amt: '-ETB 650' },
                ].map(t => (
                  <div key={t.name} className="hp-tx-row">
                    <div className="hp-tx-dot" />
                    <span className="hp-tx-name">{t.name}</span>
                    <span className="hp-tx-cat">{t.cat}</span>
                    <span className="hp-tx-amt">{t.amt}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="hp-alt-text">
              <p className="hp-label">TRANSACTIONS</p>
              <h2 className="hp-h2-sm">Every transaction in one list</h2>
              <p className="hp-desc-sm">FinTrackET brings all your transactions into one clean, searchable list — no more jumping between apps or bank websites. Mark transactions as reviewed to stay on top of your spending.</p>
            </div>
          </div>

          {/* Row 3: Subscriptions */}
          <div className="hp-alt-row">
            <div className="hp-alt-text">
              <p className="hp-label">RECURRING</p>
              <h2 className="hp-h2-sm">Take control of your subscriptions</h2>
              <p className="hp-desc-sm">FinTrackET automatically detects your recurring subscriptions — like streaming services, gyms, or app memberships — so you never lose track of what you're paying for.</p>
            </div>
            <div className="hp-alt-visual">
              <div className="hp-sub-grid">
                {[
                  { label: 'Streaming', color: '#ef4444' },
                  { label: 'Music', color: '#10b981' },
                  { label: 'Cloud', color: '#3b82f6' },
                  { label: 'Gym', color: '#f59e0b' },
                  { label: 'Shopping', color: '#8b5cf6' },
                  { label: 'Gaming', color: '#e8572a' },
                ].map(s => (
                  <div key={s.label} className="hp-sub-item" style={{ borderTop: `3px solid ${s.color}` }}>
                    <div className="hp-sub-dot" style={{ background: s.color }} />
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 4: Reports */}
          <div className="hp-alt-row reverse">
            <div className="hp-alt-visual">
              <div className="hp-report-card">
                <div className="hp-report-title">Spending by Category</div>
                {[
                  { cat: 'Food', pct: 35, color: '#e8572a' },
                  { cat: 'Housing', pct: 28, color: '#f59e0b' },
                  { cat: 'Transport', pct: 18, color: '#10b981' },
                  { cat: 'Entertainment', pct: 12, color: '#3b82f6' },
                  { cat: 'Other', pct: 7, color: '#8b5cf6' },
                ].map(r => (
                  <div key={r.cat} className="hp-report-row">
                    <span className="hp-report-cat">{r.cat}</span>
                    <div className="hp-report-bar-track">
                      <div className="hp-report-bar-fill" style={{ width: r.pct + '%', background: r.color }} />
                    </div>
                    <span className="hp-report-pct">{r.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="hp-alt-text">
              <p className="hp-label">REPORTS</p>
              <h2 className="hp-h2-sm">Visualize the flow of money</h2>
              <p className="hp-desc-sm">Dive deep into your finances with customizable charts that reveal where your money's going. Whether you're tracking spending trends, income, or net worth over time.</p>
            </div>
          </div>

          {/* Row 5: Goals */}
          <div className="hp-alt-row">
            <div className="hp-alt-text">
              <p className="hp-label">GOALS</p>
              <h2 className="hp-h2-sm">Your goals, on track</h2>
              <p className="hp-desc-sm">Create a clear plan for what matters to you — whether it's a vacation, a car fund, or retirement. Set targets, track your progress, and stay motivated as savings grow.</p>
            </div>
            <div className="hp-alt-visual">
              <div className="hp-goals-card">
                {[
                  { name: 'Emergency Fund', target: 48000, current: 48000, color: '#10b981' },
                  { name: 'Vacation', target: 8000, current: 4310, color: '#e8572a' },
                  { name: 'New Car', target: 55000, current: 21014, color: '#3b82f6' },
                  { name: 'Home Down Payment', target: 100000, current: 9018, color: '#f59e0b' },
                ].map(g => (
                  <div key={g.name} className="hp-goal-item">
                    <div className="hp-goal-top">
                      <span className="hp-goal-name">{g.name}</span>
                      <span className="hp-goal-amt">ETB {g.current.toLocaleString()}</span>
                    </div>
                    <div className="hp-goal-track">
                      <div className="hp-goal-fill" style={{ width: Math.min(100, Math.round(g.current / g.target * 100)) + '%', background: g.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 6: Devices */}
          <div className="hp-alt-row reverse">
            <div className="hp-alt-visual hp-devices">
              <div className="hp-app-icons">
                {[
                  { label: 'Bank', color: '#3b82f6' },
                  { label: 'Pay', color: '#10b981' },
                  { label: 'Invest', color: '#e8572a' },
                  { label: 'Save', color: '#f59e0b' },
                  { label: 'Budget', color: '#8b5cf6' },
                  { label: 'Goals', color: '#ec4899' },
                  { label: 'Reports', color: '#14b8a6' },
                  { label: 'Track', color: '#e8572a' },
                  { label: 'Cards', color: '#3b82f6' },
                  { label: 'Loans', color: '#f97316' },
                  { label: 'Crypto', color: '#f59e0b' },
                  { label: 'Tax', color: '#6366f1' },
                ].map((item, i) => (
                  <div key={i} className="hp-app-icon" style={{ borderTop: `3px solid ${item.color}` }}>
                    <span className="hp-app-icon-label">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="hp-alt-text">
              <p className="hp-label">APPS</p>
              <h2 className="hp-h2-sm">On every device, always in sync</h2>
              <p className="hp-desc-sm">FinTrackET works seamlessly across web, iOS, and Android — so you can check in on your money anytime, anywhere. Your finances are always in sync and ready when you are.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── DATA CONNECTIVITY ── */}
      <section className="hp-section hp-data">
        <div className="hp-inner hp-data-inner">
          <div className="hp-data-text">
            <p className="hp-label">CONNECTIVITY</p>
            <h2 className="hp-h2-sm">Best-in-class data connectivity</h2>
            <p className="hp-desc-sm">FinTrackET syncs with multiple financial data providers so you get the most complete and accurate picture. No manual entry needed — track your accounts and keep them in sync.</p>
          </div>
          <div className="hp-data-visual">
            {/* Styled connection visualization - no unnecessary image */}
            <div className="hp-connection-grid">
              {[
                { label: 'Commercial Bank of Ethiopia', color: '#3b82f6' },
                { label: 'Awash Bank', color: '#10b981' },
                { label: 'Dashen Bank', color: '#e8572a' },
                { label: 'Abyssinia Bank', color: '#f59e0b' },
                { label: 'Nib Bank', color: '#8b5cf6' },
                { label: 'Wegagen Bank', color: '#ec4899' },
              ].map((b, i) => (
                <div key={i} className="hp-bank-chip" style={{ borderLeft: `3px solid ${b.color}` }}>
                  <div className="hp-bank-dot" style={{ background: b.color }} />
                  <span>{b.label}</span>
                  <span className="hp-bank-status">Connected</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT YOU CAN DO ── */}
      <section className="hp-section hp-features">
        <div className="hp-inner">
          <h2 className="hp-h2" style={{ textAlign: 'center', marginBottom: '0.75rem' }}>What you can do with FinTrackET</h2>
          <p className="hp-desc" style={{ textAlign: 'center', margin: '0 auto 2.5rem' }}>
            Everything you need to stay on top of your money, in one place.
          </p>
          <div className="hp-features-grid">
            <div className="hp-feature-card">
              <div className="hp-feature-icon">
                <IconTransactions size={24} color="#e8572a" />
              </div>
              <h3>Track transactions</h3>
              <p>Add, search, sort and export your income and expenses. Filter by date, category or type and see the full picture at any time.</p>
            </div>
            <div className="hp-feature-card">
              <div className="hp-feature-icon">
                <IconBudget size={24} color="#e8572a" />
              </div>
              <h3>Plan with budgets</h3>
              <p>Set a monthly spending limit per category and get a clear view of how much you have left — and an alert the moment you go over.</p>
            </div>
            <div className="hp-feature-card">
              <div className="hp-feature-icon">
                <IconReports size={24} color="#e8572a" />
              </div>
              <h3>Understand your spending</h3>
              <p>Monthly bar charts and category breakdowns show exactly where your money goes so you can make smarter decisions next month.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMUNITY ── */}
      <section className="hp-section hp-community">
        <div className="hp-inner hp-community-inner">
          <h2 className="hp-h2">Community resources</h2>
          <div className="hp-community-cards">
            <div className="hp-community-card">
              <div className="hp-community-icon">💬</div>
              <div>
                <div className="hp-community-title">Community</div>
                <div className="hp-community-desc">Ask questions, share tips and give feedback with other FinTrackET users.</div>
              </div>
            </div>
            <div className="hp-community-card">
              <div className="hp-community-icon">📝</div>
              <div>
                <div className="hp-community-title">Our Blog</div>
                <div className="hp-community-desc">We share expert insights and data-backed research that helps you with your money questions.</div>
                <a href="#" className="hp-community-link">Read now →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRY FREE ── */}
      <section className="hp-section hp-try">
        <div className="hp-inner hp-try-inner">
          <div className="hp-try-text">
            <p className="hp-label">GET STARTED</p>
            <h2 className="hp-h2-sm">Start managing your money today</h2>
            <p className="hp-desc-sm">Sign up for free and get a clear view of your income, expenses and budgets from day one.</p>
            <Link to="/register" className="btn btn-primary hp-try-btn">
              Free sign up <IconArrowRight size={16} color="white" />
            </Link>
          </div>
          <div className="hp-try-visual">
            {/* Phone mockup - no unnecessary image */}
            <div className="hp-phone-mock">
              <div className="hp-phone-header">
                <div className="hp-phone-title">Net Worth</div>
                <div className="hp-phone-amount">ETB 215,000</div>
              </div>
              <div className="hp-phone-chart">
                <svg viewBox="0 0 200 60" preserveAspectRatio="none" style={{ width: '100%', height: '60px' }}>
                  <defs>
                    <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e8572a" stopOpacity="0.4"/>
                      <stop offset="100%" stopColor="#e8572a" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path d="M0,55 C30,50 50,40 80,28 C110,16 140,20 160,12 L200,5 L200,60 L0,60Z" fill="url(#pg)"/>
                  <path d="M0,55 C30,50 50,40 80,28 C110,16 140,20 160,12 L200,5" fill="none" stroke="#e8572a" strokeWidth="2"/>
                </svg>
              </div>
              {[
                { name: 'Income', val: '+ETB 25,000', c: '#10b981' },
                { name: 'Expenses', val: '-ETB 12,550', c: '#ef4444' },
                { name: 'Savings', val: '+ETB 12,450', c: '#3b82f6' },
              ].map(r => (
                <div key={r.name} className="hp-phone-row">
                  <span>{r.name}</span>
                  <span style={{ color: r.c, fontWeight: 700 }}>{r.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="hp-cta">
        <div className="hp-inner hp-cta-inner">
          <h2>Track, budget, and feel good<br />about your money with<br />FinTrackET in your corner.</h2>
          <Link to="/register" className="btn hp-cta-btn">Get started today</Link>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}
