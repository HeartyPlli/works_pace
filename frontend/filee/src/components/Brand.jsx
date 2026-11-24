// Brand.jsx
// The logo and the app name ("Workspace", with "Council & Journal" under it).
// Clicking it goes to the homepage. It is used in the sidebar, and at the top and bottom of the homepage.

import { Link } from 'react-router-dom';

export default function Brand() {
  return (
    <Link to="/" className="brand" aria-label="Workspace homepage">
      <img src="/workspace-logo.png" alt="" width="52" height="44" />
      <span>
        Workspace
        <small>Council &amp; Journal</small>
      </span>
    </Link>
  );
}
