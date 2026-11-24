// DashboardPage.jsx
// The dashboard: the first page after login (address /dashboard).
// It shows money totals, the latest 5 resolutions, the 5 errors you have seen the most,
// and quick links. Officers also get two "add" buttons at the top.

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { useAuth } from '../components/AuthContext.jsx';
import { getDashboard } from '../api/dashboardApi.js';
import { formatMoney, formatResolutionNumber, capitalize, getErrorMessage } from '../helpers.js';

export default function DashboardPage() {
  const { isOfficer } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Load the dashboard data once, when the page opens.
  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const data = await getDashboard();
      setDashboard(data);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  if (errorMessage) {
    return <p className="alert alert-error">{errorMessage}</p>;
  }

  if (!dashboard) {
    return <p className="page-message">Loading...</p>;
  }

  return (
    <div>
      {/* The title, and (for officers only) buttons to add a resolution or a journal entry */}
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">A clear view of your council and your work.</p>
        </div>
        {isOfficer && (
          <div className="actions">
            <Link className="button button-light" to="/resolutions/new">
              <Icon name="plus" size={16} />
              Resolution
            </Link>
            <Link className="button button-light" to="/journal/new">
              <Icon name="plus" size={16} />
              Journal entry
            </Link>
          </div>
        )}
      </div>

      {/* Two boxes with the money totals */}
      <div className="stat-row">
        <div className="stat-card dashboard-stat">
          <span className="stat-icon">
            <Icon name="wallet" size={27} />
          </span>
          <div>
            <p className="stat-label">Total collected</p>
            <p className="stat-value stat-green">{formatMoney(dashboard.total_collected)}</p>
            <p className="stat-description">Recorded payments</p>
          </div>
        </div>
        <div className="stat-card dashboard-stat">
          <span className="stat-icon stat-icon-amber">
            <Icon name="report" size={27} />
          </span>
          <div>
            <p className="stat-label">Total unpaid</p>
            <p className="stat-value stat-red">{formatMoney(dashboard.total_unpaid)}</p>
            <p className="stat-description">Outstanding student balances</p>
          </div>
        </div>
      </div>

      <div className="two-columns">
        {/* Latest 5 resolutions */}
        <div className="card">
          <div className="card-heading">
            <h2>Latest resolutions</h2>
            <Link to="/resolutions">View all</Link>
          </div>
          {dashboard.latest_resolutions.length === 0 && <p className="empty-message">No resolutions yet.</p>}
          <ul className="simple-list">
            {dashboard.latest_resolutions.map((resolution) => (
              <li key={resolution.id}>
                <Link to={'/resolutions/' + resolution.id + '/print'}>
                  {formatResolutionNumber(resolution.number, resolution.series_year)}
                </Link>
                <span className={'badge badge-' + resolution.status}>{capitalize(resolution.status)}</span>
                <div className="muted">{resolution.title}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Top 5 most repeated errors */}
        <div className="card">
          <div className="card-heading">
            <h2>Most repeated errors</h2>
            <Link to="/journal">Open journal</Link>
          </div>
          {dashboard.top_errors.length === 0 && <p className="empty-message">No journal entries yet.</p>}
          <ul className="simple-list">
            {dashboard.top_errors.map((entry) => (
              <li key={entry.id}>
                <Link to={'/journal/' + entry.id}>{entry.title}</Link>
                <div className="muted">Seen {entry.seen_count} times</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick links to other pages */}
      <nav className="dashboard-shortcuts" aria-label="Quick links">
        <Link to="/students">
          <Icon name="users" size={17} />
          Student directory
        </Link>
        <Link to="/charges">
          <Icon name="layers" size={17} />
          Manage charges
        </Link>
        <Link to="/reports/unpaid">
          <Icon name="report" size={17} />
          View unpaid report
        </Link>
      </nav>
    </div>
  );
}
