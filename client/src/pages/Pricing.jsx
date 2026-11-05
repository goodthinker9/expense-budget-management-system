import { useState } from 'react';
import { Link } from 'react-router-dom';
import HomeNav from '../components/HomeNav';
import HomeFooter from '../components/HomeFooter';
import './MarketingPage.css';
import './Pricing.css';

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

const features = [
  {
    category: '📊 Tracking',
    rows: [
      { label: 'See your complete net worth across every account', core: true, plus: true },
      { label: 'Get reminders about subscriptions and upcoming bills', core: true, plus: true },
      { label: 'Automatically categorize your transactions with custom rules', core: true, plus: true },
      { label: 'Track investment performance and monitor diversification', core: false, plus: true },
      { label: 'Track equity compensation for a more complete picture of real net worth', core: false, plus: true },
      { label: 'Categorize transactions automatically and fine-tune with advanced rules', core: false, plus: true },
      { label: 'Analyze unrealized gains, losses, and asset allocation in depth', core: false, plus: true },
    ],
  },
  {
    category: '💰 Budgeting',
    rows: [
      { label: 'Find your fit with two different budgeting approaches', core: true, plus: true },
      { label: 'Create a budget automatically based on real spending patterns', core: true, plus: true },
      { label: 'Get an alert before you overspend', core: true, plus: true },
    ],
  },
  {
    category: '🎯 Planning & Forecasting',
    rows: [
      { label: 'Plan and stay on track for savings and debt pay-down goals', core: true, plus: true },
      { label: 'Get guidance for existing contributions needed to achieve your goals', core: false, plus: true },
      { label: 'Chart your path to retirement with real numbers', core: false, plus: true },
      { label: 'Model how a job change, move, or milestone could reshape your plan', core: false, plus: true },
    ],
  },
  {
    category: '🏢 Small Business Tracking',
    rows: [
      { label: 'Track your small business, or hide business expenses from personal finances', core: false, plus: true },
      { label: 'See dedicated P&L tracking for each business', core: false, plus: true },
      { label: 'Get export-ready reports for tax season', core: false, plus: true },
    ],
  },
  {
    category: '🤖 Guidance & Insights',
    rows: [
      { label: 'Ask your AI assistant anything, with guidance shaped by your financial data', core: true, plus: true },
      { label: 'Get a weekly summary of your spending, net worth, and upcoming expenses', core: true, plus: true },
    ],
  },
  {
    category: '🔗 Connectivity & Integrations',
    rows: [
      { label: 'Connect to 13,000+ banks and financial institutions', core: true, plus: true },
      { label: 'Track your home value with Zillow integration', core: true, plus: true },
      { label: 'Track crypto with Coinbase integration', core: false, plus: true },
      { label: 'Sync your Apple Card seamlessly', core: false, plus: true },
      { label: 'Scan and itemize receipts for detailed categorization', core: false, plus: true },
    ],
  },
  {
    category: '👥 Access & Collaboration',
    rows: [
      { label: 'Use on web, mobile, or iPad — wherever you are', core: true, plus: true },
      { label: 'Add a partner for free', core: true, plus: true },
      { label: 'Share access only with a financial professional', core: false, plus: true },
    ],
  },
];

const reviews = [
  { stars: 5, text: '"FinTrackET has helped me better understand my finances tremendously. You all have made a fantastic product and I\'m glad I found it. Thank you, thank you, thank you!"' },
  { stars: 5, text: '"This is the app I\'ve always wanted. Well worth the price!"' },
  { stars: 5, text: '"FinTrackET then was the best but turns out Monarch keeping all the same just had more. The amazing insights into my finances and well worth the extremely reasonable price tag."' },
  { stars: 5, text: '"Worth every penny! Great features that are always getting added. Even better customer service!"' },
  { stars: 5, text: '"The UI interface and ease of use and absolutely love all the features especially the flexibility with budgeting by category or group or by subcategory and the concept of a \'family\' or \'household\' allowing for flagging transactions as \'family member\' is the cherry on the cake."' },
  { stars: 5, text: '"Monarch has been a game changer for how my wife and I manage our finances. It\'s transformed our money conversations from stressful guesswork into a clear, shared plan of action."' },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="mp-page">
      <HomeNav />

      {/* ── PROMO BANNER ── */}
      <div className="promo-bar">
        Get 30% OFF Core for one year with code WELCOME7
      </div>

      {/* ── HEADER ── */}
      <section className="pricing-hero">
        <div className="mp-inner pricing-hero-inner">
          <div className="pricing-hero-text">
            <h1 className="mp-h2" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Your first week is on us</h1>
            <p className="mp-sub-desc">FinTrackET is your home base for money clarity, with guidance tailored to your specific needs. Track everything in one place, get a clear view forward, and feel confident about your next money move.</p>
          </div>

          <div className="pricing-toggle">
            <button className={`pricing-toggle-btn ${annual ? 'active' : ''}`} onClick={() => setAnnual(true)}>Annual</button>
            <button className={`pricing-toggle-btn ${!annual ? 'active' : ''}`} onClick={() => setAnnual(false)}>Monthly</button>
          </div>

          <div className="pricing-cards">
            {/* Core */}
            <div className="pricing-card">
              <div className="pricing-card-name">Core</div>
              <div className="pricing-card-tagline">Budget, save, and stay on track</div>
              <div className="pricing-card-price">
                <span className="pricing-price-amount">{annual ? 'ETB 499' : 'ETB 649'}</span>
                <span className="pricing-price-period">/{annual ? 'mo annually' : 'month'}</span>
              </div>
              {annual && <div className="pricing-card-savings">Save ETB 1,800/yr</div>}
              <ul className="pricing-card-features">
                <li>✓ Track everything in one place</li>
                <li>✓ Build budgets that fit your life</li>
                <li>✓ Set and track financial goals</li>
                <li>✓ Find and track subscriptions</li>
              </ul>
              <Link to="/register" className="btn btn-outline pricing-card-btn">Try FinTrackET free for 7 days</Link>
            </div>

            {/* Plus */}
            <div className="pricing-card pricing-card--plus">
              <div className="pricing-card-badge">POPULAR</div>
              <div className="pricing-card-name">Plus</div>
              <div className="pricing-card-tagline">Advanced tools for long-term planning and multiple income sources</div>
              <div className="pricing-card-price">
                <span className="pricing-price-amount">{annual ? 'ETB 849' : 'ETB 999'}</span>
                <span className="pricing-price-period">/{annual ? 'mo annually' : 'month'}</span>
              </div>
              {annual && <div className="pricing-card-savings">Save ETB 1,800/yr</div>}
              <ul className="pricing-card-features">
                <li>✓ Everything in Core, plus:</li>
                <li>✓ Forecast your path to goals</li>
                <li>✓ Get 14 months rolling end dates</li>
                <li>✓ Professional sharing tools</li>
                <li>✓ Investment tracking &amp; insights</li>
                <li>✓ Small business tracking</li>
              </ul>
              <Link to="/register" className="btn btn-primary pricing-card-btn">Try FinTrackET free for 7 days</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY PAY ── */}
      <section className="mp-section">
        <div className="mp-inner">
          <div className="pricing-why-grid">
            <div className="pricing-why-text">
              <h2 className="mp-h2">Why pay for a personal finance app?</h2>
              <p className="mp-sub-desc">If you're wondering how you should best manage your finances, we encourage you to consider a subscription-based app instead of a free one. Here's why:</p>
            </div>
            <div className="pricing-why-reasons">
              {[
                { icon: '🚫', title: 'Never any ads', desc: 'When you pay for a service, you are the customer. Free services are incentivized to sell your data to advertisers and build features that make you click more ads, not features that actually help you.' },
                { icon: '🔒', title: "We don't sell your financial data", desc: 'Your financial data is extremely private. It is also extremely valuable to advertisers. Free services profit by selling it. Companies with free offerings have no incentive to add strong privacy features.' },
                { icon: '📡', title: 'Industry-best data connectivity', desc: 'Paid services are most useful when they are able to sync with real-time data from all of your accounts. Free services often dedicate the same amount of resources to maintaining connections.' },
                { icon: '🚀', title: "We're not going anywhere", desc: 'Trusting a new personal finance app is a commitment, and we take it seriously. Our revenue comes directly from our members, ensuring we develop features you\'ll love and grow a healthy business while doing so.' },
              ].map(r => (
                <div key={r.title} className="pricing-reason">
                  <div className="pricing-reason-icon">{r.icon}</div>
                  <div>
                    <h3 className="pricing-reason-title">{r.title}</h3>
                    <p className="pricing-reason-desc">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE TABLE ── */}
      <section className="mp-section mp-dark-section">
        <div className="mp-inner">
          <h2 className="mp-h2" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Everything you need to manage your money, all in one place</h2>
          <p className="mp-sub-desc" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>Whether you're just getting started or want to plan further ahead, FinTrackET has a plan that fits your needs.</p>
          <div className="feat-table">
            <div className="feat-table-head">
              <div className="feat-table-col-label"></div>
              <div className="feat-table-col-header core">Core</div>
              <div className="feat-table-col-header plus">Plus</div>
            </div>
            {features.map(section => (
              <div key={section.category} className="feat-section">
                <div className="feat-section-title">{section.category}</div>
                {section.rows.map(row => (
                  <div key={row.label} className="feat-row">
                    <div className="feat-row-label">{row.label}</div>
                    <div className="feat-row-check">{row.core ? <span className="check orange">✓</span> : <span className="check gray">—</span>}</div>
                    <div className="feat-row-check">{row.plus ? <span className="check orange">✓</span> : <span className="check gray">—</span>}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RATING ── */}
      <section className="mp-section" style={{ textAlign: 'center' }}>
        <div className="mp-inner">
          <div className="pricing-rating">★★★★★ <span>4.9</span></div>
          <p style={{ color: '#a8a89a', fontSize: '0.875rem', marginBottom: '2.5rem' }}>400,000+ reviews</p>
          <h2 className="mp-h2">The reviews are in</h2>
          <div className="pricing-reviews">
            {reviews.map((r, i) => (
              <div key={i} className="pricing-review-card">
                <div className="stars">{'★'.repeat(r.stars)}</div>
                <p>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="mp-section mp-dark-section">
        <div className="mp-inner">
          <h2 className="mp-h2">FAQs</h2>
          <div className="mp-faq">
            <FaqItem q="What is the cost of a subscription?" a={`Core plan: ETB ${annual ? '499' : '649'}/month. Plus plan: ETB ${annual ? '849' : '999'}/month. Both include a 7-day free trial.`} />
            <FaqItem q="What's included in the Plus tier?" a="Plus includes everything in Core plus investment tracking, goal forecasting, small business tracking, advanced reports, and professional sharing tools." />
            <FaqItem q="What if I sign up, but decide FinTrackET isn't right for me?" a="No worries! You can cancel any time during your 7-day free trial and won't be charged. After that, you can cancel before your next billing cycle." />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mp-cta">
        <div className="mp-inner mp-cta-inner">
          <h2>Track, budget, and feel good about your money with FinTrackET in your corner</h2>
          <Link to="/register" className="btn mp-cta-btn">Get started today</Link>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}
