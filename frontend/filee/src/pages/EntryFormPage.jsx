// EntryFormPage.jsx
// One form for BOTH adding and editing a journal entry.
// If the address has an id (like /journal/3/edit) we are editing.
// Tags are typed in one box, separated by commas (example: Laravel, CORS).

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getEntry, createEntry, updateEntry } from '../api/journalApi.js';
import { getErrorMessage } from '../helpers.js';

const emptyForm = {
  title: '',
  error_message: '',
  cause: '',
  fix: '',
  code_snippet: '',
  source_url: '',
  tags_text: '',
};

export default function EntryFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [errorMessage, setErrorMessage] = useState('');
  const [saving, setSaving] = useState(false);

  // When editing: load the entry once and put its values in the form.
  useEffect(() => {
    if (isEditing) {
      loadEntry();
    }
  }, [id]);

  async function loadEntry() {
    try {
      const entry = await getEntry(id);
      // Turn the list of tags into text like "Laravel, CORS".
      const tagNames = entry.tags.map((tag) => tag.name);
      setForm({
        title: entry.title,
        error_message: entry.error_message,
        cause: entry.cause || '',
        fix: entry.fix,
        code_snippet: entry.code_snippet || '',
        source_url: entry.source_url || '',
        tags_text: tagNames.join(', '),
      });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setSaving(true);

    // Turn "Laravel, CORS" into ["Laravel", "CORS"] and skip empty parts.
    const tags = form.tags_text
      .split(',')
      .map((tagName) => tagName.trim())
      .filter((tagName) => tagName !== '');

    const entry = {
      title: form.title,
      error_message: form.error_message,
      cause: form.cause,
      fix: form.fix,
      code_snippet: form.code_snippet,
      source_url: form.source_url,
      tags: tags,
    };

    try {
      if (isEditing) {
        await updateEntry(id, entry);
        navigate('/journal/' + id);
      } else {
        const data = await createEntry(entry);
        navigate('/journal/' + data.entry.id);
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setSaving(false);
    }
  }

  return (
    <div>
      <h1>{isEditing ? 'Edit journal entry' : 'Add journal entry'}</h1>

      {errorMessage && <p className="alert alert-error">{errorMessage}</p>}

      <form className="form card" onSubmit={handleSubmit}>
        <label>
          Title (a short name for the problem)
          <input type="text" name="title" value={form.title} onChange={handleChange} required />
        </label>

        <label>
          Error message (copy and paste it)
          <textarea name="error_message" rows="3" value={form.error_message} onChange={handleChange} required />
        </label>

        <label>
          Cause (why it happened)
          <textarea name="cause" rows="3" value={form.cause} onChange={handleChange} />
        </label>

        <label>
          Fix (what you did to solve it)
          <textarea name="fix" rows="4" value={form.fix} onChange={handleChange} required />
        </label>

        <label>
          Code snippet (optional)
          <textarea
            name="code_snippet"
            rows="6"
            className="monospace"
            value={form.code_snippet}
            onChange={handleChange}
          />
        </label>

        <label>
          Source link (optional, must start with http:// or https://)
          <input type="url" name="source_url" value={form.source_url} onChange={handleChange} />
        </label>

        <label>
          Tags (separate with commas, example: Laravel, React, CORS)
          <input type="text" name="tags_text" value={form.tags_text} onChange={handleChange} />
        </label>

        <div className="actions">
          <button type="submit" className="button" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
          <Link to={isEditing ? '/journal/' + id : '/journal'} className="button button-light">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
