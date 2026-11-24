// StudentLedgerPage.jsx
// The ledger of ONE student: all their charges, all their payments, and the balance.
// Officers can record a payment for a charge that still has a balance.

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../components/AuthContext.jsx';
import { getStudentLedger } from '../api/councilApi.js';
import DataTable from '../components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import PaymentForm from './PaymentForm.jsx';
import { formatMoney, formatDate, capitalize, getErrorMessage } from '../helpers.js';

export default function StudentLedgerPage() {
  const { id } = useParams();
  const { isOfficer } = useAuth();

  const [ledger, setLedger] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  // The charge we are paying for. When it is not null, the payment pop up is open.
  const [payingCharge, setPayingCharge] = useState(null);

  // Load the ledger when the page opens.
  useEffect(() => {
    loadLedger();
  }, [id]);

  async function loadLedger() {
    try {
      const data = await getStudentLedger(id);
      setLedger(data);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  // Called by PaymentForm after a successful save.
  function handlePaymentSaved() {
    setPayingCharge(null);
    loadLedger();
  }

  if (errorMessage) {
    return <p className="alert alert-error">{errorMessage}</p>;
  }

  if (!ledger) {
    return <p className="page-message">Loading...</p>;
  }

  const student = ledger.student;

  // Columns for the charges table.
  const chargeColumns = [
    { label: 'Charge', render: (row) => row.charge_name },
    { label: 'Type', render: (row) => capitalize(row.type) },
    { label: 'Date', render: (row) => formatDate(row.date_incurred) },
    { label: 'Remarks', render: (row) => row.remarks || '-' },
    { label: 'Amount due', render: (row) => formatMoney(row.amount_due) },
    { label: 'Paid', render: (row) => formatMoney(row.total_paid) },
    {
      label: 'Balance',
      render: (row) => <strong className={row.balance > 0 ? 'text-red' : 'text-green'}>{formatMoney(row.balance)}</strong>,
    },
    {
      label: 'Actions',
      render: (row) =>
        isOfficer && row.balance > 0 ? (
          <button type="button" className="button button-small" onClick={() => setPayingCharge(row)}>
            Add payment
          </button>
        ) : (
          ''
        ),
    },
  ];

  // Columns for the payments table.
  const paymentColumns = [
    { label: 'Date paid', render: (row) => formatDate(row.paid_at) },
    { label: 'Charge', render: (row) => row.charge_name },
    { label: 'Receipt No.', render: (row) => row.receipt_no },
    { label: 'Amount', render: (row) => formatMoney(row.amount) },
    { label: 'Received by', render: (row) => row.received_by_name || '-' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Ledger: {student.name}</h1>
        <Link to="/students" className="button button-light">
          Back to students
        </Link>
      </div>

      <p className="muted">
        Student No. {student.student_no} | {student.program} {student.year_level} - {student.section}
      </p>

      {/* The three totals */}
      <div className="stat-row">
        <div className="stat-card">
          <p className="stat-label">Total due</p>
          <p className="stat-value">{formatMoney(ledger.total_due)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total paid</p>
          <p className="stat-value stat-green">{formatMoney(ledger.total_paid)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Balance</p>
          <p className="stat-value stat-red">{formatMoney(ledger.balance)}</p>
        </div>
      </div>

      <h2>Charges</h2>
      <DataTable columns={chargeColumns} rows={ledger.charges} emptyMessage="This student has no charges." />

      <h2>Payments</h2>
      <DataTable columns={paymentColumns} rows={ledger.payments} emptyMessage="No payments yet." />

      {payingCharge && (
        <Modal title={'Add payment for ' + payingCharge.charge_name} onClose={() => setPayingCharge(null)}>
          <PaymentForm
            studentCharge={payingCharge}
            onSaved={handlePaymentSaved}
            onCancel={() => setPayingCharge(null)}
          />
        </Modal>
      )}
    </div>
  );
}
