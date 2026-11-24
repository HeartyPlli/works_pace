// StudentForm.jsx
// The form for adding or editing ONE student. It is shown inside a Modal.
//
// Props:
//   student  - the student to edit, or null to add a new one
//   onSaved  - function to call after saving
//   onCancel - function to call when the user clicks Cancel

import { useState } from 'react';
import { createStudent, updateStudent } from '../api/councilApi.js';
import { getErrorMessage } from '../helpers.js';

export default function StudentForm({ student, onSaved, onCancel }) {
  // Start with the student's values when editing, or empty values when adding.
  const [form, setForm] = useState({
    student_no: student ? student.student_no : '',
    name: student ? student.name : '',
    program: student ? student.program : '',
    year_level: student ? student.year_level : 1,
    section: student ? student.section : '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [saving, setSaving] = useState(false);

  // One function for every input. It uses the input's "name" to know which value to change.
  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setSaving(true);
    try {
      if (student) {
        await updateStudent(student.id, form);
      } else {
        await createStudent(form);
      }
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
        Student No.
        <input type="text" name="student_no" value={form.student_no} onChange={handleChange} required />
      </label>
      <label>
        Full name
        <input type="text" name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label>
        Program (example: BSIT)
        <input type="text" name="program" value={form.program} onChange={handleChange} required />
      </label>

      <div className="form-row">
        <label>
          Year level
          <select name="year_level" value={form.year_level} onChange={handleChange}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </label>
        <label>
          Section
          <input type="text" name="section" value={form.section} onChange={handleChange} required />
        </label>
      </div>

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
