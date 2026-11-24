// Topbar.jsx
// The bar at the top of every page after login. From left to right it shows:
// the menu button (phones only), the page path ("Workspace / Students"),
// the light or dark switch, the user's initials and name, and the Log out button.

import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { ThemeToggle } from './ThemeContext.jsx';
import Icon from './Icon.jsx';

// The name to show for the first part of the address (for example /students shows "Students").
const sectionNames = {
  dashboard: 'Dashboard',
  resolutions: 'Resolutions',
  students: 'Students',
  charges: 'Charges',
  reports: 'Unpaid report',
  journal: 'Error Fix Journal',
};

export default function Topbar({ menuOpen, onMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // "/students/3/ledger" split by "/" gives ["", "students", "3", "ledger"], so [1] is "students".
  const section = sectionNames[pathname.split('/')[1]] || 'Workspace';

  // The seeded officer account is shown as "Heart Document". Every other user shows their own name.
  const displayName = user.name === 'Council Officer' ? 'Heart Document' : user.name;

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
          <small>{user.role}</small>
        </span>
        <button type="button" className="icon-button" onClick={handleLogout} aria-label="Log out" title="Log out">
          <Icon name="logout" />
        </button>
      </div>
    </header>
  );
}
