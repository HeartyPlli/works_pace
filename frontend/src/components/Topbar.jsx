// Topbar.jsx
// The bar at the top of the screen. It shows who is logged in and has a Logout button.

import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Log out, then go to the login page.
  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <header className="topbar">
      <span className="topbar-user">
        {user.name} <span className={'badge badge-' + user.role}>{user.role}</span>
      </span>
      <button type="button" className="button button-light" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
}
