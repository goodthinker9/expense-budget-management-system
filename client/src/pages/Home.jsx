import { Link } from 'react-router-dom';
import HomeNav from '../components/HomeNav';
import HomeFooter from '../components/HomeFooter';
import {
  IconChart, IconArrowRight,
  IconTransactions, IconBudget, IconReports,
} from '../components/Icons';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      <HomeNav />

      {/* ── HERO ── */}
      <section className="hp-hero">
        <div className="hp-hero-overlay" />
        <div className="hp-hero-content">
          <p className="hp-hero-eyebrow">PERSONAL FINANCE</p>
          <h1 className="hp-hero-title">Know exactly where your money goes</h1>
          <p className="hp-hero-sub">Track income and expenses, set category budgets, and read monthly reports — all in one place.</p>
          <Link to="/register" className="btn btn-primary hp-hero-btn">
            Get started for free
          </Link>
        </div>
      </section>

      {/* ── WHAT IS ── */}
      <section className="hp-section hp-what">
        <div className="hp-inner">
          <p className="hp-label">WHAT IS FINTRUCKET?</p>
          <h2 className="hp-h2">Your home base for money clarity</h2>
          <p className="hp-desc">
            FinTrackET gives you one place to record every transaction, organise it into
            categories, stay inside your monthly budgets, and understand your spending
            through clear charts and reports — all in ETB.
          </p>
          {/* Dashboard mock */}
          <div className="hp-dashboard-mock">
            <div className="hp-mock-sidebar">
              <div className="hp-mock-logo">💰 FinTrackET</div>
              {['Dashboard', 'Transactions', 'Categories', 'Budgets', 'Reports'].map(item => (
                <div key={item} className="hp-mock-nav">{item}</div>
              ))}
            </div>
            <div className="hp-mock-main">
              <div className="hp-mock-header">Balance <strong>ETB 12,450.00</strong></div>
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
                  { name: 'Transport', cat: 'Travel', amt: '-ETB 850', c: 'red' },
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
            Record transactions, group them by category, set budgets and read reports.
            No bank connections required — you stay in control of your data.
          </p>
          <div className="hp-feat-grid">
            {[
              { Icon: IconTransactions, label: 'Track every transaction', desc: 'Add income and expenses, search and sort the list, filter by type or date, and export to CSV at any time.' },
              { Icon: IconBudget,       label: 'Budget by category',       desc: 'Set a monthly ETB limit for each spending category and see a progress bar fill as you spend.' },
              { Icon: IconReports,      label: 'Monthly reports',           desc: 'An income-vs-expense bar chart and a category breakdown chart update automatically every month.' },
              { Icon: IconChart,        label: 'Dashboard at a glance',     desc: 'Your balance, income, expenses and top spending categories are summarised on one screen.' },
            ].map((f, i) => (
              <div key={i} className="hp-feat-card">
                <div className="hp-feat-icon">
                  <f.Icon size={24} color="#e8572a" />
                </div>
                <h3>{f.label}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURE ALT ROWS ── */}
      <section className="hp-section hp-rows">
        <div className="hp-inner">

          {/* Row 1: Transactions */}
          <div className="hp-alt-row">
            <div className="hp-alt-visual">
              <div className="hp-tx-card">
                <div className="hp-tx-header">Transactions</div>
                {[
                  { name: 'Salary',     cat: 'Income',   amt: '+ETB 25,000', income: true },
                  { name: 'Groceries',  cat: 'Food',     amt: '-ETB 3,200',  income: false },
                  { name: 'Electricity',cat: 'Utilities',amt: '-ETB 1,100',  income: false },
                  { name: 'Transport',  cat: 'Travel',   amt: '-ETB 850',    income: false },
                ].map(t => (
                  <div key={t.name} className="hp-tx-row">
                    <div className="hp-tx-dot" style={{ background: t.income ? '#10b981' : '#e8572a' }} />
                    <span className="hp-tx-name">{t.name}</span>
                    <span className="hp-tx-cat">{t.cat}</span>
                    <span className="hp-tx-amt" style={{ color: t.income ? '#059669' : '#ef4444' }}>{t.amt}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="hp-alt-text">
              <p className="hp-label">TRANSACTIONS</p>
              <h2 className="hp-h2-sm">Every transaction in one list</h2>
              <p className="hp-desc-sm">Add, edit and delete income and expense records. Search by description or category, sort any column, filter by date range or type, and export filtered results to CSV.</p>
            </div>
          </div>

          {/* Row 2: Budgets */}
          <div className="hp-alt-row reverse">
            <div className="hp-alt-visual">
              <div className="hp-budget-card">
                <div className="hp-budget-title">Budgets — November 2026</div>
                {[
                  { cat: 'Food',      spent: 3200, limit: 4000, pct: 80,  color: '#f59e0b' },
                  { cat: 'Housing',   spent: 8500, limit: 8500, pct: 100, color: '#ef4444' },
                  { cat: 'Transport', spent: 850,  limit: 2000, pct: 43,  color: '#10b981' },
                  { cat: 'Utilities', spent: 1100, limit: 1500, pct: 73,  color: '#10b981' },
                ].map(b => (
                  <div key={b.cat} className="hp-budget-row">
                    <div className="hp-budget-row-top">
                      <span className="hp-budget-cat">{b.cat}</span>
                      <span className="hp-budget-pct" style={{ color: b.pct >= 100 ? '#ef4444' : b.pct >= 80 ? '#d97706' : '#059669' }}>
                        {b.pct}%
                      </span>
                    </div>
                    <div className="hp-budget-track">
                      <div className="hp-budget-fill" style={{ width: `${Math.min(b.pct, 100)}%`, background: b.color }} />
                    </div>
                    <div className="hp-budget-meta">
                      <span>ETB {b.spent.toLocaleString()}</span>
                      <span style={{ color: '#9ca3af' }}> / ETB {b.limit.toLocaleString()}</span>
                      {b.pct >= 100 && <span className="hp-budget-over">Over budget</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hp-alt-text">
              <p className="hp-label">BUDGETS</p>
              <h2 className="hp-h2-sm">Monthly limits, per category</h2>
              <p className="hp-desc-sm">Set an ETB spending limit for any category and month. A progress bar tracks how much you have used, and an over-budget warning appears the moment you exceed the limit.</p>
            </div>
          </div>

          {/* Row 3: Reports */}
          <div className="hp-alt-row">
            <div className="hp-alt-visual">
              <div className="hp-report-card">
                <div className="hp-report-title">Spending by Category — Nov 2026</div>
                {[
                  { cat: 'Housing',   pct: 46, color: '#e8572a' },
                  { cat: 'Food',      pct: 24, color: '#f59e0b' },
                  { cat: 'Utilities', pct: 17, color: '#10b981' },
                  { cat: 'Transport', pct: 9,  color: '#3b82f6' },
                  { cat: 'Other',     pct: 4,  color: '#8b5cf6' },
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
              <h2 className="hp-h2-sm">Understand your spending</h2>
              <p className="hp-desc-sm">A monthly income-vs-expenses bar chart and a spending-by-category breakdown show exactly where your money goes — and let you export the full dataset to CSV.</p>
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
              <p>Set a monthly ETB limit per category. A progress bar fills as you spend, and an alert fires the moment you go over.</p>
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
            <div className="hp-phone-mock">
              <div className="hp-phone-header">
                <div className="hp-phone-title">Balance</div>
                <div className="hp-phone-amount">ETB 12,450</div>
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
                { name: 'Income',   val: '+ETB 25,000', c: '#10b981' },
                { name: 'Expenses', val: '-ETB 12,550', c: '#ef4444' },
                { name: 'Balance',  val: 'ETB 12,450',  c: '#2563eb' },
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
