// Sidebar.jsx
// The menu on the left side of the screen.
// NavLink is like a normal link, but it gets the "active" class on the current page.
// On phones the menu is hidden. The menu button in the top bar opens it ("open" is true).
// Clicking a link, the X button, or the dark area behind the menu closes it ("onClose").

import { Link, NavLink } from 'react-router-dom';
import Brand from './Brand.jsx';
import Icon from './Icon.jsx';

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* The dark see-through area behind the open menu (phones only). Clicking it closes the menu. */}
      {open && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={onClose} />}

      <aside id="app-navigation" className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        {/* The logo, and an X button that closes the menu (phones only) */}
        <div className="sidebar-brand">
          <Brand />
          <button className="icon-button mobile-only" onClick={onClose} aria-label="Close navigation">
            <Icon name="close" />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Workspace navigation">
          <NavLink to="/dashboard" className="sidebar-link" onClick={onClose}>
            <Icon name="home" />
            Dashboard
          </NavLink>

          <p className="sidebar-heading">Council</p>
          <NavLink to="/resolutions" className="sidebar-link" onClick={onClose}>
            <Icon name="document" />
            Resolutions
          </NavLink>
          <NavLink to="/documents" className="sidebar-link" onClick={onClose}>
            <Icon name="layers" />
            Documents
          </NavLink>
          <NavLink to="/collections" className="sidebar-link" onClick={onClose}>
            <Icon name="wallet" />
            Collections
          </NavLink>

          <p className="sidebar-heading">Journal</p>
          <NavLink to="/journal" className="sidebar-link" onClick={onClose}>
            <Icon name="code" />
            Error Fix Journal
          </NavLink>
          <NavLink to="/account" className="sidebar-link" onClick={onClose}>
            <Icon name="users" />
            Account
          </NavLink>
        </nav>

        {/* A link at the bottom of the menu, back to the public homepage */}
        <Link className="sidebar-home" to="/" onClick={onClose}>
          <Icon name="home" size={17} />
          Back to homepage
        </Link>
      </aside>
    </>
  );
}
