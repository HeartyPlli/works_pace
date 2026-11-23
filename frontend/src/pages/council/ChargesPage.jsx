// ChargesPage.jsx
// The list of charges (fees and penalties).
// Officers can add a charge and assign a charge to one or many students.

import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext.jsx';
import { getCharges } from '../../api/councilApi.js';
import DataTable from '../../components/DataTable.jsx';
import Modal from '../../components/Modal.jsx';
import ChargeForm from './ChargeForm.jsx';
import AssignChargeForm from './AssignChargeForm.jsx';
import { formatMoney, formatResolutionNumber, capitalize } from '../../utils/format.js';
import { getErrorMessage } from '../../utils/errors.js';

export default function ChargesPage() {
  const { isOfficer } = useAuth();

  const [charges, setCharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // true when the "Add charge" pop up is open
  const [showAddForm, setShowAddForm] = useState(false);
  // the charge we are assigning to students (null when that pop up is closed)
  const [assigningCharge, setAssigningCharge] = useState(null);

  // Load the charges once, when the page opens.
  useEffect(() => {
    loadCharges();
  }, []);

  async function loadCharges() {
    setLoading(true);
    try {
      const data = await getCharges();
      setCharges(data);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
    setLoading(false);
  }

  // Called by ChargeForm after saving a new charge.
  function handleChargeSaved() {
    setShowAddForm(false);
    setSuccessMessage('Charge saved.');
    loadCharges();
  }

  // Called by AssignChargeForm after assigning. "message" comes from Laravel.
  function handleAssigned(message) {
    setAssigningCharge(null);
    setSuccessMessage(message);
    loadCharges();
  }

  const columns = [
    { label: 'Name', render: (row) => row.name },
    {
      label: 'Type',
      render: (row) => <span className={'badge badge-' + row.type}>{capitalize(row.type)}</span>,
    },
    { label: 'Amount', render: (row) => formatMoney(row.amount) },
    { label: 'School year', render: (row) => row.school_year },
    {
      label: 'Approved by',
      render: (row) =>
        row.resolution ? formatResolutionNumber(row.resolution.number, row.resolution.series_year) : '-',
    },
    { label: 'Times assigned', render: (row) => row.student_charges_count },
    {
      label: 'Actions',
      render: (row) =>
        isOfficer ? (
          <button type="button" className="button button-small" onClick={() => setAssigningCharge(row)}>
            Assign to students
          </button>
        ) : (
          ''
        ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Charges</h1>
        {isOfficer && (
          <button type="button" className="button" onClick={() => setShowAddForm(true)}>
            Add charge
          </button>
        )}
      </div>

      {successMessage && <p className="alert alert-success">{successMessage}</p>}
      {errorMessage && <p className="alert alert-error">{errorMessage}</p>}

      {loading ? (
        <p className="page-message">Loading...</p>
      ) : (
        <DataTable columns={columns} rows={charges} emptyMessage="No charges yet." />
      )}

      {showAddForm && (
        <Modal title="Add charge" onClose={() => setShowAddForm(false)}>
          <ChargeForm onSaved={handleChargeSaved} onCancel={() => setShowAddForm(false)} />
        </Modal>
      )}

      {assigningCharge && (
        <Modal title={'Assign: ' + assigningCharge.name} onClose={() => setAssigningCharge(null)}>
          <AssignChargeForm
            charge={assigningCharge}
            onAssigned={handleAssigned}
            onCancel={() => setAssigningCharge(null)}
          />
        </Modal>
      )}
    </div>
  );
}
