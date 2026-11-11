import { useState } from 'react';
import { Link } from 'react-router-dom';
import HomeNav from '../components/HomeNav';
import HomeFooter from '../components/HomeFooter';
import {
  IconTransactions, IconBudget, IconReports, IconCategory, IconDashboard,
} from '../components/Icons';
import './Pricing.css';

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`pricing-faq-item ${open ? 'open' : ''}`}>
      <button className="pricing-faq-q" onClick={() => setOpen(!open)}>
        {q}<span className="pricing-faq-arrow">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="pricing-faq-a">{a}</div>}
    </div>
  );
}

export default function Pricing() {
  return (
    <div className="pricing-page">
      <HomeNav />

      {/* ── HEADER ── */}
      <section className="pricing-hero">
        <div className="pricing-inner">
          <p className="pricing-eyebrow">PRICING</p>
          <h1 className="pricing-title">Free while we&rsquo;re building it</h1>
          <p className="pricing-sub">
            FinTrackET is in active development. Everything is free for now —
            no trial, no credit card, no catch.
          </p>
        </div>
      </section>

      {/* ── PLAN CARD ── */}
      <section className="pricing-card-section">
        <div className="pricing-inner">
          <div className="pricing-single-card">
            <div className="pricing-card-header">
              <div>
                <div className="pricing-plan-name">FinTrackET</div>
                <div className="pricing-plan-tagline">Everything included, at no cost</div>
              </div>
              <div className="pricing-plan-price">
                <span className="pricing-plan-amount">ETB 0</span>
                <span className="pricing-plan-period">/ month</span>
              </div>
            </div>

            <ul className="pricing-features-list">
              <li>
                <IconTransactions size={16} color="#e8572a" />
                <span><strong>Transactions</strong> — add, edit, delete; search, sort and filter by date, category or type; export to CSV</span>
              </li>
              <li>
                <IconCategory size={16} color="#e8572a" />
                <span><strong>Categories</strong> — create income and expense categories to organise your records</span>
              </li>
              <li>
                <IconBudget size={16} color="#e8572a" />
                <span><strong>Monthly budgets</strong> — set an ETB limit per category, track progress with a bar, get an over-budget warning</span>
              </li>
              <li>
                <IconDashboard size={16} color="#e8572a" />
                <span><strong>Dashboard</strong> — balance, income, expenses and spending-by-category charts for the selected month</span>
              </li>
              <li>
                <IconReports size={16} color="#e8572a" />
                <span><strong>Monthly reports</strong> — income vs. expenses bar chart, category breakdown, and CSV export</span>
              </li>
            </ul>

            <Link to="/register" className="btn btn-primary pricing-cta-btn">
              Create free account
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="pricing-faq-section">
        <div className="pricing-inner">
          <h2 className="pricing-faq-title">Questions</h2>
          <div className="pricing-faq-list">
            <FaqItem
              q="Is it really free?"
              a="Yes, for now. FinTrackET is in active development and there is no charge to use it. If that ever changes we will tell you clearly in advance."
            />
            <FaqItem
              q="Where is my data stored?"
              a="Your data is stored in a secure database linked to your account. Only you can access it after signing in."
            />
            <FaqItem
              q="Can I export my data?"
              a="Yes. Transactions and reports can be exported as CSV files at any time from the Transactions page and the Reports page."
            />
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}
