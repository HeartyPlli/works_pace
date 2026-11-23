// PaymentForm.jsx
// The form for recording ONE payment for a student's charge.
// A student can pay in parts, so the amount can be smaller than the balance.
//
// Props:
//   studentCharge - the charge being paid (it has id and balance)
//   onSaved       - function to call after saving
//   onCancel      - function to call when the user clicks Cancel

import { useState } from 'react';
import { createPayment } from '../../api/councilApi.js';
import { formatMoney, todayDate } from '../../utils/format.js';
import { getErrorMessage } from '../../utils/errors.js';

export default function PaymentForm({ studentCharge, onSaved, onCancel }) {
  // Start with the full balance and today's date. The user can change them.
  const [form, setForm] = useState({
    amount: studentCharge.balance,
    paid_at: todayDate(),
    receipt_no: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setSaving(true);
    try {
      await createPayment({
        student_charge_id: studentCharge.id,
        amount: form.amount,
        paid_at: form.paid_at,
        receipt_no: form.receipt_no,
      });
      onSaved();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setSaving(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <p className="muted">Balance right now: {formatMoney(studentCharge.balance)}</p>

      {errorMessage && <p className="alert alert-error">{errorMessage}</p>}

      <label>
        Amount paid
        <input type="number" name="amount" min="0.01" step="0.01" value={form.amount} onChange={handleChange} required />
      </label>
      <label>
        Date paid
        <input type="date" name="paid_at" value={form.paid_at} onChange={handleChange} required />
      </label>
      <label>
        Receipt No.
        <input type="text" name="receipt_no" value={form.receipt_no} onChange={handleChange} required />
      </label>

      <div className="actions">
        <button type="submit" className="button" disabled={saving}>
          {saving ? 'Saving...' : 'Save payment'}
        </button>
        <button type="button" className="button button-light" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
