// EntryDetailPage.jsx
// Shows ONE journal entry in full: the error, the cause, the fix, and the code.
// Officers can press "Seen again", star it as a favorite, edit it, or delete it.

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';
import { getEntry, deleteEntry, markEntrySeen, toggleEntryFavorite } from '../../api/journalApi.js';
import CodeBox from '../../components/CodeBox.jsx';
import { formatDate } from '../../utils/format.js';
import { getErrorMessage } from '../../utils/errors.js';

export default function EntryDetailPage() {
  const { id } = useParams();
  const { isOfficer } = useAuth();
  const navigate = useNavigate();

  const [entry, setEntry] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Load the entry when the page opens.
  useEffect(() => {
    loadEntry();
  }, [id]);

  async function loadEntry() {
    try {
      const data = await getEntry(id);
      setEntry(data);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  // "Seen again": Laravel adds 1 to seen_count and sends back the updated entry.
  async function handleSeenAgain() {
    try {
      const data = await markEntrySeen(id);
      setEntry(data.entry);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  // Turn the favorite star on or off.
  async function handleFavorite() {
    try {
      const data = await toggleEntryFavorite(id);
      setEntry(data.entry);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this journal entry?')) {
      return;
    }
    try {
      await deleteEntry(id);
      navigate('/journal');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  if (errorMessage && !entry) {
    return <p className="alert alert-error">{errorMessage}</p>;
  }

  if (!entry) {
    return <p className="page-message">Loading...</p>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>
          {entry.is_favorite && <span className="star">&#9733; </span>}
          {entry.title}
        </h1>
        <Link to="/journal" className="button button-light">
          Back to journal
        </Link>
      </div>

      <p className="muted">
        Seen {entry.seen_count} times | Last seen {formatDate(entry.last_seen_at)}
      </p>

      <div className="tag-list">
        {entry.tags.map((tag) => (
          <span key={tag.id} className="tag">
            {tag.name}
          </span>
        ))}
      </div>

      {errorMessage && <p className="alert alert-error">{errorMessage}</p>}

      {isOfficer && (
        <div className="actions entry-actions">
          <button type="button" className="button" onClick={handleSeenAgain}>
            Seen again (+1)
          </button>
          <button type="button" className="button button-light" onClick={handleFavorite}>
            {entry.is_favorite ? 'Remove favorite' : 'Add to favorites'}
          </button>
          <Link to={'/journal/' + entry.id + '/edit'} className="button button-light">
            Edit
          </Link>
          <button type="button" className="button button-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}

      <div className="card">
        <h2>Error message</h2>
        <CodeBox code={entry.error_message} />

        <h2>Cause</h2>
        <p className="pre-wrap">{entry.cause || '-'}</p>

        <h2>Fix</h2>
        <p className="pre-wrap">{entry.fix}</p>

        {entry.code_snippet && (
          <div>
            <h2>Code snippet</h2>
            <CodeBox code={entry.code_snippet} />
          </div>
        )}

        {entry.source_url && (
          <div>
            <h2>Source</h2>
            <a href={entry.source_url} target="_blank" rel="noreferrer">
              {entry.source_url}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
