// DashboardPage.jsx
// The home page. It shows money totals, the latest 5 resolutions,
// and the 5 errors you have seen the most.

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../api/dashboardApi.js';
import { formatMoney, formatResolutionNumber, capitalize, getErrorMessage } from '../helpers.js';

export default function DashboardPage() {
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
      <h1>Dashboard</h1>

      {/* Two boxes with the money totals */}
      <div className="stat-row">
        <div className="stat-card">
          <p className="stat-label">Total collected</p>
          <p className="stat-value stat-green">{formatMoney(dashboard.total_collected)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total unpaid</p>
          <p className="stat-value stat-red">{formatMoney(dashboard.total_unpaid)}</p>
        </div>
      </div>

      <div className="two-columns">
        {/* Latest 5 resolutions */}
        <div className="card">
          <h2>Latest resolutions</h2>
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
          <h2>Most repeated errors</h2>
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
    </div>
  );
}
