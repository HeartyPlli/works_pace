// Layout.jsx
// The frame around every page after login: the sidebar on the left,
// the top bar, and the page content (the <Outlet />) in the middle.

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

export default function Layout() {
  // true when the menu is open on a phone (on a computer the menu is always shown).
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="layout">
      {/* A hidden link for keyboard users: press Tab once and Enter to jump past the menu. */}
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="main">
        <Topbar menuOpen={menuOpen} onMenuToggle={() => setMenuOpen(!menuOpen)} />
        <main className="content" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
