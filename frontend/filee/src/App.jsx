// App.jsx
// The list of all pages (routes) in the app.
// Each <Route> connects an address to a page component.

import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import HomePage from './pages/HomePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ResolutionsPage from './pages/ResolutionsPage.jsx';
import ResolutionFormPage from './pages/ResolutionFormPage.jsx';
import ResolutionPrintPage from './pages/ResolutionPrintPage.jsx';
import CollectionsPage from './pages/CollectionsPage.jsx';
import DocumentsPage from './pages/DocumentsPage.jsx';
import EntriesPage from './pages/EntriesPage.jsx';
import EntryFormPage from './pages/EntryFormPage.jsx';
import EntryDetailPage from './pages/EntryDetailPage.jsx';

export default function App() {
  return (
    <Routes>
      {/* Anyone can see the homepage and the login page. */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Every page inside here needs a login. */}
      <Route element={<ProtectedRoute />}>
        {/* The print page has no sidebar, so it prints cleanly. */}
        <Route path="/resolutions/:id/print" element={<ResolutionPrintPage />} />

        {/* These pages show inside the layout (sidebar and top bar). */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/account" element={<AccountPage />} />

          <Route path="/resolutions" element={<ResolutionsPage />} />
          <Route path="/resolutions/new" element={<ResolutionFormPage />} />
          <Route path="/resolutions/:id/edit" element={<ResolutionFormPage />} />

          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/collections/:id?" element={<CollectionsPage />} />
          <Route path="/students/*" element={<Navigate to="/collections" replace />} />
          <Route path="/charges" element={<Navigate to="/collections" replace />} />
          <Route path="/reports/unpaid" element={<Navigate to="/collections" replace />} />

          <Route path="/journal" element={<EntriesPage />} />
          <Route path="/journal/new" element={<EntryFormPage />} />
          <Route path="/journal/:id" element={<EntryDetailPage />} />
          <Route path="/journal/:id/edit" element={<EntryFormPage />} />
        </Route>
      </Route>

      {/* Any unknown address goes back to the homepage. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
