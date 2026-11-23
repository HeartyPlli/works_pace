// ResolutionsPage.jsx
// The list of resolutions, with search and filters for year and status.
// Officers also see Add, Edit, and Delete buttons.

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';
import { getResolutions, deleteResolution } from '../../api/councilApi.js';
import SearchBar from '../../components/SearchBar.jsx';
import DataTable from '../../components/DataTable.jsx';
import { formatResolutionNumber, formatDate, capitalize } from '../../utils/format.js';
import { getErrorMessage } from '../../utils/errors.js';

// The years for the year filter: this year and the 5 years before it.
const thisYear = new Date().getFullYear();
const yearOptions = [thisYear, thisYear - 1, thisYear - 2, thisYear - 3, thisYear - 4, thisYear - 5];

export default function ResolutionsPage() {
  const { isOfficer } = useAuth();

  const [resolutions, setResolutions] = useState([]);
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Load the list when the page opens, and again when the year or status filter changes.
  useEffect(() => {
    loadResolutions();
  }, [year, status]);

  async function loadResolutions() {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await getResolutions({ search: search, year: year, status: status });
      setResolutions(data);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
    setLoading(false);
  }

  // Ask first, then delete, then load the list again.
  async function handleDelete(resolution) {
    const label = formatResolutionNumber(resolution.number, resolution.series_year);
    if (!window.confirm('Delete ' + label + '?')) {
      return;
    }
    try {
      await deleteResolution(resolution.id);
      loadResolutions();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  // The columns of the table. Each "render" function decides what one cell shows.
  const columns = [
    {
      label: 'Number',
      render: (row) => formatResolutionNumber(row.number, row.series_year),
    },
    { label: 'Title', render: (row) => row.title },
    { label: 'Date adopted', render: (row) => formatDate(row.date_adopted) },
    {
      label: 'Status',
      render: (row) => <span className={'badge badge-' + row.status}>{capitalize(row.status)}</span>,
    },
    {
      label: 'Actions',
      render: (row) => (
        <div className="actions">
          <Link to={'/resolutions/' + row.id + '/print'} className="button button-small button-light">
            Print
          </Link>
          {isOfficer && (
            <Link to={'/resolutions/' + row.id + '/edit'} className="button button-small">
              Edit
            </Link>
          )}
          {isOfficer && (
            <button type="button" className="button button-small button-danger" onClick={() => handleDelete(row)}>
              Delete
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Resolutions</h1>
        {isOfficer && (
          <Link to="/resolutions/new" className="button">
            Add resolution
          </Link>
        )}
      </div>

      {/* Search box and the two filters */}
      <div className="toolbar">
        <SearchBar
          value={search}
          onChange={setSearch}
          onSearch={loadResolutions}
          placeholder="Search title or text..."
        />
        <select value={year} onChange={(event) => setYear(event.target.value)}>
          <option value="">All years</option>
          {yearOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="adopted">Adopted</option>
          <option value="filed">Filed</option>
        </select>
      </div>

      {errorMessage && <p className="alert alert-error">{errorMessage}</p>}

      {loading ? (
        <p className="page-message">Loading...</p>
      ) : (
        <DataTable columns={columns} rows={resolutions} emptyMessage="No resolutions found." />
      )}
    </div>
  );
}
