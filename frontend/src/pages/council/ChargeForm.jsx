// ChargeForm.jsx
// The form for adding ONE new charge (a fee or a penalty).
// A charge can be linked to the resolution that approved it.
//
// Props:
//   onSaved  - function to call after saving
//   onCancel - function to call when the user clicks Cancel

import { useEffect, useState } from 'react';
import { createCharge, getResolutions } from '../../api/councilApi.js';
import { formatResolutionNumber } from '../../utils/format.js';
import { getErrorMessage } from '../../utils/errors.js';

export default function ChargeForm({ onSaved, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    type: 'fee',
    amount: '',
    school_year: '',
    resolution_id: '',
  });
  // The resolutions for the "Approved by" drop down list.
  const [resolutions, setResolutions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [saving, setSaving] = useState(false);

  // Load the resolutions once, when the form opens.
  useEffect(() => {
    loadResolutions();
  }, []);

  async function loadResolutions() {
    try {
      const data = await getResolutions({});
      setResolutions(data);
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
    try {
      await createCharge(form);
      onSaved();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setSaving(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {errorMessage && <p className="alert alert-error">{errorMessage}</p>}

      <label>
        Name (example: Membership Fee)
        <input type="text" name="name" value={form.name} onChange={handleChange} required />
      </label>

      <div className="form-row">
        <label>
          Type
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="fee">Fee</option>
            <option value="penalty">Penalty</option>
          </select>
        </label>
        <label>
          Amount (PHP)
          <input type="number" name="amount" min="0" step="0.01" value={form.amount} onChange={handleChange} required />
        </label>
      </div>

      <label>
        School year (example: 2026-2027)
        <input type="text" name="school_year" value={form.school_year} onChange={handleChange} required />
      </label>

      <label>
        Approved by resolution (optional)
        <select name="resolution_id" value={form.resolution_id} onChange={handleChange}>
          <option value="">None</option>
          {resolutions.map((resolution) => (
            <option key={resolution.id} value={resolution.id}>
              {formatResolutionNumber(resolution.number, resolution.series_year)}: {resolution.title}
            </option>
          ))}
        </select>
      </label>

      <div className="actions">
        <button type="submit" className="button" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button type="button" className="button button-light" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
