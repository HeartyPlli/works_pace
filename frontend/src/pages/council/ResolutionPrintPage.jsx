// ResolutionPrintPage.jsx
// A clean page for printing ONE resolution.
// The Print button calls window.print(), which opens the browser's print window.
// Buttons with the class "no-print" are hidden on paper (see index.css).

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getResolution } from '../../api/councilApi.js';
import { formatResolutionNumber, formatLongDate, capitalize } from '../../utils/format.js';
import { getErrorMessage } from '../../utils/errors.js';

export default function ResolutionPrintPage() {
  const { id } = useParams();
  const [resolution, setResolution] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Load the resolution when the page opens.
  useEffect(() => {
    loadResolution();
  }, [id]);

  async function loadResolution() {
    try {
      const data = await getResolution(id);
      setResolution(data);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  if (errorMessage) {
    return <p className="alert alert-error">{errorMessage}</p>;
  }

  if (!resolution) {
    return <p className="page-message">Loading...</p>;
  }

  return (
    <div className="print-page">
      {/* These buttons show on the screen only, not on paper. */}
      <div className="print-actions no-print">
        <button type="button" className="button" onClick={() => window.print()}>
          Print
        </button>
        <Link to="/resolutions" className="button button-light">
          Back to resolutions
        </Link>
      </div>

      {/* The paper itself */}
      <div className="print-document">
        <p className="print-organization">STUDENT COUNCIL</p>
        <h1 className="print-number">{formatResolutionNumber(resolution.number, resolution.series_year)}</h1>
        <h2 className="print-title">{resolution.title}</h2>

        <div className="print-text">{resolution.whereas_text}</div>
        <div className="print-text">{resolution.resolved_text}</div>

        <p className="print-meta">
          Status: {capitalize(resolution.status)}
          <br />
          Date adopted: {formatLongDate(resolution.date_adopted)}
        </p>

        {/* Lines for signatures */}
        <div className="print-signatures">
          <div className="print-signature">
            <div className="print-signature-line"></div>
            <p>Council Secretary</p>
          </div>
          <div className="print-signature">
            <div className="print-signature-line"></div>
            <p>Council President</p>
          </div>
        </div>
      </div>
    </div>
  );
}
