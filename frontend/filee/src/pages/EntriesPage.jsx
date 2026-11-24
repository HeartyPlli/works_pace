// EntriesPage.jsx
// The list of Error Fix Journal entries.
// You can search by text, filter by tag, and show only favorites.

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext.jsx';
import { getEntries, getTags } from '../api/journalApi.js';
import SearchBar from '../components/SearchBar.jsx';
import EntryCard from './EntryCard.jsx';
import { getErrorMessage } from '../helpers.js';

export default function EntriesPage() {
  const { isOfficer } = useAuth();

  const [entries, setEntries] = useState([]);
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Load the tags once, for the tag drop down list.
  useEffect(() => {
    loadTags();
  }, []);

  // Load the entries when the page opens, and again when the tag or favorite filter changes.
  useEffect(() => {
    loadEntries();
  }, [tag, favoritesOnly]);

  async function loadTags() {
    try {
      const data = await getTags();
      setTags(data);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  async function loadEntries() {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await getEntries({
        search: search,
        tag: tag,
        favorite: favoritesOnly ? 1 : '',
      });
      setEntries(data);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="page-header">
        <h1>Error Fix Journal</h1>
        {isOfficer && (
          <Link to="/journal/new" className="button">
            Add entry
          </Link>
        )}
      </div>

      {/* Search box and filters */}
      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} onSearch={loadEntries} placeholder="Search title or error message..." />
        <select value={tag} onChange={(event) => setTag(event.target.value)}>
          <option value="">All tags</option>
          {tags.map((oneTag) => (
            <option key={oneTag.id} value={oneTag.name}>
              {oneTag.name} ({oneTag.error_entries_count})
            </option>
          ))}
        </select>
        <label className="checkbox-item">
          <input type="checkbox" checked={favoritesOnly} onChange={(event) => setFavoritesOnly(event.target.checked)} />
          Favorites only
        </label>
      </div>

      {errorMessage && <p className="alert alert-error">{errorMessage}</p>}

      {loading && <p className="page-message">Loading...</p>}

      {!loading && entries.length === 0 && <p className="empty-message">No entries found.</p>}

      {/* One card for each entry. Clicking a tag on a card filters by that tag. */}
      {!loading &&
        entries.map((entry) => <EntryCard key={entry.id} entry={entry} onTagClick={setTag} />)}
    </div>
  );
}
