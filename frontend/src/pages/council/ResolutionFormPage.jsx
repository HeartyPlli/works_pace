// ResolutionFormPage.jsx
// One form for BOTH adding and editing a resolution.
// If the address has an id (like /resolutions/3/edit) we are editing.
// If not (/resolutions/new) we are adding a new one.

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  getResolution,
  getNextResolutionNumber,
  createResolution,
  updateResolution,
} from '../../api/councilApi.js';
import { formatResolutionNumber } from '../../utils/format.js';
import { getErrorMessage } from '../../utils/errors.js';

// The starting values of an empty form.
const emptyForm = {
  series_year: new Date().getFullYear(),
  title: '',
  whereas_text: '',
  resolved_text: '',
  date_adopted: '',
  status: 'draft',
};

export default function ResolutionFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  // The number this resolution has (when editing) or will get (when adding),
  // as text like "Resolution No. 0004, Series of 2026".
  const [numberLabel, setNumberLabel] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [saving, setSaving] = useState(false);

  // When editing: load the resolution once and put its values in the form.
  useEffect(() => {
    if (isEditing) {
      loadResolution();
    }
  }, [id]);

  // When adding: every time the year changes, ask Laravel for the next number.
  useEffect(() => {
    if (!isEditing) {
      loadNextNumber();
    }
  }, [form.series_year]);

  async function loadResolution() {
    try {
      const resolution = await getResolution(id);
      setNumberLabel(formatResolutionNumber(resolution.number, resolution.series_year));
      // Empty values from the database are null. Inputs need '' instead.
      setForm({
        series_year: resolution.series_year,
        title: resolution.title,
        whereas_text: resolution.whereas_text || '',
        resolved_text: resolution.resolved_text || '',
        date_adopted: resolution.date_adopted || '',
        status: resolution.status,
      });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  async function loadNextNumber() {
    // Only ask when the year has 4 digits (for example 2026).
    if (String(form.series_year).length !== 4) {
      setNumberLabel('');
      return;
    }
    try {
      const data = await getNextResolutionNumber(form.series_year);
      setNumberLabel(formatResolutionNumber(data.number, data.series_year));
    } catch (error) {
      setNumberLabel('');
    }
  }

  // One function for every input. It uses the input's "name" to know which value to change.
  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  // Save the form. Then go back to the list.
  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setSaving(true);
    try {
      if (isEditing) {
        await updateResolution(id, form);
      } else {
        await createResolution(form);
      }
      navigate('/resolutions');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setSaving(false);
    }
  }

  return (
    <div>
      <h1>{isEditing ? 'Edit resolution' : 'Add resolution'}</h1>

      {numberLabel && (
        <p className="muted">
          {isEditing ? 'This is ' : 'This will be '}
          <strong>{numberLabel}</strong>
          {isEditing && ' (if you change the year, it gets a new number for that year)'}
        </p>
      )}

      {errorMessage && <p className="alert alert-error">{errorMessage}</p>}

      <form className="form card" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Series year
            <input type="number" name="series_year" value={form.series_year} onChange={handleChange} required />
          </label>
          <label>
            Status
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="draft">Draft</option>
              <option value="adopted">Adopted</option>
              <option value="filed">Filed</option>
            </select>
          </label>
          <label>
            Date adopted
            <input type="date" name="date_adopted" value={form.date_adopted} onChange={handleChange} />
          </label>
        </div>

        <label>
          Title
          <input type="text" name="title" value={form.title} onChange={handleChange} required />
        </label>

        <label>
          Whereas clauses
          <textarea
            name="whereas_text"
            rows="6"
            value={form.whereas_text}
            onChange={handleChange}
            placeholder="WHEREAS, ..."
          />
        </label>

        <label>
          Resolved clauses
          <textarea
            name="resolved_text"
            rows="6"
            value={form.resolved_text}
            onChange={handleChange}
            placeholder="RESOLVED, as it is hereby resolved, ..."
          />
        </label>

        <div className="actions">
          <button type="submit" className="button" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
          <Link to="/resolutions" className="button button-light">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
