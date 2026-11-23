// UnpaidReportPage.jsx
// A report of every student who still owes money, and the total owed by everyone.

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUnpaidReport } from '../../api/councilApi.js';
import DataTable from '../../components/DataTable.jsx';
import { formatMoney } from '../../utils/format.js';
import { getErrorMessage } from '../../utils/errors.js';

export default function UnpaidReportPage() {
  const [report, setReport] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Load the report once, when the page opens.
  useEffect(() => {
    loadReport();
  }, []);

  async function loadReport() {
    try {
      const data = await getUnpaidReport();
      setReport(data);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  if (errorMessage) {
    return <p className="alert alert-error">{errorMessage}</p>;
  }

  if (!report) {
    return <p className="page-message">Loading...</p>;
  }

  const columns = [
    { label: 'Student No.', render: (row) => row.student_no },
    { label: 'Name', render: (row) => row.name },
    { label: 'Program', render: (row) => row.program + ' ' + row.year_level + ' - ' + row.section },
    { label: 'Total due', render: (row) => formatMoney(row.total_due) },
    { label: 'Total paid', render: (row) => formatMoney(row.total_paid) },
    { label: 'Balance', render: (row) => <strong className="text-red">{formatMoney(row.balance)}</strong> },
    {
      label: 'Actions',
      render: (row) => (
        <Link to={'/students/' + row.id + '/ledger'} className="button button-small button-light">
          Ledger
        </Link>
      ),
    },
  ];

  return (
    <div>
      <h1>Unpaid Report</h1>

      <div className="stat-row">
        <div className="stat-card">
          <p className="stat-label">Students who still owe</p>
          <p className="stat-value">{report.students.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total owed</p>
          <p className="stat-value stat-red">{formatMoney(report.total_owed)}</p>
        </div>
      </div>

      <DataTable columns={columns} rows={report.students} emptyMessage="Everyone has paid. Nice!" />
    </div>
  );
}
