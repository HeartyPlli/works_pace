// Sidebar.jsx
// The menu on the left side of the screen.
// NavLink is like a normal link, but it gets the "active" class on the current page.

import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">Workspace</div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className="sidebar-link">
          Dashboard
        </NavLink>

        <p className="sidebar-heading">Council</p>
        <NavLink to="/resolutions" className="sidebar-link">
          Resolutions
        </NavLink>
        <NavLink to="/students" className="sidebar-link">
          Students
        </NavLink>
        <NavLink to="/charges" className="sidebar-link">
          Charges
        </NavLink>
        <NavLink to="/reports/unpaid" className="sidebar-link">
          Unpaid Report
        </NavLink>

        <p className="sidebar-heading">Journal</p>
        <NavLink to="/journal" className="sidebar-link">
          Error Fix Journal
        </NavLink>
      </nav>
    </aside>
  );
}
