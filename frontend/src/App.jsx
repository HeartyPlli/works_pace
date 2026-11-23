// App.jsx
// The list of all pages (routes) in the app.
// Each <Route> connects an address (like /students) to a page component.

import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ResolutionsPage from './pages/council/ResolutionsPage.jsx';
import ResolutionFormPage from './pages/council/ResolutionFormPage.jsx';
import ResolutionPrintPage from './pages/council/ResolutionPrintPage.jsx';
import StudentsPage from './pages/council/StudentsPage.jsx';
import StudentLedgerPage from './pages/council/StudentLedgerPage.jsx';
import ChargesPage from './pages/council/ChargesPage.jsx';
import UnpaidReportPage from './pages/council/UnpaidReportPage.jsx';
import EntriesPage from './pages/journal/EntriesPage.jsx';
import EntryFormPage from './pages/journal/EntryFormPage.jsx';
import EntryDetailPage from './pages/journal/EntryDetailPage.jsx';

export default function App() {
  return (
    <Routes>
      {/* Anyone can see the login page. */}
      <Route path="/login" element={<LoginPage />} />

      {/* Every page inside here needs a login. */}
      <Route element={<ProtectedRoute />}>
        {/* The print page has no sidebar, so it prints cleanly. */}
        <Route path="/resolutions/:id/print" element={<ResolutionPrintPage />} />

        {/* These pages show inside the layout (sidebar and top bar). */}
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />

          <Route path="/resolutions" element={<ResolutionsPage />} />
          <Route path="/resolutions/new" element={<ResolutionFormPage />} />
          <Route path="/resolutions/:id/edit" element={<ResolutionFormPage />} />

          <Route path="/students" element={<StudentsPage />} />
          <Route path="/students/:id/ledger" element={<StudentLedgerPage />} />

          <Route path="/charges" element={<ChargesPage />} />
          <Route path="/reports/unpaid" element={<UnpaidReportPage />} />

          <Route path="/journal" element={<EntriesPage />} />
          <Route path="/journal/new" element={<EntryFormPage />} />
          <Route path="/journal/:id" element={<EntryDetailPage />} />
          <Route path="/journal/:id/edit" element={<EntryFormPage />} />
        </Route>
      </Route>

      {/* Any unknown address goes back to the dashboard. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
