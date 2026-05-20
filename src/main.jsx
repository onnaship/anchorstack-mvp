import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Anchor,
  Archive,
  Award,
  BadgeCheck,
  BadgeDollarSign,
  BarChart3,
  Bell,
  BookOpen,
  Bookmark,
  Briefcase,
  Calendar,
  Calculator,
  Check,
  CheckCircle2,
  ChevronRight,
  Crown,
  DollarSign,
  Download,
  ExternalLink,
  FileText,
  Filter,
  Flag,
  Gauge,
  Heart,
  HelpCircle,
  Home,
  Info,
  Landmark,
  LayoutDashboard,
  LifeBuoy,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Moon,
  PiggyBank,
  Plus,
  Rocket,
  Search,
  Settings,
  Shield,
  Sparkles,
  Star,
  Tag,
  Target,
  TrendingUp,
  Truck,
  Unlock,
  User,
  Users,
  WalletCards,
  X,
  Zap
} from 'lucide-react';
import './style.css';

const BRAND = 'AnchorStack';
const CREATOR = 'Duane Moore';
const PREMIUM_PRICE = 7.99;
const PREMIUM_ANNUAL_PRICE = 79;
const rankMultipliers = { 'E-1': 0.72, 'E-2': 0.78, 'E-3': 0.86, 'E-4': 0.95, 'E-5': 1.05, 'E-6': 1.18, 'E-7': 1.32, 'O-1': 1.42, 'O-2': 1.58, 'O-3': 1.75 };
const states = ['Virginia', 'California', 'Florida', 'Texas', 'Washington', 'Hawaii', 'Maryland', 'Spain', 'Japan', 'Guam'];

const premiumFeatures = [
  'Unlimited PCS plan exports',
  'Advanced deployment savings projections',
  'Premium discount tracker',
  'Smart budget recommendations',
  'Ad-free experience',
  'Financial readiness score',
  'Priority feature updates',
  'Future AI finance assistant'
];

const quickTools = [
  { id: 'bah', title: 'BAH Calculator', icon: Landmark, premium: false, desc: 'Estimate housing allowance planning numbers.' },
  { id: 'tsp', title: 'Roth TSP Calculator', icon: TrendingUp, premium: true, desc: 'Project TSP growth and monthly contribution scenarios.' },
  { id: 'auto', title: 'Auto Allowance Calc', icon: Truck, premium: false, desc: 'Plan auto expenses, fuel, and move-related driving costs.' },
  { id: 'leave', title: 'Leave Days Calculator', icon: Calendar, premium: false, desc: 'Estimate leave balance and use planning.' },
  { id: 'weight', title: 'Weight Ticket Calc', icon: Archive, premium: true, desc: 'Estimate PPM weight-ticket planning and reimbursement scenarios.' },
  { id: 'retirement', title: 'Retirement Calculator', icon: Award, premium: true, desc: 'Long-term retirement planning and pension scenarios.' }
];

const discounts = [
  { id: 'nike', name: 'Nike', category: 'Apparel', discount: '10% Off', tag: 'Verified', premium: false, saved: false, url: 'https://www.nike.com/help/a/military-discount' },
  { id: 'samsung', name: 'Samsung', category: 'Electronics', discount: 'Up to 30% Off', tag: 'Popular', premium: false, saved: true, url: 'https://www.samsung.com/us/shop/offer-program/military/' },
  { id: 'dell', name: 'Dell', category: 'Computers', discount: 'Military Offers', tag: 'Tech', premium: false, saved: false, url: 'https://www.dell.com/en-us/lp/mpp' },
  { id: 'lowes', name: "Lowe's", category: 'Home', discount: '10% Off', tag: 'Verified', premium: false, saved: false, url: 'https://www.lowes.com/l/about/honor-our-military' },
  { id: 'underarmour', name: 'Under Armour', category: 'Apparel', discount: '20% Off', tag: 'Fitness', premium: false, saved: true, url: 'https://www.underarmour.com/en-us/t/troop-id/' },
  { id: 'att', name: 'AT&T', category: 'Phone', discount: 'Military Plans', tag: 'Family', premium: false, saved: false, url: 'https://www.att.com/offers/discount-program/military-discount/' },
  { id: 'premium-bundle', name: 'PCS Premium Bundle', category: 'Moving', discount: 'Curated savings list', tag: 'Premium', premium: true, saved: false, url: '#' },
  { id: 'travel-stack', name: 'Travel Stack', category: 'Travel', discount: 'Hotel + luggage deals', tag: 'Premium', premium: true, saved: false, url: '#' },
  { id: 'finance-stack', name: 'Finance Stack', category: 'Finance', discount: 'Banking offer tracker', tag: 'Premium', premium: true, saved: false, url: '#' }
];

const resources = [
  { id: 'pcs-checklist', title: 'PCS Move Checklist', type: 'Guide', minutes: 8, premium: false, desc: 'Plan timelines, lodging, receipts, and move paperwork.' },
  { id: 'deployment-money', title: 'Deployment Money Plan', type: 'Savings', minutes: 6, premium: false, desc: 'Build a simple savings system before, during, and after deployment.' },
  { id: 'advanced-tax', title: 'Advanced PCS Tax Notes', type: 'Premium', minutes: 11, premium: true, desc: 'Organize receipts and tax-time planning questions.' },
  { id: 'tsp-basics', title: 'TSP Basics for Service Members', type: 'Education', minutes: 7, premium: false, desc: 'Understand Roth vs traditional contributions.' },
  { id: 'premium-playbook', title: 'Premium Financial Readiness Playbook', type: 'Premium', minutes: 15, premium: true, desc: 'A step-by-step readiness checklist and savings plan.' }
];

const testimonials = [
  { name: 'E-5 Logistics Specialist', text: 'The PCS estimate gave me a clear starting number before I made travel decisions.' },
  { name: 'Military Spouse', text: 'The budget planner and discount tracker made the app feel worth keeping open.' },
  { name: 'Deployment Saver', text: 'Seeing the monthly target made it easier to stay on track.' }
];

const defaultProfile = {
  name: 'Duane',
  rank: 'E-6',
  branch: 'U.S. Navy',
  creator: CREATOR,
  premium: false,
  darkMode: false
};

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can be unavailable in private mode.
    }
  }, [key, value]);

  return [value, setValue];
}

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [profile, setProfile] = useLocalStorage('anchorstack-profile-v3', defaultProfile);
  const [favorites, setFavorites] = useLocalStorage('anchorstack-favorites-v3', ['samsung', 'underarmour']);
  const [pcs, setPcs] = useLocalStorage('anchorstack-pcs-v3', {
    rank: 'E-6',
    dependents: 2,
    from: 'Virginia',
    to: 'California',
    miles: 2600,
    weight: 6500,
    lodgingDays: 7,
    mealsDaily: 68,
    fuelCost: 520,
    hotelCost: 980
  });
  const [savings, setSavings] = useLocalStorage('anchorstack-savings-v3', {
    current: 6430,
    monthly: 850,
    months: 10,
    goal: 15000
  });
  const [budget, setBudget] = useLocalStorage('anchorstack-budget-v3', {
    income: 5200,
    housing: 1850,
    food: 650,
    transportation: 480,
    debt: 350,
    savings: 650,
    personal: 420
  });
  const [search, setSearch] = useState('');
  const [discountCategory, setDiscountCategory] = useState('All');
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState('');
  const [checkoutStatus, setCheckoutStatus] = useState('');

  const pcsEstimate = useMemo(() => calculatePcsEstimate(pcs), [pcs]);
  const budgetTotals = useMemo(() => calculateBudget(budget), [budget]);
  const projectedSavings = useMemo(() => savings.current + savings.monthly * savings.months, [savings]);
  const savingsPercent = Math.min(100, Math.round((savings.current / Math.max(1, savings.goal)) * 100));
  const readinessScore = useMemo(() => calculateReadinessScore({ pcsEstimate, budgetTotals, projectedSavings, savings }), [pcsEstimate, budgetTotals, projectedSavings, savings]);
  const premiumValue = useMemo(() => calculatePremiumValue({ pcsEstimate, budgetTotals, savings }), [pcsEstimate, budgetTotals, savings]);

  useEffect(() => {
    document.documentElement.dataset.theme = profile.darkMode ? 'dark' : 'light';
  }, [profile.darkMode]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('paid') === 'success') {
      setToast('Payment completed. Connect webhooks/user accounts next for verified premium access.');
      setCheckoutStatus('Payment success returned from Stripe. For production, verify the session with a webhook before granting permanent access.');
    }
    if (params.get('paid') === 'cancel') {
      setCheckoutStatus('Checkout canceled. You can upgrade anytime.');
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const filteredDiscounts = useMemo(() => {
    return discounts.filter((item) => {
      const categoryMatch = discountCategory === 'All' || item.category === discountCategory;
      const searchMatch = !search || `${item.name} ${item.category} ${item.discount} ${item.tag}`.toLowerCase().includes(search.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [discountCategory, search]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'premium', label: 'Premium', icon: Crown },
    { id: 'pcs', label: 'PCS Calculator', icon: Calculator },
    { id: 'deployment', label: 'Deployment Savings', icon: PiggyBank },
    { id: 'budget', label: 'Budget Planner', icon: WalletCards },
    { id: 'discounts', label: 'Military Discounts', icon: Tag },
    { id: 'resources', label: 'Resource Hub', icon: BookOpen },
    { id: 'tools', label: 'Tools', icon: Shield },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  function navigate(page) {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleFavorite(id) {
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      setToast(current.includes(id) ? 'Removed from favorites.' : 'Saved to favorites.');
      return next;
    });
  }

  function requirePremium(actionName) {
    if (profile.premium) {
      setToast(`${actionName} opened.`);
      return true;
    }
    setModal('premium-lock');
    return false;
  }

  async function startCheckout() {
    setCheckoutStatus('Opening secure Stripe Checkout...');
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'premium' })
      });

      const contentType = response.headers.get('content-type') || '';
      let data = {};

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(
          text.includes('The page could not be found') || response.status === 404
            ? 'Payment API is missing. Confirm api/create-checkout-session.js is in the GitHub repo root, then redeploy Vercel.'
            : `Payment API returned a non-JSON response. HTTP ${response.status}.`
        );
      }

      if (!response.ok) throw new Error(data.error || `Checkout failed. HTTP ${response.status}.`);
      if (!data.url) throw new Error('Stripe did not return a checkout URL. Check STRIPE_SECRET_KEY and STRIPE_PRICE_ID in Vercel.');

      window.location.href = data.url;
    } catch (error) {
      setCheckoutStatus(error.message || 'Checkout failed. Check Stripe and Vercel environment variables.');
    }
  }

  function exportPlan() {
    const plan = {
      app: BRAND,
      creator: CREATOR,
      generatedAt: new Date().toISOString(),
      readinessScore,
      pcs,
      pcsEstimate,
      savings,
      projectedSavings,
      budget,
      budgetTotals,
      favorites,
      premiumValue
    };
    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = 'anchorstack-financial-plan.json';
    link.click();
    URL.revokeObjectURL(href);
    setToast('Financial plan downloaded.');
  }

  const shared = {
    navigate,
    profile,
    setProfile,
    pcs,
    setPcs,
    pcsEstimate,
    savings,
    setSavings,
    projectedSavings,
    savingsPercent,
    budget,
    setBudget,
    budgetTotals,
    readinessScore,
    premiumValue,
    filteredDiscounts,
    discountCategory,
    setDiscountCategory,
    favorites,
    toggleFavorite,
    search,
    setSearch,
    setToast,
    setModal,
    requirePremium,
    startCheckout,
    checkoutStatus,
    exportPlan
  };

  function renderPage() {
    switch (activePage) {
      case 'premium': return <PremiumPage {...shared} />;
      case 'pcs': return <PcsPage {...shared} />;
      case 'deployment': return <DeploymentPage {...shared} />;
      case 'budget': return <BudgetPage {...shared} />;
      case 'discounts': return <DiscountsPage {...shared} />;
      case 'resources': return <ResourcesPage {...shared} />;
      case 'tools': return <ToolsPage {...shared} />;
      case 'community': return <CommunityPage {...shared} />;
      case 'favorites': return <FavoritesPage {...shared} />;
      case 'settings': return <SettingsPage {...shared} />;
      default: return <DashboardPage {...shared} />;
    }
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>

      <aside className="sidebar" aria-label="Main navigation">
        <div className="brand-block">
          <div className="brand-mark" aria-hidden="true"><Anchor size={32} /></div>
          <div>
            <h1>{BRAND}</h1>
            <p>Military Finance Command Center</p>
          </div>
        </div>

        <div className="premium-mini">
          <div>
            <span>Readiness</span>
            <strong>{readinessScore}%</strong>
          </div>
          <div className="mini-progress" aria-label={`${readinessScore}% readiness score`}><span style={{ width: `${readinessScore}%` }} /></div>
          <button type="button" onClick={() => navigate('premium')}><Crown size={16} /> Upgrade Value</button>
        </div>

        <nav className="nav-list" aria-label="App sections">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              onClick={() => navigate(id)}
              className={`nav-button ${activePage === id ? 'active' : ''}`}
              aria-current={activePage === id ? 'page' : undefined}
            >
              <Icon size={20} aria-hidden="true" />
              <span>{label}</span>
              {id === 'premium' && <Sparkles size={15} aria-hidden="true" />}
            </button>
          ))}
        </nav>

        <section className="creator-card" aria-labelledby="creator-title">
          <div className="creator-avatar" aria-hidden="true">DM</div>
          <div>
            <h2 id="creator-title">Created by {CREATOR}</h2>
            <p>Built for service members, military families, and smarter financial readiness.</p>
          </div>
        </section>
      </aside>

      <main id="main-content" className="main-area" role="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">Military Finance Dashboard</p>
            <h2>{pageTitle(activePage)}</h2>
            <p className="subtitle">PCS planning, deployment savings, military discounts, and premium readiness tools in one professional app.</p>
          </div>
          <div className="top-actions">
            <div className="search-wrap">
              <Search size={18} aria-hidden="true" />
              <input
                aria-label="Search discounts and resources"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search app..."
              />
            </div>
            <button type="button" className="soft-button" onClick={() => setModal('payday')}>
              <Calendar size={18} aria-hidden="true" />
              Next payday in 5 days
            </button>
            <button type="button" className="primary-button glow" onClick={startCheckout}>
              <Crown size={18} aria-hidden="true" />
              Go Premium
            </button>
          </div>
        </header>

        {checkoutStatus && <div className="status-banner" role="status">{checkoutStatus}</div>}

        {renderPage()}

        <footer className="app-footer">
          <div>
            <strong>{BRAND}</strong>
            <p>Created by {CREATOR}. Independent planning tool. Not affiliated with DoD or any government agency.</p>
          </div>
          <div className="footer-links">
            <button type="button" onClick={() => setModal('privacy')}>Privacy</button>
            <button type="button" onClick={() => setModal('terms')}>Terms</button>
            <button type="button" onClick={() => setModal('contact')}>Contact Creator</button>
          </div>
        </footer>
      </main>

      {toast && <div className="toast" role="status">{toast}</div>}
      {modal && <Modal name={modal} close={() => setModal(null)} startCheckout={startCheckout} />}
    </div>
  );
}

function DashboardPage(props) {
  const { navigate, pcsEstimate, projectedSavings, savingsPercent, budgetTotals, readinessScore, premiumValue, startCheckout, exportPlan, setModal } = props;

  return (
    <div className="page-stack">
      <section className="hero-card conversion-hero">
        <div>
          <p className="eyebrow">Mission Ready Money</p>
          <h3>Turn military financial planning into a clean, premium command center.</h3>
          <p>AnchorStack helps users estimate PCS costs, track savings, organize budgets, find discounts, and understand why premium planning is worth paying for.</p>
          <div className="button-row">
            <button type="button" className="primary-button glow" onClick={startCheckout}><Crown size={18} /> Unlock Premium</button>
            <button type="button" className="outline-button" onClick={() => navigate('premium')}><Sparkles size={18} /> See Benefits</button>
            <button type="button" className="outline-button" onClick={exportPlan}><Download size={18} /> Export Plan</button>
          </div>
        </div>
        <div className="value-panel">
          <div className="value-ring" aria-label={`${readinessScore}% readiness score`}>
            <strong>{readinessScore}%</strong>
            <span>Readiness Score</span>
          </div>
          <div className="value-item"><span>Potential value found</span><strong>{money(premiumValue.monthlyValue)}</strong></div>
          <div className="value-item"><span>Premium cost</span><strong>${PREMIUM_PRICE}/mo</strong></div>
          <div className="value-item success"><span>Estimated monthly upside</span><strong>{money(premiumValue.netValue)}</strong></div>
        </div>
      </section>

      <section className="stats-grid">
        <MetricCard icon={Calculator} title="PCS Budget Estimate" value={money(pcsEstimate.total)} desc="Calculated from editable PCS inputs" onClick={() => navigate('pcs')} />
        <MetricCard icon={PiggyBank} title="Projected Savings" value={money(projectedSavings)} desc={`${savingsPercent}% of current goal`} onClick={() => navigate('deployment')} />
        <MetricCard icon={DollarSign} title="Budget Remaining" value={money(budgetTotals.remaining)} desc={`${budgetTotals.assignedPercent}% of income assigned`} onClick={() => navigate('budget')} />
        <MetricCard icon={Crown} title="Premium Value" value={money(premiumValue.monthlyValue)} desc="Estimated monthly planning value" onClick={() => navigate('premium')} accent="gold" />
      </section>

      <section className="two-column">
        <div className="panel">
          <div className="section-title">
            <div>
              <h3>Why users upgrade</h3>
              <p>Show real benefits before the paywall. Make the premium value obvious.</p>
            </div>
            <button type="button" className="text-button" onClick={() => setModal('conversion-strategy')}>Strategy</button>
          </div>
          <div className="upgrade-grid">
            <UpgradeReason icon={Zap} title="Save time" desc="Quickly builds PCS, savings, and budget scenarios." />
            <UpgradeReason icon={BadgeDollarSign} title="Find money leaks" desc="Budget score highlights unused and overassigned cash." />
            <UpgradeReason icon={Target} title="Hit goals faster" desc="Deployment tracker shows monthly targets." />
            <UpgradeReason icon={Tag} title="Unlock premium deals" desc="Premium discount stacks create a clear reason to pay." />
          </div>
        </div>

        <PremiumTeaser startCheckout={startCheckout} />
      </section>

      <Testimonials />
    </div>
  );
}

function PremiumPage({ startCheckout, premiumValue, readinessScore }) {
  return (
    <div className="page-stack">
      <section className="pricing-hero">
        <div>
          <p className="eyebrow">AnchorStack Premium</p>
          <h3>Make the membership feel like a financial upgrade, not just an app subscription.</h3>
          <p>Premium is positioned around saving time, finding missed savings, and giving service members a more complete readiness system.</p>
          <div className="button-row">
            <button type="button" className="primary-button glow" onClick={startCheckout}><Crown size={18} /> Start Premium</button>
            <a className="outline-link" href="#feature-comparison">Compare Plans</a>
          </div>
        </div>
        <div className="pricing-card featured">
          <span className="save-pill">Best value</span>
          <h4>Premium Monthly</h4>
          <strong>${PREMIUM_PRICE}<small>/mo</small></strong>
          <p>Built for users who want PCS, deployment, and monthly budget planning in one place.</p>
          <button type="button" className="gold-button full" onClick={startCheckout}>Upgrade Now</button>
        </div>
        <div className="pricing-card">
          <span className="save-pill">Save 17%</span>
          <h4>Premium Annual</h4>
          <strong>${PREMIUM_ANNUAL_PRICE}<small>/yr</small></strong>
          <p>Great for career service members and families who plan year-round.</p>
          <button type="button" className="outline-button full" onClick={startCheckout}>Choose Annual</button>
        </div>
      </section>

      <section className="stats-grid">
        <MetricCard icon={Gauge} title="Readiness Score" value={`${readinessScore}%`} desc="Premium improves visibility and planning" />
        <MetricCard icon={BadgeDollarSign} title="Potential Value" value={money(premiumValue.monthlyValue)} desc="Estimated monthly planning upside" />
        <MetricCard icon={Crown} title="Premium Cost" value={`$${PREMIUM_PRICE}`} desc="Monthly subscription" />
        <MetricCard icon={TrendingUp} title="Net Upside" value={money(premiumValue.netValue)} desc="Estimated value minus monthly price" />
      </section>

      <section id="feature-comparison" className="panel">
        <div className="section-title">
          <div>
            <h3>Free vs Premium</h3>
            <p>Clear feature comparison helps users understand what they unlock.</p>
          </div>
        </div>
        <div className="comparison-table" role="table" aria-label="Free versus Premium feature comparison">
          <div className="comparison-row head" role="row"><span>Feature</span><span>Free</span><span>Premium</span></div>
          {[
            ['PCS budget estimate', 'Basic', 'Advanced + export'],
            ['Deployment savings tracker', 'Basic', 'Advanced projections'],
            ['Budget planner', 'Manual', 'Smart readiness score'],
            ['Military discounts', 'Standard list', 'Premium stacks + favorites'],
            ['Financial plan export', 'Limited', 'Unlimited'],
            ['Ads/sponsored blocks', 'May appear', 'Ad-free'],
            ['Future AI assistant', 'Locked', 'Included']
          ].map(([feature, free, premium]) => (
            <div className="comparison-row" role="row" key={feature}>
              <span>{feature}</span>
              <span>{free}</span>
              <span><Check size={17} aria-hidden="true" /> {premium}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h3>Premium unlocks</h3>
        <div className="feature-cloud">
          {premiumFeatures.map((feature) => <span key={feature}><BadgeCheck size={16} />{feature}</span>)}
        </div>
      </section>

      <Testimonials />
    </div>
  );
}

function PcsPage({ pcs, setPcs, pcsEstimate, exportPlan, requirePremium }) {
  return (
    <div className="page-stack">
      <section className="calculator-layout">
        <div className="panel navy-panel">
          <div className="section-title light">
            <div>
              <h3>PCS Budget Calculator</h3>
              <p>Estimate move expenses with editable inputs.</p>
            </div>
            <Truck size={42} aria-hidden="true" />
          </div>
          <div className="form-grid">
            <SelectField label="Rank" value={pcs.rank} onChange={(v) => setPcs({ ...pcs, rank: v })} options={Object.keys(rankMultipliers)} />
            <NumberField label="Dependents" value={pcs.dependents} onChange={(v) => setPcs({ ...pcs, dependents: v })} />
            <SelectField label="From" value={pcs.from} onChange={(v) => setPcs({ ...pcs, from: v })} options={states} />
            <SelectField label="To" value={pcs.to} onChange={(v) => setPcs({ ...pcs, to: v })} options={states} />
            <NumberField label="Miles" value={pcs.miles} onChange={(v) => setPcs({ ...pcs, miles: v })} />
            <NumberField label="HHG weight" value={pcs.weight} onChange={(v) => setPcs({ ...pcs, weight: v })} />
            <NumberField label="Lodging days" value={pcs.lodgingDays} onChange={(v) => setPcs({ ...pcs, lodgingDays: v })} />
            <NumberField label="Daily meals estimate" value={pcs.mealsDaily} onChange={(v) => setPcs({ ...pcs, mealsDaily: v })} />
            <NumberField label="Fuel cost" value={pcs.fuelCost} onChange={(v) => setPcs({ ...pcs, fuelCost: v })} />
            <NumberField label="Hotel cost" value={pcs.hotelCost} onChange={(v) => setPcs({ ...pcs, hotelCost: v })} />
          </div>
        </div>

        <div className="panel">
          <div className="estimate-hero">
            <span>Total PCS Estimate</span>
            <strong>{money(pcsEstimate.total)}</strong>
            <p>Includes lodging, meals, fuel, weight planning, miles, dependents, rank multiplier, and contingency.</p>
          </div>
          <div className="breakdown-list">
            {Object.entries(pcsEstimate.breakdown).map(([key, value]) => (
              <div key={key}><span>{labelize(key)}</span><strong>{money(value)}</strong></div>
            ))}
          </div>
          <div className="button-row vertical">
            <button type="button" className="primary-button full" onClick={exportPlan}><Download size={18} /> Download PCS Plan</button>
            <button type="button" className="outline-button full" onClick={() => requirePremium('Advanced PCS comparison')}><Lock size={18} /> Compare 3 Move Scenarios</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function DeploymentPage({ savings, setSavings, projectedSavings, savingsPercent, requirePremium }) {
  const requiredMonthly = Math.max(0, Math.ceil((savings.goal - savings.current) / Math.max(1, savings.months)));

  return (
    <div className="page-stack">
      <section className="two-column">
        <div className="panel">
          <h3>Deployment Savings Tracker</h3>
          <p>Update your current savings, monthly contribution, remaining months, and goal.</p>
          <div className="form-grid">
            <NumberField label="Current saved" value={savings.current} onChange={(v) => setSavings({ ...savings, current: v })} />
            <NumberField label="Monthly savings" value={savings.monthly} onChange={(v) => setSavings({ ...savings, monthly: v })} />
            <NumberField label="Months remaining" value={savings.months} onChange={(v) => setSavings({ ...savings, months: v })} />
            <NumberField label="Goal amount" value={savings.goal} onChange={(v) => setSavings({ ...savings, goal: v })} />
          </div>
        </div>

        <div className="panel">
          <div className="estimate-hero">
            <span>Projected Total</span>
            <strong>{money(projectedSavings)}</strong>
            <p>{projectedSavings >= savings.goal ? 'You are on pace to meet your goal.' : `You need about ${money(requiredMonthly)} per month to hit the goal.`}</p>
          </div>
          <div className="progress-label"><span>Current progress</span><strong>{savingsPercent}%</strong></div>
          <div className="big-progress"><span style={{ width: `${savingsPercent}%` }} /></div>
          <div className="chart-card" aria-hidden="true">
            <div style={{ height: `${Math.min(96, 20 + savingsPercent)}%` }} />
            <div style={{ height: `${Math.min(96, 30 + savingsPercent)}%` }} />
            <div style={{ height: `${Math.min(96, 40 + savingsPercent)}%` }} />
            <div style={{ height: `${Math.min(96, 50 + savingsPercent)}%` }} />
          </div>
          <button type="button" className="outline-button full" onClick={() => requirePremium('Advanced deployment forecast')}><Lock size={18} /> Unlock advanced forecast</button>
        </div>
      </section>
    </div>
  );
}

function BudgetPage({ budget, setBudget, budgetTotals, requirePremium }) {
  const fields = [
    ['income', 'Monthly income'],
    ['housing', 'Housing'],
    ['food', 'Food'],
    ['transportation', 'Transportation'],
    ['debt', 'Debt'],
    ['savings', 'Savings'],
    ['personal', 'Personal spending']
  ];

  return (
    <div className="page-stack">
      <section className="stats-grid">
        <MetricCard icon={WalletCards} title="Income" value={money(budget.income)} desc="Monthly planning income" />
        <MetricCard icon={BadgeDollarSign} title="Assigned" value={money(budgetTotals.assigned)} desc={`${budgetTotals.assignedPercent}% of income`} />
        <MetricCard icon={DollarSign} title="Remaining" value={money(budgetTotals.remaining)} desc={budgetTotals.remaining >= 0 ? 'Available to assign' : 'Over budget'} />
        <MetricCard icon={Gauge} title="Health Score" value={`${budgetTotals.health}%`} desc="Budget health estimate" />
      </section>

      <section className="two-column">
        <div className="panel">
          <h3>Budget Planner</h3>
          <p>Edit categories and the dashboard updates instantly.</p>
          <div className="form-grid">
            {fields.map(([key, label]) => (
              <NumberField key={key} label={label} value={budget[key]} onChange={(v) => setBudget({ ...budget, [key]: v })} />
            ))}
          </div>
        </div>

        <div className="panel">
          <h3>Budget Breakdown</h3>
          <div className="breakdown-list">
            {fields.filter(([key]) => key !== 'income').map(([key, label]) => (
              <div key={key}><span>{label}</span><strong>{money(budget[key])}</strong></div>
            ))}
          </div>
          <div className="big-progress" aria-label={`${budgetTotals.assignedPercent}% of income assigned`}>
            <span style={{ width: `${Math.min(100, budgetTotals.assignedPercent)}%` }} />
          </div>
          <button type="button" className="outline-button full" onClick={() => requirePremium('Smart budget recommendations')}><Lock size={18} /> Unlock smart recommendations</button>
        </div>
      </section>
    </div>
  );
}

function DiscountsPage({ filteredDiscounts, discountCategory, setDiscountCategory, favorites, toggleFavorite, search, setSearch, requirePremium }) {
  const categories = ['All', ...Array.from(new Set(discounts.map((item) => item.category)))];

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="section-title">
          <div>
            <h3>Military Discount Hub</h3>
            <p>Filter, search, save, and open discount providers. Premium deals create an upgrade reason.</p>
          </div>
          <div className="search-wrap inline">
            <Search size={18} aria-hidden="true" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search discounts..." aria-label="Search discounts" />
          </div>
        </div>

        <div className="filter-row" aria-label="Discount categories">
          {categories.map((cat) => (
            <button type="button" key={cat} className={discountCategory === cat ? 'chip active' : 'chip'} onClick={() => setDiscountCategory(cat)}>
              <Filter size={14} aria-hidden="true" /> {cat}
            </button>
          ))}
        </div>

        <div className="discount-grid">
          {filteredDiscounts.map((item) => (
            <article className={`discount-card ${item.premium ? 'premium-locked-card' : ''}`} key={item.id}>
              <div className="discount-top">
                <div className="discount-logo">{item.name[0]}</div>
                <button type="button" className="icon-button" aria-label={`Save ${item.name}`} onClick={() => toggleFavorite(item.id)}>
                  <Heart size={18} fill={favorites.includes(item.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
              <h4>{item.name}</h4>
              <p>{item.category}</p>
              <strong>{item.discount}</strong>
              <span className="tag-pill">{item.tag}</span>
              {item.premium ? (
                <button type="button" className="gold-button full" onClick={() => requirePremium(`${item.name} deal`)}>
                  <Lock size={16} /> Unlock Deal
                </button>
              ) : (
                <button type="button" className="outline-button full" onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}>
                  Open Deal <ExternalLink size={16} aria-hidden="true" />
                </button>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ResourcesPage({ setModal, requirePremium }) {
  return (
    <div className="page-stack">
      <section className="panel">
        <div className="section-title">
          <div>
            <h3>Resource Hub</h3>
            <p>Professional content blocks ready for SEO, education, and premium upgrades.</p>
          </div>
          <button type="button" className="primary-button" onClick={() => setModal('content-plan')}>Content Plan</button>
        </div>

        <div className="resource-list">
          {resources.map((article) => (
            <article className="resource-card" key={article.id}>
              <div className="resource-icon">{article.premium ? <Lock size={22} /> : <FileText size={22} />}</div>
              <div>
                <h4>{article.title}</h4>
                <p>{article.desc}</p>
                <span>{article.type} • {article.minutes} min read</span>
              </div>
              <button type="button" className={article.premium ? 'gold-button' : 'text-button'} onClick={() => article.premium ? requirePremium(article.title) : setModal(article.id)}>
                {article.premium ? 'Unlock' : 'Read'}
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ToolsPage({ setToast, requirePremium }) {
  const [toolInput, setToolInput] = useState({ bahBase: 1850, tspMonthly: 500, years: 20, leave: 24, weight: 7200 });
  const tspFuture = Math.round(toolInput.tspMonthly * 12 * toolInput.years * 1.65);

  return (
    <div className="page-stack">
      <section className="two-column">
        <div className="panel">
          <h3>Professional Quick Tools</h3>
          <p>Basic tools open immediately. Premium tools present a clear upgrade prompt.</p>
          <div className="tool-list">
            {quickTools.map(({ id, title, icon: Icon, desc, premium }) => (
              <button type="button" className={`tool-row ${premium ? 'premium-row' : ''}`} key={id} onClick={() => premium ? requirePremium(title) : setToast(`${title} opened.`)}>
                <Icon size={22} aria-hidden="true" />
                <span><strong>{title}</strong><small>{desc}</small></span>
                {premium ? <Lock size={18} aria-hidden="true" /> : <ChevronRight size={18} aria-hidden="true" />}
              </button>
            ))}
          </div>
        </div>

        <div className="panel">
          <h3>Tool Simulator</h3>
          <div className="form-grid">
            <NumberField label="BAH base estimate" value={toolInput.bahBase} onChange={(v) => setToolInput({ ...toolInput, bahBase: v })} />
            <NumberField label="TSP monthly contribution" value={toolInput.tspMonthly} onChange={(v) => setToolInput({ ...toolInput, tspMonthly: v })} />
            <NumberField label="Years invested" value={toolInput.years} onChange={(v) => setToolInput({ ...toolInput, years: v })} />
            <NumberField label="Leave days" value={toolInput.leave} onChange={(v) => setToolInput({ ...toolInput, leave: v })} />
          </div>
          <div className="breakdown-list">
            <div><span>Estimated annual BAH planning</span><strong>{money(toolInput.bahBase * 12)}</strong></div>
            <div><span>Projected TSP future value</span><strong>{money(tspFuture)}</strong></div>
            <div><span>Leave value estimate</span><strong>{money(toolInput.leave * 160)}</strong></div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CommunityPage({ setModal }) {
  const posts = [
    { id: 1, name: 'PCS Planner Group', title: 'Best receipt tracker for a PPM move?', replies: 19, tag: 'PCS' },
    { id: 2, name: 'Deployment Savings', title: 'How much should I automate monthly while deployed?', replies: 31, tag: 'Savings' },
    { id: 3, name: 'TSP Talk', title: 'Roth TSP contribution plan for junior Sailors', replies: 12, tag: 'TSP' }
  ];

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="section-title">
          <div>
            <h3>Community</h3>
            <p>A polished community mockup ready for a database backend.</p>
          </div>
          <button type="button" className="primary-button" onClick={() => setModal('new-post')}><Plus size={18} /> New Post</button>
        </div>

        <div className="community-list">
          {posts.map((post) => (
            <article className="community-card" key={post.id}>
              <div className="avatar">{post.name.slice(0, 2).toUpperCase()}</div>
              <div>
                <span className="tag-pill">{post.tag}</span>
                <h4>{post.title}</h4>
                <p>{post.name} • {post.replies} replies</p>
              </div>
              <button type="button" className="text-button" onClick={() => setModal(`community-${post.id}`)}>Open</button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function FavoritesPage({ favorites, toggleFavorite }) {
  const saved = discounts.filter((item) => favorites.includes(item.id));

  return (
    <div className="page-stack">
      <section className="panel">
        <h3>Saved Favorites</h3>
        <p>Your saved discounts appear here.</p>
        {saved.length === 0 ? (
          <div className="empty-state"><Bookmark size={42} /><h4>No saved favorites yet.</h4><p>Go to Military Discounts and tap the heart icon.</p></div>
        ) : (
          <div className="discount-grid">
            {saved.map((item) => (
              <article className="discount-card" key={item.id}>
                <div className="discount-top">
                  <div className="discount-logo">{item.name[0]}</div>
                  <button type="button" className="icon-button" onClick={() => toggleFavorite(item.id)} aria-label={`Remove ${item.name}`}><X size={18} /></button>
                </div>
                <h4>{item.name}</h4>
                <p>{item.category}</p>
                <strong>{item.discount}</strong>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function SettingsPage({ profile, setProfile, setToast }) {
  return (
    <div className="page-stack">
      <section className="two-column">
        <div className="panel">
          <h3>Profile Settings</h3>
          <p>These settings save locally and personalize the app.</p>
          <div className="form-grid">
            <TextField label="Display name" value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} />
            <SelectField label="Rank" value={profile.rank} onChange={(v) => setProfile({ ...profile, rank: v })} options={Object.keys(rankMultipliers)} />
            <TextField label="Branch" value={profile.branch} onChange={(v) => setProfile({ ...profile, branch: v })} />
            <TextField label="Creator credit" value={profile.creator} onChange={(v) => setProfile({ ...profile, creator: v })} />
          </div>
          <div className="button-row">
            <button type="button" className="primary-button" onClick={() => setToast('Settings saved.')}>Save Settings</button>
            <button type="button" className="outline-button" onClick={() => setProfile({ ...profile, darkMode: !profile.darkMode })}>
              <Moon size={18} /> Toggle {profile.darkMode ? 'Light' : 'Dark'} Mode
            </button>
          </div>
        </div>

        <div className="panel">
          <h3>App Details</h3>
          <div className="breakdown-list">
            <div><span>App</span><strong>{BRAND}</strong></div>
            <div><span>Creator</span><strong>{CREATOR}</strong></div>
            <div><span>Payments</span><strong>Stripe Checkout</strong></div>
            <div><span>Hosting</span><strong>Vercel Ready</strong></div>
            <div><span>Status</span><strong>Premium MVP</strong></div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PremiumTeaser({ startCheckout }) {
  return (
    <div className="panel premium-panel">
      <div className="premium-badge"><Crown size={18} /> Premium</div>
      <h3>Unlock the tools users actually care about</h3>
      <p>Premium should feel like a better financial system: more projections, more exports, premium discounts, and readiness scoring.</p>
      <ul className="check-list">
        {premiumFeatures.slice(0, 5).map((feature) => <li key={feature}><CheckCircle2 size={18} /> {feature}</li>)}
      </ul>
      <button type="button" className="gold-button full" onClick={startCheckout}><Crown size={18} /> Upgrade for ${PREMIUM_PRICE}/mo</button>
    </div>
  );
}

function Testimonials() {
  return (
    <section className="testimonial-grid" aria-label="User value examples">
      {testimonials.map((item) => (
        <article className="testimonial-card" key={item.name}>
          <div className="stars" aria-hidden="true"><Star size={16} /><Star size={16} /><Star size={16} /><Star size={16} /><Star size={16} /></div>
          <p>“{item.text}”</p>
          <strong>{item.name}</strong>
        </article>
      ))}
    </section>
  );
}

function UpgradeReason({ icon: Icon, title, desc }) {
  return (
    <div className="upgrade-reason">
      <Icon size={22} aria-hidden="true" />
      <div>
        <strong>{title}</strong>
        <p>{desc}</p>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, title, value, desc, onClick, accent }) {
  return (
    <button type="button" className={`metric-card ${accent || ''}`} onClick={onClick || (() => {})}>
      <div className="metric-icon"><Icon size={24} aria-hidden="true" /></div>
      <span>{title}</span>
      <strong>{value}</strong>
      <p>{desc}</p>
      <ChevronRight size={18} aria-hidden="true" />
    </button>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function NumberField({ label, value, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type="number" inputMode="decimal" value={value} onChange={(e) => onChange(Number(e.target.value || 0))} />
    </label>
  );
}

function TextField({ label, value, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function Modal({ name, close, startCheckout }) {
  const copy = modalCopy(name);
  return (
    <div className="modal-backdrop" role="presentation" onClick={close}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={close} aria-label="Close dialog"><X size={20} /></button>
        <div className="modal-icon">{copy.premium ? <Crown size={26} /> : <Info size={26} />}</div>
        <h3 id="modal-title">{copy.title}</h3>
        <p>{copy.body}</p>
        <div className="button-row">
          {copy.premium && <button type="button" className="primary-button glow" onClick={startCheckout}><Crown size={18} /> Upgrade Premium</button>}
          <button type="button" className="outline-button" onClick={close}>Close</button>
        </div>
      </section>
    </div>
  );
}

function modalCopy(name) {
  const map = {
    payday: { title: 'Next Payday', body: 'This reminder can later connect to a full military pay calendar. Current demo reminder: next payday in 5 days.' },
    privacy: { title: 'Privacy', body: 'AnchorStack stores calculator data locally in the browser for this MVP. Payment data is handled by Stripe Checkout, not by this app.' },
    terms: { title: 'Terms', body: 'AnchorStack is an independent financial planning tool created by Duane Moore. It is not affiliated with DoD or any government agency.' },
    contact: { title: 'Contact Creator', body: 'Creator: Duane Moore. Add your business support email here before launch.' },
    'conversion-strategy': { title: 'Premium Conversion Strategy', body: 'The app now shows premium value before asking for payment: ROI, feature comparison, locked premium tools, premium discount stacks, and direct upgrade buttons.' },
    'premium-lock': { title: 'Premium Feature Locked', body: 'This feature is part of AnchorStack Premium. Upgrade to unlock advanced forecasts, premium discount stacks, unlimited exports, and future AI tools.', premium: true },
    'content-plan': { title: 'SEO Content Plan', body: 'Publish articles around PCS budgeting, deployment savings, TSP basics, BAH planning, and military discount guides.' },
    'new-post': { title: 'Community Posting', body: 'The community section is front-end ready. Connect it to Supabase, Firebase, or another backend to save real posts.', premium: true },
    'pcs-checklist': { title: 'PCS Move Checklist', body: 'Start 90 days out, build a receipts folder, confirm weight tickets, track lodging, and export your AnchorStack plan.' },
    'deployment-money': { title: 'Deployment Money Plan', body: 'Set an automatic savings amount, reduce unnecessary subscriptions, and check progress every payday.' },
    'tsp-basics': { title: 'TSP Basics', body: 'Use consistent contributions, understand Roth versus traditional, and review your long-term allocation.' }
  };
  if (name?.startsWith('community-')) return { title: 'Community Thread', body: 'This thread opens correctly. A database backend can be connected next for replies, likes, and moderation.' };
  return map[name] || { title: 'AnchorStack', body: 'This feature is connected and ready to be expanded.' };
}

function calculatePcsEstimate(pcs) {
  const miles = safeNumber(pcs.miles);
  const weight = safeNumber(pcs.weight);
  const dependents = safeNumber(pcs.dependents);
  const lodgingDays = safeNumber(pcs.lodgingDays);
  const mealsDaily = safeNumber(pcs.mealsDaily);
  const rankMultiplier = rankMultipliers[pcs.rank] || 1;

  const breakdown = {
    mileage: Math.round(miles * 0.22),
    weightPlanning: Math.round(weight * 0.38 * rankMultiplier),
    lodging: safeNumber(pcs.hotelCost) || Math.round(lodgingDays * 140),
    meals: Math.round(lodgingDays * mealsDaily * (1 + dependents * 0.45)),
    fuel: safeNumber(pcs.fuelCost) || Math.round(miles * 0.18),
    contingency: Math.round((miles * 0.08 + weight * 0.06) * rankMultiplier)
  };

  const total = Object.values(breakdown).reduce((sum, item) => sum + item, 0);
  return { total, breakdown };
}

function calculateBudget(budget) {
  const keys = ['housing', 'food', 'transportation', 'debt', 'savings', 'personal'];
  const assigned = keys.reduce((sum, key) => sum + safeNumber(budget[key]), 0);
  const income = safeNumber(budget.income);
  const remaining = income - assigned;
  const assignedPercent = income ? Math.round((assigned / income) * 100) : 0;
  const savingsRate = income ? safeNumber(budget.savings) / income : 0;
  const overBudgetPenalty = Math.max(0, assignedPercent - 90) * 1.25;
  const health = Math.max(0, Math.min(100, Math.round(72 + savingsRate * 80 - overBudgetPenalty)));
  return { assigned, remaining, assignedPercent, health };
}

function calculateReadinessScore({ pcsEstimate, budgetTotals, projectedSavings, savings }) {
  const budgetComponent = Math.min(35, Math.max(0, budgetTotals.health * 0.35));
  const savingsComponent = Math.min(35, Math.max(0, (projectedSavings / Math.max(1, savings.goal)) * 35));
  const pcsComponent = pcsEstimate.total > 0 ? 20 : 0;
  const planningComponent = 10;
  return Math.round(Math.min(100, budgetComponent + savingsComponent + pcsComponent + planningComponent));
}

function calculatePremiumValue({ pcsEstimate, budgetTotals, savings }) {
  const discountValue = 35;
  const budgetLeakValue = Math.max(0, Math.min(250, budgetTotals.remaining * 0.08));
  const pcsPlanningValue = Math.min(150, Math.max(25, pcsEstimate.total * 0.015));
  const savingsValue = Math.min(120, Math.max(15, savings.monthly * 0.05));
  const monthlyValue = Math.round(discountValue + budgetLeakValue + pcsPlanningValue + savingsValue);
  const netValue = Math.max(0, Math.round(monthlyValue - PREMIUM_PRICE));
  return { monthlyValue, netValue };
}

function pageTitle(page) {
  const titles = {
    dashboard: 'Deployment Savings',
    premium: 'Premium Membership',
    pcs: 'PCS Budget Calculator',
    deployment: 'Deployment Savings Tracker',
    budget: 'Monthly Budget Planner',
    discounts: 'Military Discount Hub',
    resources: 'Resource Hub',
    tools: 'Professional Tools',
    community: 'Community',
    favorites: 'Favorites',
    settings: 'Settings'
  };
  return titles[page] || 'Dashboard';
}

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(safeNumber(value));
}

function safeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function labelize(value) {
  return value.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase());
}

createRoot(document.getElementById('root')).render(<App />);
