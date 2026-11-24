// Topbar.jsx
// The bar at the top of every page after login. From left to right it shows:
// the menu button (phones only), the page path ("Workspace / Collections"),
// the light or dark switch, the user's initials and name, and the Log out button.

import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { ThemeToggle } from './ThemeContext.jsx';
import Icon from './Icon.jsx';

// The label for each main page.
const sectionNames = {
  dashboard: 'Dashboard',
  resolutions: 'Resolutions',
  documents: 'Documents',
  collections: 'Collections',
  journal: 'Error Fix Journal',
  account: 'Account',
};

export default function Topbar({ menuOpen, onMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const section = sectionNames[pathname.split('/')[1]] || 'Workspace';

  const displayName = user.name;

  // The first letter of the first two words, for the round avatar (for example "HD").
  const initials = displayName.split(' ').map(word => word[0]).slice(0, 2).join('');

  // Log out, then go to the login page.
  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <header className="topbar">
      <button
        className="icon-button mobile-only"
        onClick={onMenuToggle}
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
        aria-controls="app-navigation"
      >
        <Icon name="menu" />
      </button>

      <div className="breadcrumb">
        <span>Workspace</span>
        <span>/</span>
        <strong>{section}</strong>
      </div>

      <div className="topbar-actions">
        <ThemeToggle />
        <span className="user-avatar">{initials}</span>
        <span className="topbar-user">
          {displayName}
        </span>
        <button type="button" className="icon-button" onClick={handleLogout} aria-label="Log out" title="Log out">
          <Icon name="logout" />
        </button>
      </div>
    </header>
  );
}
