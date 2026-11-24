import { useEffect, useState } from 'react';
import { approveAccount, getPendingAccounts } from '../api/authApi.js';
import { useAuth } from '../components/AuthContext.jsx';
import { getErrorMessage } from '../helpers.js';

export default function AccountPage() {
  const { user, updateJournalPreference } = useAuth();
  const [showJournal, setShowJournal] = useState(user.show_journal !== false);
  const [pending, setPending] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const canManageAccounts = user.can_manage_accounts;

  useEffect(() => {
    if (!canManageAccounts) return;
    getPendingAccounts().then(setPending).catch(requestError => setError(getErrorMessage(requestError)));
  }, [canManageAccounts]);

  async function run(action, message) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await action();
      setNotice(message);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  function savePreferences(event) {
    event.preventDefault();
    run(() => updateJournalPreference(showJournal), 'Dashboard preference saved.');
  }

  function approve(id) {
    run(async () => {
      await approveAccount(id);
      setPending(previous => previous.filter(account => account.id !== id));
    }, 'Account approved. This member can now sign in.');
  }

  return (
    <div>
      <div className="page-header">
        <div><h1>Account</h1><p className="page-subtitle">{user.email}</p></div>
      </div>
      {error && <p role="alert" className="alert alert-error">{error}</p>}
      {notice && <p role="status" className="alert alert-success">{notice}</p>}
      <form className="form card" onSubmit={savePreferences}>
        <h2>Dashboard preferences</h2>
        <label className="checkbox-item">
          <input type="checkbox" checked={showJournal} onChange={event => setShowJournal(event.target.checked)} />
          Show Error Fix Journal on my dashboard
        </label>
        <div className="actions"><button className="button" disabled={busy}>Save preference</button></div>
      </form>
      {canManageAccounts && <section className="card">
        <h2>Account requests</h2>
        <p className="muted">Approve only people you know. Approved members can edit shared council records.</p>
        {pending?.length === 0 && <p>No pending requests.</p>}
        {pending?.length > 0 && <ul className="simple-list">
          {pending.map(account => <li key={account.id} className="actions">
            <span>{account.email}</span>
            <button type="button" className="button button-small" disabled={busy} onClick={() => approve(account.id)}>
              Approve {account.email}
            </button>
          </li>)}
        </ul>}
      </section>}
    </div>
  );
}
