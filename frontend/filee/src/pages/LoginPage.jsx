// LoginPage.jsx
// The login form (address /login). It sends the email and password to Laravel.
// If they are correct, Laravel gives us a token and we go to the dashboard (/dashboard).
// The page also has a theme switch and a link back to the homepage.

import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { ThemeToggle } from '../components/ThemeContext.jsx';
import { useAuth } from '../components/AuthContext.jsx';
import { getErrorMessage } from '../helpers.js';
import { requestAccount } from '../api/authApi.js';

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [showJournal, setShowJournal] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);

  // Still checking the saved token (when the app just opened). Wait a moment.
  if (loading) {
    return <p className="page-message">Loading...</p>;
  }

  // Already logged in? Then there is no need to see this page.
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  function toggleMode() {
    setCreatingAccount(!creatingAccount);
    setPassword('');
    setShowPassword(false);
    setErrorMessage('');
    setNotice('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setNotice('');
    setSaving(true);
    try {
      if (creatingAccount) {
        setNotice(await requestAccount(email, password, showJournal));
        setCreatingAccount(false);
        setPassword('');
        setShowPassword(false);
      } else {
        await login(email, password);
        navigate('/dashboard');
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
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
        <h1>Workspace</h1>
        <p className="muted">{creatingAccount ? 'Create an account to request access.' : 'Sign in to your workspace.'}</p>

        {errorMessage && <p role="alert" className="alert alert-error">{errorMessage}</p>}
        {notice && <p role="status" className="alert alert-success">{notice}</p>}

        <label>
          Gmail address
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <div className="login-password">
          <label htmlFor="workspace-password">Password</label>
          <div className="login-password-input">
            <input
              id="workspace-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete={creatingAccount ? 'new-password' : 'current-password'}
              minLength={creatingAccount ? 12 : undefined}
              maxLength={72}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              className="icon-button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-controls="workspace-password"
              onClick={() => setShowPassword(visible => !visible)}
            >
              <Icon name={showPassword ? 'eye-off' : 'eye'} size={18} />
            </button>
          </div>
        </div>

        {creatingAccount && <>
          <p className="muted">Use a password with at least 12 characters.</p>
          <label className="checkbox-item">
            <input type="checkbox" checked={showJournal} onChange={event => setShowJournal(event.target.checked)} />
            Show Error Fix Journal on my dashboard
          </label>
        </>}

        <button type="submit" className="button button-full" disabled={saving}>
          {saving ? 'Please wait…' : creatingAccount ? 'Request account' : 'Sign in'}
        </button>
        <button type="button" className="text-button login-back" disabled={saving} onClick={toggleMode}>
          {creatingAccount ? 'Back to sign in' : 'Create an account'}
        </button>
        <Link className="login-back" to="/">Back to homepage</Link>
      </form>
    </div>
  );
}
