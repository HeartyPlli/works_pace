// Layout.jsx
// The frame around every page after login: the sidebar on the left,
// the top bar, and the page content (the <Outlet />) in the middle.

import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

export default function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Topbar />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
