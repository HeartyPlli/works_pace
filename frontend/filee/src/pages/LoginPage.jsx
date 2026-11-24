// LoginPage.jsx
// The login form (address /login). It sends the email and password to Laravel.
// If they are correct, Laravel gives us a token and we go to the dashboard (/dashboard).
// The page also has the logo, the light or dark switch, and a link back to the homepage.

import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeContext.jsx';
import { useAuth } from '../components/AuthContext.jsx';
import { getErrorMessage } from '../helpers.js';

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [saving, setSaving] = useState(false);

  // Still checking the saved token (when the app just opened). Wait a moment.
  if (loading) {
    return <p className="page-message">Loading...</p>;
  }

  // Already logged in? Then there is no need to see this page.
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Runs when the user clicks the Login button.
  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setSaving(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setSaving(false);
    }
  }

  return (
    <div className="login-page">
      {/* The light or dark switch, in the top right corner */}
      <div className="login-theme">
        <ThemeToggle />
      </div>

      <form className="login-box" onSubmit={handleSubmit}>
        <img className="login-logo" src="/workspace-logo.png" alt="Workspace logo" width="112" height="76" />
        <h1>Heart Document</h1>
        <p className="muted">Please log in to continue.</p>

        {errorMessage && <p className="alert alert-error">{errorMessage}</p>}

        <label>
          Email
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <button type="submit" className="button button-full" disabled={saving}>
          {saving ? 'Logging in...' : 'Login'}
        </button>
        <Link className="login-back" to="/">Back to homepage</Link>
      </form>
    </div>
  );
}
