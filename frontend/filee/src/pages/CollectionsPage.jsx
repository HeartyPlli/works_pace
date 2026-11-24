import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/client.js';
import { downloadFile, getResolutions } from '../api/councilApi.js';
import Modal from '../components/Modal.jsx';
import DataTable from '../components/DataTable.jsx';
import { formatMoney, formatResolutionNumber, getErrorMessage } from '../helpers.js';

const money = cents => formatMoney(Number(cents) / 100);

function paymentStatus(student) {
  if (Number(student.paid_cents) >= Number(student.due_cents)) return 'Paid';
  return student.paid_cents > 0 ? 'Partial' : 'Unpaid';
}

export default function CollectionsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [resolutions, setResolutions] = useState([]);
  const [collection, setCollection] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setCollection(null);
    setError('');
    setNotice('');
    setSearch('');
    setStatus('');
    setDialog(null);
    setLoading(true);
    Promise.all([api.get('/collections'), getResolutions(), id ? api.get('/collections/' + id) : null])
      .then(([list, options, selected]) => {
        if (!active) return;
        setCollections(list.data);
        setResolutions(options);
        setCollection(selected?.data ?? null);
      })
      .catch(requestError => { if (active) setError(getErrorMessage(requestError)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const endpoint = '/collections/' + id;
  const students = collection?.students ?? [];
  const collected = students.reduce((total, row) => total + Number(row.paid_cents), 0);
  const outstanding = students.reduce((total, row) => total + Math.max(0, row.due_cents - row.paid_cents), 0);
  const filtered = students.filter(row => {
    const matches = (row.student_id + ' ' + row.name).toLowerCase().includes(search.trim().toLowerCase());
    return matches && (!status || paymentStatus(row) === status);
  });
  const resolution = resolutions.find(row => row.id === collection?.resolution_id);
  const columns = [
    { label: 'Student ID', render: row => row.student_id },
    { label: 'Name', render: row => row.name },
    { label: 'Amount due', render: row => money(row.due_cents) },
    { label: 'Amount paid', render: row => money(row.paid_cents) },
    { label: 'Status', render: row => {
      const label = paymentStatus(row);
      const color = { Paid: 'adopted', Partial: 'draft', Unpaid: 'penalty' }[label];
      return <span className={'badge badge-' + color}>{label}</span>;
    } },
    { label: 'OR number', render: row => row.or_number || '—' },
    { label: 'Actions', render: row => <div className="actions">
      <button type="button" className="button button-small button-light" onClick={() => setDialog({ kind: 'student', row })}>Edit name</button>
      <button type="button" className="button button-small" onClick={() => setDialog({ kind: 'payment', row })}>{paymentStatus(row) === 'Paid' ? 'Edit payment' : 'Mark paid'}</button>
      {!Number(row.paid_cents) && <button type="button" className="button button-small button-danger" onClick={() => setDialog({ kind: 'remove', row })}>Remove</button>}
    </div> },
  ];

  async function saveDialog(values) {
    const { kind, row } = dialog;
    setError('');
    setNotice('');
    if (kind === 'collection') {
      const response = await (row ? api.put(endpoint, values) : api.post('/collections', values));
      if (!row) {
        navigate('/collections/' + response.data.id);
        setDialog(null);
        return;
      }
      setCollection(response.data);
      setNotice('Collection updated.');
    } else {
      let response;
      if (kind === 'student') {
        response = await (row ? api.patch(endpoint + '/students', values) : api.post(endpoint + '/students', values));
      } else if (kind === 'payment') {
        response = await api.patch(endpoint + '/payment', values);
      } else if (kind === 'remove') {
        response = await api.delete(endpoint + '/students', { data: { student_id: row.student_id } });
      } else {
        const form = new FormData();
        form.append('csv', values.csv);
        response = await api.post(endpoint + '/import', form);
      }
      setCollection((await api.get(endpoint)).data);
      setNotice(response.data?.message || 'Student removed.');
    }
    setDialog(null);
  }

  async function exportCsv() {
    setError('');
    try {
      await downloadFile(endpoint + '/export', 'collection-' + id + '.csv');
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          {id && <Link to="/collections">All collections</Link>}
          <h1>{collection?.name || 'Collections'}</h1>
          <p className="page-subtitle">{collection ? collection.school_year + ' · ' + money(collection.amount_cents) + ' per student' : 'Set a fee, manage the student roster, and track receipts by school year.'}</p>
          {resolution && <p className="page-subtitle"><Link to={'/resolutions/' + resolution.id + '/print'}>{formatResolutionNumber(resolution.number, resolution.series_year)}</Link></p>}
        </div>
        {collection ? <button type="button" className="button button-light" onClick={() => setDialog({ kind: 'collection', row: collection })}>Edit collection</button>
          : !id && <button type="button" className="button" onClick={() => setDialog({ kind: 'collection' })}>New collection</button>}
      </div>
      {error && <p role="alert" className="alert alert-error">{error}</p>}
      {notice && <p role="status" className="alert alert-success">{notice}</p>}
      {loading && <p className="page-message">Loading collections…</p>}
      {!id && !loading && !error && <DataTable rows={collections} emptyMessage="No collections yet. Create one to start tracking payments." columns={[
        { label: 'Collection', render: row => <Link to={'/collections/' + row.id}>{row.name}</Link> },
        { label: 'School year', render: row => row.school_year },
        { label: 'Expected students', render: row => row.expected_students },
        { label: 'Amount per student', render: row => money(row.amount_cents) },
      ]} />}
      {collection && <>
        <div className="stat-row">
          <div className="stat-card"><p className="stat-label">Students on roster</p><p className="stat-value">{students.length} / {collection.expected_students}</p><p className="stat-description">{students.filter(row => paymentStatus(row) === 'Paid').length} fully paid</p></div>
          <div className="stat-card"><p className="stat-label">Total collected</p><p className="stat-value stat-green">{money(collected)}</p><p className="stat-description">From recorded payments</p></div>
          <div className="stat-card"><p className="stat-label">Outstanding on roster</p><p className="stat-value stat-red">{money(outstanding)}</p><p className="stat-description">Expected target: {money(collection.expected_students * collection.amount_cents)}</p></div>
        </div>
        <div className="page-header">
          <h2>Student roster</h2>
          <div className="actions">
            <button type="button" className="button button-light" onClick={() => setDialog({ kind: 'import' })}>Import CSV</button>
            <button type="button" className="button button-light" onClick={exportCsv}>Export CSV</button>
            <button type="button" className="button" onClick={() => setDialog({ kind: 'student' })}>Add student</button>
          </div>
        </div>
        <div className="toolbar">
          <input type="search" aria-label="Search roster" placeholder="Search name or student ID" value={search} onChange={event => setSearch(event.target.value)} />
          <select aria-label="Filter by payment status" value={status} onChange={event => setStatus(event.target.value)}>
            <option value="">All payment statuses</option><option>Paid</option><option>Partial</option><option>Unpaid</option>
          </select>
        </div>
        <DataTable rows={filtered} rowKey="student_id" columns={columns} emptyMessage={students.length ? 'No students match these filters.' : 'Add students manually or import a CSV to start.'} />
      </>}
      {dialog && <CollectionDialog dialog={dialog} resolutions={resolutions} onSave={saveDialog} onClose={() => setDialog(null)} />}
    </div>
  );
}

function CollectionDialog({ dialog, resolutions, onSave, onClose }) {
  const { kind, row } = dialog;
  const [values, setValues] = useState({
    name: row?.name || '',
    school_year: row?.school_year || '',
    expected_students: row?.expected_students ?? '',
    amount: row?.amount_cents ? (row.amount_cents / 100).toFixed(2) : '',
    resolution_id: row?.resolution_id ?? '',
    student_id: row?.student_id || '',
    or_number: row?.or_number || '',
    paid: true,
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const titles = {
    collection: row ? 'Edit collection' : 'New collection',
    student: row ? 'Edit student name' : 'Add student',
    payment: 'Payment for ' + row?.name,
    import: 'Import student roster',
    remove: 'Remove student',
  };

  function change(event) {
    const { name, type, value, checked, files } = event.target;
    setValues(previous => ({ ...previous, [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value }));
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const { name, school_year, expected_students, amount, resolution_id, student_id, or_number, paid, csv } = values;
      const payload = {
        collection: { name, school_year, expected_students, amount, resolution_id: resolution_id || null },
        student: { student_id, name },
        payment: { student_id, paid, or_number: paid ? or_number : null },
        import: { csv },
      };
      await onSave(payload[kind]);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      setSaving(false);
    }
  }

  return (
    <Modal title={titles[kind]} onClose={() => { if (!saving) onClose(); }}>
      <form className="form" onSubmit={submit}>
        {error && <p role="alert" className="alert alert-error">{error}</p>}
        {kind === 'collection' && <>
          <label>Collection name<input name="name" required maxLength={255} value={values.name} onChange={change} /></label>
          <label>School year<input name="school_year" required maxLength={30} placeholder="2026–2027" value={values.school_year} onChange={change} /></label>
          <div className="form-row">
            <label>Expected students<input name="expected_students" required type="number" min="0" max="100000" value={values.expected_students} onChange={change} /></label>
            <label>Amount per student (PHP)<input name="amount" required type="number" min="0.01" max="99999999.99" step="0.01" value={values.amount} onChange={change} /></label>
          </div>
          <label>Approving resolution (optional)
            <select name="resolution_id" value={values.resolution_id} onChange={change}>
              <option value="">No linked resolution</option>
              {resolutions.map(option => <option key={option.id} value={option.id}>{formatResolutionNumber(option.number, option.series_year)} — {option.title}</option>)}
            </select>
          </label>
        </>}
        {kind === 'student' && <>
          <label>Student ID<input name="student_id" required maxLength={255} readOnly={Boolean(row)} value={values.student_id} onChange={change} /></label>
          <label>Full name<input name="name" required maxLength={255} value={values.name} onChange={change} /></label>
          {!row && <p className="muted">If this student ID is already on the roster, saving updates the name and keeps the payment.</p>}
        </>}
        {kind === 'payment' && <>
          <p>Student ID: {row.student_id} · Amount due: {money(row.due_cents)}</p>
          <label className="checkbox-item"><input type="checkbox" name="paid" checked={values.paid} onChange={change} /> Paid in full</label>
          {values.paid ? <label>Official receipt (OR) number<input name="or_number" required maxLength={500} value={values.or_number} onChange={change} /></label>
            : <p className="alert alert-error">Saving will clear the recorded amount and receipt for this student in this collection.</p>}
        </>}
        {kind === 'import' && <>
          <p>Use a UTF-8 CSV with headers <code>student_id,name</code>. Matching IDs update names and keep recorded payments.</p>
          <label>CSV file<input name="csv" type="file" accept=".csv,text/csv" required onChange={change} /></label>
          <a download="student-roster.csv" href="data:text/csv;charset=utf-8,student_id%2Cname%0A2026-001%2CAlex%20Rivera%0A">Download sample CSV</a>
        </>}
        {kind === 'remove' && <p>Remove {row.name} ({row.student_id}) from this collection?</p>}
        <div className="actions">
          <button className={'button' + (kind === 'remove' ? ' button-danger' : '')} disabled={saving}>{saving ? 'Saving…' : { import: 'Import roster', remove: 'Remove student', payment: 'Save payment' }[kind] || 'Save'}</button>
          <button type="button" className="button button-light" disabled={saving} onClick={onClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
}
