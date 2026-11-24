// HomePage.jsx
// The public homepage (address /). Anyone can see it, without logging in.
// It has a header, a big welcome text ("hero"), the two features, three "how it works" steps, and a footer.
// The main button goes to the login page, or to the dashboard if you are already logged in.

import { Link } from 'react-router-dom';
import Brand from '../components/Brand.jsx';
import Icon from '../components/Icon.jsx';
import { ThemeToggle } from '../components/ThemeContext.jsx';
import { useAuth } from '../components/AuthContext.jsx';

export default function HomePage() {
  const { user } = useAuth();

  // Where the main buttons go: the dashboard when logged in, otherwise the login page.
  const destination = user ? '/dashboard' : '/login';

  return (
    <div className="home-page">
      {/* A hidden link for keyboard users: jump straight to the main content */}
      <a href="#home-content" className="skip-link">Skip to content</a>

      {/* ---------- Header: logo, page links, light or dark switch, login button ---------- */}
      <header className="home-header home-container">
        <Brand />
        <nav aria-label="Main navigation" className="home-nav">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <ThemeToggle />
          <Link className="button" to={destination}>{user ? 'Open dashboard' : 'Log in'}</Link>
        </nav>
      </header>

      <main id="home-content" className="home-container">
        {/* ---------- Hero: the big welcome text and the main buttons ---------- */}
        <section className="home-hero">
          <p className="eyebrow">YOUR COUNCIL. ORGANIZED.</p>
          <h1>
            Less paperwork.
            <br />
            <span>More progress.</span>
          </h1>
          <p className="hero-description">Manage council records, track collections, and keep useful fixes in one place. A little less admin. A little more room to focus.</p>
          <div className="hero-actions">
            <Link className="button button-large" to={destination}>{user ? 'Open your dashboard' : 'Log in to Workspace'}</Link>
            <a className="button button-light button-large" href="#features">Explore features</a>
          </div>
          <p className="hero-note">One workspace for your records, collections, and ideas.</p>
        </section>

        {/* ---------- Features: one card for each module ---------- */}
        <section id="features" className="home-features" aria-labelledby="features-title">
          <p className="eyebrow" id="features-title">ONE WORKSPACE, TWO ESSENTIALS</p>
          <div className="feature-grid">
            <article className="feature-card">
              <span className="feature-icon">
                <Icon name="document" size={28} />
              </span>
              <h2>Council records &amp; collections</h2>
              <p>Resolutions, students, charges, and payments — easy to keep in order.</p>
              <ul>
                <li>
                  <Icon name="check" size={17} />
                  Keep council resolutions organized
                </li>
                <li>
                  <Icon name="check" size={17} />
                  Track payments and outstanding balances
                </li>
                <li>
                  <Icon name="check" size={17} />
                  Find every student's ledger in one place
                </li>
              </ul>
            </article>

            <article className="feature-card">
              <span className="feature-icon">
                <Icon name="code" size={28} />
              </span>
              <h2>Error Fix Journal</h2>
              <p>Save the error, document the fix, and find it when you need it.</p>
              <ul>
                <li>
                  <Icon name="check" size={17} />
                  Save fixes with code and source links
                </li>
                <li>
                  <Icon name="check" size={17} />
                  Organize entries with tags and favorites
                </li>
                <li>
                  <Icon name="check" size={17} />
                  Keep track of errors you've seen before
                </li>
              </ul>
            </article>
          </div>
        </section>

        {/* ---------- How it works: three steps ---------- */}
        <section id="how-it-works" className="home-steps" aria-label="How it works">
          <div>
            <Icon name="users" />
            <h3>Log in</h3>
            <p>Enter your workspace with your account.</p>
          </div>
          <div>
            <Icon name="layers" />
            <h3>Choose your module</h3>
            <p>Council records or your personal journal.</p>
          </div>
          <div>
            <Icon name="check" />
            <h3>Keep everything organized</h3>
            <p>Less searching. More getting things done.</p>
          </div>
        </section>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="home-footer home-container">
        <Brand />
        <p>Built for a more organized day.</p>
        <Link to={destination}>{user ? 'Dashboard' : 'Log in'}</Link>
      </footer>
    </div>
  );
}
