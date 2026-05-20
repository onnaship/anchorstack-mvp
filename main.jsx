import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Anchor,
  BarChart3,
  Bell,
  Bookmark,
  Briefcase,
  Calculator,
  Calendar,
  ChevronRight,
  Crown,
  DollarSign,
  Home,
  PiggyBank,
  Shield,
  Star,
  Tag,
  Truck,
  Users,
  WalletCards
} from 'lucide-react';
import './style.css';

const STORAGE_KEY = 'anchorstack_state_v1';

const stateMultiplier = {
  Virginia: 1.02,
  California: 1.35,
  Florida: 1.06,
  Texas: 1.00,
  Washington: 1.16,
  Maryland: 1.12,
  Georgia: 0.98,
  Spain: 1.28
};

const rankBase = {
  'E-1': 900,
  'E-2': 980,
  'E-3': 1100,
  'E-4': 1250,
  'E-5': 1450,
  'E-6': 1650,
  'E-7': 1900,
  'O-1': 2100,
  'O-2': 2400,
  'O-3': 2800
};

const defaultState = {
  premium: false,
  pcs: {
    rank: 'E-6',
    dependents: 2,
    from: 'Virginia',
    to: 'California',
    distance: 2600,
    weight: 6500,
    lodgingDays: 5
  },
  savings: {
    current: 6430,
    monthly: 850,
    months: 10,
    goal: 15000
  },
  budget: {
    income: 5200,
    rent: 1900,
    food: 650,
    transportation: 420,
    debt: 300,
    savings: 850,
    other: 275
  }
};

function money(value) {
  const num = Number(value || 0);
  return num.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function clamp(num, min, max) {
  return Math.max(min, Math.min(max, num));
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== 'object') return defaultState;
    return {
      ...defaultState,
      ...saved,
      pcs: { ...defaultState.pcs, ...(saved.pcs || {}) },
      savings: { ...defaultState.savings, ...(saved.savings || {}) },
      budget: { ...defaultState.budget, ...(saved.budget || {}) }
    };
  } catch {
    return defaultState;
  }
}

function App() {
  const [active, setActive] = useState('Dashboard');
  const [state, setState] = useState(loadState);
  const [checkoutStatus, setCheckoutStatus] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('paid') === 'success') {
      setState(prev => ({ ...prev, premium: true }));
      setCheckoutStatus('Premium unlocked on this device. For production accounts, connect Stripe webhooks and user login.');
      window.history.replaceState({}, '', '/');
    }
    if (params.get('paid') === 'cancel') {
      setCheckoutStatus('Checkout was cancelled. You can try again anytime.');
      window.history.replaceState({}, '', '/');
    }
  }, []);

  const pcsEstimate = useMemo(() => {
    const pcs = state.pcs;
    const base = rankBase[pcs.rank] || 1500;
    const distanceCost = Number(pcs.distance || 0) * 0.72;
    const weightCost = Number(pcs.weight || 0) * 0.42;
    const dependentsCost = Number(pcs.dependents || 0) * 420;
    const lodgingCost = Number(pcs.lodgingDays || 0) * 185;
    const multiplier = ((stateMultiplier[pcs.from] || 1) + (stateMultiplier[pcs.to] || 1)) / 2;
    return Math.round((base + distanceCost + weightCost + dependentsCost + lodgingCost) * multiplier);
  }, [state.pcs]);

  const budgetSpent = Object.entries(state.budget)
    .filter(([key]) => key !== 'income')
    .reduce((sum, [, value]) => sum + Number(value || 0), 0);

  const budgetRemaining = Number(state.budget.income || 0) - budgetSpent;
  const budgetUsedPct = clamp(Math.round((budgetSpent / Number(state.budget.income || 1)) * 100), 0, 100);

  const projectedSavings = Number(state.savings.current || 0) + Number(state.savings.monthly || 0) * Number(state.savings.months || 0);
  const savingsProgress = clamp(Math.round((Number(state.savings.current || 0) / Number(state.savings.goal || 1)) * 100), 0, 100);

  async function startCheckout() {
    setCheckoutStatus('Opening secure Stripe Checkout...');
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'premium' })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Checkout failed.');
      window.location.href = data.url;
    } catch (error) {
      setCheckoutStatus(error.message);
    }
  }

  function updateGroup(group, field, value) {
    setState(prev => ({
      ...prev,
      [group]: {
        ...prev[group],
        [field]: value
      }
    }));
  }

  function resetData() {
    setState(defaultState);
    setCheckoutStatus('Demo data reset.');
  }

  const navItems = [
    ['Dashboard', Home],
    ['PCS Calculator', Calculator],
    ['Deployment Savings', PiggyBank],
    ['Budget Planner', WalletCards],
    ['Military Discounts', Tag],
    ['Resource Hub', Briefcase],
    ['Community', Users]
  ];

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">Skip to main content</a>

      <aside className="sidebar" aria-label="AnchorStack navigation">
        <div className="brand">
          <Anchor size={42} aria-hidden="true" />
          <div>
            <h1>AnchorStack</h1>
            <p>Plan Your Move. Build Your Future.</p>
          </div>
        </div>

        <nav aria-label="Main navigation">
          {navItems.map(([name, Icon]) => (
            <button
              className={active === name ? 'nav-item active' : 'nav-item'}
              key={name}
              type="button"
              onClick={() => setActive(name)}
            >
              <Icon size={20} aria-hidden="true" />
              <span>{name}</span>
            </button>
          ))}
        </nav>

        <section className="premium-card" aria-labelledby="premium-card-title">
          <Star size={34} aria-hidden="true" />
          <h2 id="premium-card-title">AnchorStack Premium</h2>
          <p>Premium calculators, savings plans, and military finance tools.</p>
          <button type="button" onClick={startCheckout}>Upgrade Now</button>
        </section>
      </aside>

      <main className="main" id="main-content" role="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">Military finance dashboard</p>
            <h2>{active}</h2>
            <p>Build PCS plans, deployment savings goals, and monthly budgets.</p>
          </div>
          <div className="top-actions" aria-label="Account actions">
            <span><Calendar size={18} aria-hidden="true" /> Next payday in 5 days</span>
            <button className="icon-button" type="button" aria-label="Notifications"><Bell size={22} aria-hidden="true" /></button>
            <button className="icon-button" type="button" aria-label="Saved items"><Bookmark size={22} aria-hidden="true" /></button>
            <button type="button" onClick={startCheckout}><Crown size={18} aria-hidden="true" /> {state.premium ? 'Premium Active' : 'Go Premium'}</button>
          </div>
        </header>

        {checkoutStatus && <div className="notice" role="status">{checkoutStatus}</div>}

        <section className="stats" aria-label="Financial summary">
          <Stat icon={<Calculator />} title="PCS Budget Estimate" value={money(pcsEstimate)} label="Calculated from your PCS inputs" />
          <Stat icon={<PiggyBank />} title="Projected Savings" value={money(projectedSavings)} label={`${savingsProgress}% of current goal saved`} />
          <Stat icon={<DollarSign />} title="Budget Remaining" value={money(budgetRemaining)} label={`${budgetUsedPct}% of income assigned`} />
          <article className="stat">
            <div className="icon orange" aria-hidden="true"><BarChart3 /></div>
            <h3>Premium Status</h3>
            <p className="stat-value">{state.premium ? 'Active' : 'Free'}</p>
            <p>{state.premium ? 'Thanks for supporting AnchorStack' : 'Upgrade to unlock premium tools'}</p>
          </article>
        </section>

        <section className="grid" aria-label="Primary tools">
          <PCSCalculator pcs={state.pcs} update={(field, value) => updateGroup('pcs', field, value)} estimate={pcsEstimate} />
          <SavingsTracker savings={state.savings} update={(field, value) => updateGroup('savings', field, value)} projected={projectedSavings} progress={savingsProgress} />
        </section>

        <section className="grid lower-grid" aria-label="Budget and monetization tools">
          <BudgetPlanner budget={state.budget} update={(field, value) => updateGroup('budget', field, value)} spent={budgetSpent} remaining={budgetRemaining} pct={budgetUsedPct} />
          <PremiumPanel startCheckout={startCheckout} premium={state.premium} resetData={resetData} />
        </section>

        <section className="lower" aria-label="Discounts and quick tools">
          <DiscountHub />
          <QuickTools />
        </section>

        <footer>
          <div>
            <h2>Ready to earn?</h2>
            <p>Connect Stripe in Vercel, link your bank in Stripe, and premium payments can begin flowing to your Stripe balance.</p>
          </div>
          <button type="button" onClick={startCheckout}><Crown size={18} aria-hidden="true"/> Test Checkout</button>
        </footer>
      </main>
    </div>
  );
}

function Stat({ icon, title, value, label }) {
  return (
    <article className="stat">
      <div className="icon" aria-hidden="true">{icon}</div>
      <h3>{title}</h3>
      <p className="stat-value">{value}</p>
      <p>{label}</p>
    </article>
  );
}

function PCSCalculator({ pcs, update, estimate }) {
  const states = Object.keys(stateMultiplier);
  const ranks = Object.keys(rankBase);

  return (
    <section className="calculator-panel" aria-labelledby="pcs-title">
      <div className="panel-head">
        <div>
          <h3 id="pcs-title">PCS Budget Calculator</h3>
          <p>Estimate move expenses with editable inputs.</p>
        </div>
        <Truck size={42} aria-hidden="true" />
      </div>

      <div className="form-grid">
        <LabelSelect label="Rank" value={pcs.rank} onChange={value => update('rank', value)} options={ranks} />
        <LabelInput label="Dependents" type="number" value={pcs.dependents} onChange={value => update('dependents', Number(value))} />
        <LabelSelect label="From" value={pcs.from} onChange={value => update('from', value)} options={states} />
        <LabelSelect label="To" value={pcs.to} onChange={value => update('to', value)} options={states} />
        <LabelInput label="Miles" type="number" value={pcs.distance} onChange={value => update('distance', Number(value))} />
        <LabelInput label="Household goods weight" type="number" value={pcs.weight} onChange={value => update('weight', Number(value))} />
        <LabelInput label="Lodging days" type="number" value={pcs.lodgingDays} onChange={value => update('lodgingDays', Number(value))} />
      </div>

      <div className="result-card dark">
        <p>Estimated PCS cost</p>
        <strong>{money(estimate)}</strong>
        <span>Use this as a planning estimate, not official entitlement guidance.</span>
      </div>
    </section>
  );
}

function SavingsTracker({ savings, update, projected, progress }) {
  return (
    <section className="savings-panel" aria-labelledby="savings-title">
      <h3 id="savings-title">Deployment Savings Tracker</h3>
      <p>Track your current balance and projected savings.</p>

      <div className="form-grid">
        <LabelInput label="Current saved" type="number" value={savings.current} onChange={value => update('current', Number(value))} />
        <LabelInput label="Monthly savings" type="number" value={savings.monthly} onChange={value => update('monthly', Number(value))} />
        <LabelInput label="Months remaining" type="number" value={savings.months} onChange={value => update('months', Number(value))} />
        <LabelInput label="Goal amount" type="number" value={savings.goal} onChange={value => update('goal', Number(value))} />
      </div>

      <div className="saving-row"><span>Current progress</span><strong>{progress}%</strong></div>
      <div className="progress" aria-label={`${progress} percent of savings goal reached`}><span style={{ width: `${progress}%` }}></span></div>
      <div className="saving-row"><span>Projected total</span><strong className="green">{money(projected)}</strong></div>
      <div className="chart" aria-hidden="true"></div>
    </section>
  );
}

function BudgetPlanner({ budget, update, spent, remaining, pct }) {
  const fields = [
    ['income', 'Monthly income'],
    ['rent', 'Rent / housing'],
    ['food', 'Food'],
    ['transportation', 'Transportation'],
    ['debt', 'Debt payments'],
    ['savings', 'Savings'],
    ['other', 'Other']
  ];

  return (
    <section className="savings-panel" aria-labelledby="budget-title">
      <h3 id="budget-title">Budget Planner</h3>
      <p>Enter your income and expenses. The app saves changes on this device.</p>

      <div className="form-grid">
        {fields.map(([field, label]) => (
          <LabelInput
            key={field}
            label={label}
            type="number"
            value={budget[field]}
            onChange={value => update(field, Number(value))}
          />
        ))}
      </div>

      <div className="saving-row"><span>Assigned spending</span><strong>{money(spent)}</strong></div>
      <div className="saving-row"><span>Remaining</span><strong className={remaining >= 0 ? 'green' : 'red'}>{money(remaining)}</strong></div>
      <div className="progress" aria-label={`${pct} percent of budget used`}><span style={{ width: `${pct}%` }}></span></div>
    </section>
  );
}

function PremiumPanel({ startCheckout, premium, resetData }) {
  const benefits = [
    'Premium PCS planning exports',
    'Deployment savings automation',
    'Ad-free military discount hub',
    'Future AI budget assistant'
  ];

  return (
    <section className="premium-upgrade" aria-labelledby="premium-title">
      <Crown size={42} aria-hidden="true" />
      <h3 id="premium-title">Premium subscription</h3>
      <p className="price">$7.99/month</p>
      <p>Turn AnchorStack into a passive-income product by charging for premium tools.</p>

      <ul>
        {benefits.map(item => <li key={item}><Shield size={18} aria-hidden="true" /> {item}</li>)}
      </ul>

      <button type="button" onClick={startCheckout}>{premium ? 'Premium Active' : 'Start Secure Checkout'}</button>
      <button type="button" className="secondary-button" onClick={resetData}>Reset demo data</button>
    </section>
  );
}

function DiscountHub() {
  const discounts = [
    ['Nike', '10% Off', 'https://www.nike.com/help/a/military-discount'],
    ['Samsung', 'Offers', 'https://www.samsung.com/us/shop/offer-program/military/'],
    ['Dell', 'Military store', 'https://www.dell.com/en-us/lp/military'],
    ["Lowe's", 'Military discount', 'https://www.lowes.com/l/about/honor-our-military'],
    ['GovX', 'Military deals', 'https://www.govx.com/']
  ];

  return (
    <section className="discounts" aria-labelledby="discounts-title">
      <div className="section-head">
        <h3 id="discounts-title">Military Discount Hub</h3>
        <span>Affiliate-ready</span>
      </div>
      <div className="discount-grid">
        {discounts.map(([name, off, url]) => (
          <a className="discount" href={url} key={name} target="_blank" rel="noreferrer">
            <div className="logo" aria-hidden="true">{name[0]}</div>
            <strong>{name}</strong>
            <p>{off}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

function QuickTools() {
  const tools = [
    'BAH Calculator',
    'Roth TSP Planner',
    'Auto Allowance Calculator',
    'Leave Days Calculator',
    'Weight Ticket Tracker',
    'Retirement Planner'
  ];

  return (
    <section className="quick-tools" aria-labelledby="quick-tools-title">
      <h3 id="quick-tools-title">Quick Tools</h3>
      <p>Premium feature ideas for your next app update.</p>
      <div className="tool-grid">
        {tools.map(tool => (
          <button className="tool" key={tool} type="button">
            <Shield size={18} aria-hidden="true" />
            <span>{tool}</span>
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  );
}

function LabelInput({ label, value, onChange, type = 'text' }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value} onChange={event => onChange(event.target.value)} />
    </label>
  );
}

function LabelSelect({ label, value, onChange, options }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={event => onChange(event.target.value)}>
        {options.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

createRoot(document.getElementById('root')).render(<App />);
