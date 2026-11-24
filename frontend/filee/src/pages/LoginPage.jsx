// LoginPage.jsx
// The login form. It sends the email and password to Laravel.
// If they are correct, Laravel gives us a token and we go to the dashboard.

import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext.jsx';
import { getErrorMessage } from '../helpers.js';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [saving, setSaving] = useState(false);

  // Already logged in? Then there is no need to see this page.
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Runs when the user clicks the Login button.
  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setSaving(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setSaving(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={handleSubmit}>
        <h1>Workspace</h1>
        <p className="muted">Please log in to continue.</p>

        {errorMessage && <p className="alert alert-error">{errorMessage}</p>}

        <label>
          Email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <button type="submit" className="button button-full" disabled={saving}>
          {saving ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
