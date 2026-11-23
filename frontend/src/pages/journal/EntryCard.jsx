// EntryCard.jsx
// A small box that shows ONE journal entry in the list.
//
// Props:
//   entry      - the journal entry to show
//   onTagClick - function to call with the tag name when a tag is clicked

import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/format.js';

export default function EntryCard({ entry, onTagClick }) {
  return (
    <div className="card entry-card">
      <div className="entry-card-top">
        <Link to={'/journal/' + entry.id} className="entry-title">
          {entry.is_favorite && <span className="star">&#9733; </span>}
          {entry.title}
        </Link>
        <span className="muted">
          Seen {entry.seen_count} times | Last seen {formatDate(entry.last_seen_at)}
        </span>
      </div>

      <p className="entry-error">{entry.error_message}</p>

      <div className="tag-list">
        {entry.tags.map((tag) => (
          <button key={tag.id} type="button" className="tag" onClick={() => onTagClick(tag.name)}>
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
}
