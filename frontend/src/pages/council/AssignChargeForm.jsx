// AssignChargeForm.jsx
// The form for giving ONE charge to one or many students at once.
// Tick the students, check the amount and date, then click Assign.
//
// Props:
//   charge     - the charge to assign
//   onAssigned - function to call after assigning (it gets the message from Laravel)
//   onCancel   - function to call when the user clicks Cancel

import { useEffect, useState } from 'react';
import { getStudents, assignCharge } from '../../api/councilApi.js';
import { todayDate } from '../../utils/format.js';
import { getErrorMessage } from '../../utils/errors.js';

export default function AssignChargeForm({ charge, onAssigned, onCancel }) {
  const [students, setStudents] = useState([]);
  // The ids of the ticked students, like [1, 4, 7]
  const [selectedIds, setSelectedIds] = useState([]);
  // Text to narrow down the student list
  const [filterText, setFilterText] = useState('');
  const [amountDue, setAmountDue] = useState(charge.amount);
  const [dateIncurred, setDateIncurred] = useState(todayDate());
  const [remarks, setRemarks] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [saving, setSaving] = useState(false);

  // Load all students once, when the form opens.
  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    try {
      const data = await getStudents('');
      setStudents(data);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  // Only show students whose name or student number has the filter text.
  const shownStudents = students.filter((student) => {
    const text = (student.name + ' ' + student.student_no).toLowerCase();
    return text.includes(filterText.toLowerCase());
  });

  // Tick or untick one student.
  function toggleStudent(id) {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  }

  // Tick every student that is shown right now.
  function selectAllShown() {
    const newIds = [...selectedIds];
    shownStudents.forEach((student) => {
      if (!newIds.includes(student.id)) {
        newIds.push(student.id);
      }
    });
    setSelectedIds(newIds);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    if (selectedIds.length === 0) {
      setErrorMessage('Please tick at least one student.');
      return;
    }
    setSaving(true);
    try {
      const data = await assignCharge({
        charge_id: charge.id,
        student_ids: selectedIds,
        amount_due: amountDue,
        date_incurred: dateIncurred,
        remarks: remarks,
      });
      onAssigned(data.message);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setSaving(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {errorMessage && <p className="alert alert-error">{errorMessage}</p>}

      <div className="form-row">
        <label>
          Amount due (PHP)
          <input
            type="number"
            min="0"
            step="0.01"
            value={amountDue}
            onChange={(event) => setAmountDue(event.target.value)}
            required
          />
        </label>
        <label>
          Date
          <input type="date" value={dateIncurred} onChange={(event) => setDateIncurred(event.target.value)} required />
        </label>
      </div>

      <label>
        Remarks (optional, example: Absent on June 5 assembly)
        <input type="text" value={remarks} onChange={(event) => setRemarks(event.target.value)} />
      </label>

      <p>
        <strong>Students ({selectedIds.length} ticked)</strong>
      </p>
      <div className="actions">
        <input
          type="text"
          placeholder="Type to filter students..."
          value={filterText}
          onChange={(event) => setFilterText(event.target.value)}
        />
        <button type="button" className="button button-small button-light" onClick={selectAllShown}>
          Tick all shown
        </button>
        <button type="button" className="button button-small button-light" onClick={() => setSelectedIds([])}>
          Untick all
        </button>
      </div>

      {/* The list of students with a checkbox for each */}
      <div className="checkbox-list">
        {shownStudents.map((student) => (
          <label key={student.id} className="checkbox-item">
            <input
              type="checkbox"
              checked={selectedIds.includes(student.id)}
              onChange={() => toggleStudent(student.id)}
            />
            {student.name} ({student.student_no})
          </label>
        ))}
        {shownStudents.length === 0 && <p className="empty-message">No students found.</p>}
      </div>

      <div className="actions">
        <button type="submit" className="button" disabled={saving}>
          {saving ? 'Assigning...' : 'Assign'}
        </button>
        <button type="button" className="button button-light" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
