// StudentsPage.jsx
// The list of students, with a search box.
// Officers can add, edit, and delete students. The form opens in a pop up (Modal).

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext.jsx';
import { getStudents, deleteStudent } from '../api/councilApi.js';
import SearchBar from '../components/SearchBar.jsx';
import DataTable from '../components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import StudentForm from './StudentForm.jsx';
import { getErrorMessage } from '../helpers.js';

export default function StudentsPage() {
  const { isOfficer } = useAuth();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // showForm is true when the pop up form is open.
  const [showForm, setShowForm] = useState(false);
  // editingStudent is the student being edited, or null when adding a new one.
  const [editingStudent, setEditingStudent] = useState(null);

  // Load the students once, when the page opens.
  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await getStudents(search);
      setStudents(data);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
    setLoading(false);
  }

  function openAddForm() {
    setEditingStudent(null);
    setShowForm(true);
  }

  function openEditForm(student) {
    setEditingStudent(student);
    setShowForm(true);
  }

  // Called by StudentForm after a successful save.
  function handleSaved() {
    setShowForm(false);
    loadStudents();
  }

  async function handleDelete(student) {
    const question = 'Delete ' + student.name + '? This also deletes their charges and payments.';
    if (!window.confirm(question)) {
      return;
    }
    try {
      await deleteStudent(student.id);
      loadStudents();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  const columns = [
    { label: 'Student No.', render: (row) => row.student_no },
    { label: 'Name', render: (row) => row.name },
    { label: 'Program', render: (row) => row.program },
    { label: 'Year and section', render: (row) => row.year_level + ' - ' + row.section },
    {
      label: 'Actions',
      render: (row) => (
        <div className="actions">
          <Link to={'/students/' + row.id + '/ledger'} className="button button-small button-light">
            Ledger
          </Link>
          {isOfficer && (
            <button type="button" className="button button-small" onClick={() => openEditForm(row)}>
              Edit
            </button>
          )}
          {isOfficer && (
            <button type="button" className="button button-small button-danger" onClick={() => handleDelete(row)}>
              Delete
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Students</h1>
        {isOfficer && (
          <button type="button" className="button" onClick={openAddForm}>
            Add student
          </button>
        )}
      </div>

      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} onSearch={loadStudents} placeholder="Search name or student no..." />
      </div>

      {errorMessage && <p className="alert alert-error">{errorMessage}</p>}

      {loading ? (
        <p className="page-message">Loading...</p>
      ) : (
        <DataTable columns={columns} rows={students} emptyMessage="No students found." />
      )}

      {showForm && (
        <Modal title={editingStudent ? 'Edit student' : 'Add student'} onClose={() => setShowForm(false)}>
          <StudentForm student={editingStudent} onSaved={handleSaved} onCancel={() => setShowForm(false)} />
        </Modal>
      )}
    </div>
  );
}
