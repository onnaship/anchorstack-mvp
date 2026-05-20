import React from 'react';
import { createRoot } from 'react-dom/client';
import { Home, Calculator, PiggyBank, Tag, Crown, Calendar, Bell, Bookmark, ChevronRight, Shield, Truck, WalletCards, Star, Users, Briefcase, BarChart3 } from 'lucide-react';
import './style.css';

function App() {
  const discounts = [
    ['Nike', '10% Off'], ['Samsung', '5% Off'], ['Under Armour', '11% Off'], ['Dell', '10% Off'], ["Lowe's", '10% Off']
  ];

  const tools = ['BAH Calculator', 'Roth TSP Calculator', 'Auto Allowance Calc', 'Leave Days Calculator', 'Weight Ticket Calc', 'Retirement Calculator'];

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="anchor">⚓</div>
          <div>
            <h1>AnchorStack</h1>
            <p>Plan Your Move. Build Your Future.</p>
          </div>
        </div>

        <nav>
          {[
            ['Dashboard', Home],
            ['PCS Calculator', Calculator],
            ['Deployment Savings', PiggyBank],
            ['Budget Planner', WalletCards],
            ['Military Discounts', Tag],
            ['Resource Hub', Briefcase],
            ['Community', Users],
          ].map(([name, Icon], i) => (
            <a className={i === 0 ? 'active' : ''} key={name}>
              <Icon size={20} /> {name}
            </a>
          ))}
        </nav>

        <div className="premium-card">
          <Star size={34} />
          <h3>AnchorStack Premium</h3>
          <p>Unlock all calculators, premium discounts, and advanced tools.</p>
          <button>Upgrade Now</button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h2>Good morning, Alex! 👋</h2>
            <p>Let's build your financial freedom.</p>
          </div>
          <div className="top-actions">
            <span><Calendar size={18} /> Next Payday in 5 days</span>
            <Bell size={22} />
            <Bookmark size={22} />
            <button><Crown size={18} /> Go Premium</button>
          </div>
        </header>

        <section className="stats">
          <Stat icon={<Calculator />} title="PCS Budget Estimate" value="$7,782" label="View your next move" />
          <Stat icon={<PiggyBank />} title="Deployment Savings" value="$6,430" label="Total saved so far" />
          <Stat icon={<Tag />} title="Exclusive Discounts" value="2,149" label="Retailers & offers" />
          <div className="stat">
            <div className="icon orange"><BarChart3 /></div>
            <h4>Monthly Budget</h4>
            <h3>$2,341 <small>/ $3,800</small></h3>
            <div className="progress"><span style={{width:'62%'}}></span></div>
            <p>62% of budget used</p>
          </div>
        </section>

        <section className="grid">
          <div className="calculator-panel">
            <h3>PCS Budget Calculator</h3>
            <p>Plan your next move with confidence.</p>
            <div className="calc-content">
              <div className="form">
                {['Rank: E-5', 'Dependents: 2', 'From: Virginia', 'To: California'].map(x => <div className="input" key={x}>{x}</div>)}
                <button>Calculate Estimate</button>
              </div>
              <div className="estimate">
                <Truck size={56} />
                <p>Estimated Cost</p>
                <h2>$7,782</h2>
                <small>Your out-of-pocket estimation</small>
              </div>
            </div>
          </div>

          <div className="savings-panel">
            <h3>Deployment Savings Tracker</h3>
            <p>Track your savings and watch it grow.</p>
            <div className="saving-row"><span>Goal Amount</span><strong>$15,000</strong></div>
            <div className="progress"><span style={{width:'43%'}}></span></div>
            <div className="saving-row"><span>Saved</span><strong className="green">$6,430</strong></div>
            <div className="saving-row"><span>Time Remaining</span><strong>112 days</strong></div>
            <div className="chart"></div>
            <button>Update Savings</button>
          </div>
        </section>

        <section className="lower">
          <div className="discounts">
            <div className="section-head"><h3>Popular Military Discounts</h3><a>View All</a></div>
            <div className="discount-grid">
              {discounts.map(([name, off]) => (
                <div className="discount" key={name}>
                  <div className="logo">{name[0]}</div>
                  <strong>{name}</strong>
                  <p>{off}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="quick-tools">
            <h3>Quick Tools</h3>
            <p>Essential tools for military life.</p>
            <div className="tool-grid">
              {tools.map(tool => <div className="tool" key={tool}><Shield size={18}/> {tool} <ChevronRight size={18}/></div>)}
            </div>
          </div>
        </section>

        <footer>
          <div>
            <h3>Unlock Premium. Unlock More.</h3>
            <p>Get access to calculators, exclusive discounts, budgeting tools, and an ad-free experience.</p>
          </div>
          <button><Crown size={18}/> Go Premium</button>
        </footer>
      </main>
    </div>
  );
}

function Stat({icon, title, value, label}) {
  return (
    <div className="stat">
      <div className="icon">{icon}</div>
      <h4>{title}</h4>
      <h3>{value}</h3>
      <p>{label} <ChevronRight size={16}/></p>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
