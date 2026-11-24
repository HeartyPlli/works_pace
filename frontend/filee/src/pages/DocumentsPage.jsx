import { useEffect, useState } from 'react';
import api from '../api/client.js';
import { downloadFile } from '../api/councilApi.js';
import DataTable from '../components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import { formatDate, getErrorMessage, todayDate } from '../helpers.js';

const types = { minutes: 'Meeting minutes', narrative: 'Narrative report', other: 'Other document' };

export default function DocumentsPage() {
  const [documents, setDocuments] = useState(null);
  const [type, setType] = useState('');
  const [search, setSearch] = useState('');
  const [panel, setPanel] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get('/documents').then(response => setDocuments(response.data))
      .catch(requestError => setError(getErrorMessage(requestError)));
  }, []);

  async function open(id) {
    setBusy(true);
    setError('');
    try {
      const response = await api.get('/documents/' + id);
      setPanel({ mode: 'view', document: response.data });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  async function save(form) {
    const id = panel.document?.id;
    const response = await api.post(id ? '/documents/' + id : '/documents', form);
    const saved = response.data;
    setDocuments(previous => [saved, ...previous.filter(row => row.id !== saved.id)]
      .sort((first, second) => second.document_date.localeCompare(first.document_date) || second.id - first.id));
    setPanel({ mode: 'view', document: saved });
  }

  async function remove() {
    const id = panel.document.id;
    await api.delete('/documents/' + id);
    setDocuments(previous => previous.filter(row => row.id !== id));
    setPanel(null);
  }

  const shown = (documents ?? []).filter(row =>
    (!type || row.type === type) &&
    (row.title + ' ' + (row.attachment_name ?? '')).toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <div>
      <div className="page-header">
        <div><h1>Documents</h1><p className="page-subtitle">Organize meeting minutes, narrative reports, and other council files.</p></div>
        <button type="button" className="button" disabled={!documents} onClick={() => setPanel({ mode: 'edit' })}>New document</button>
      </div>
      {error && <p role="alert" className="alert alert-error">{error}</p>}
      <div className="toolbar">
        <input type="search" aria-label="Search documents" placeholder="Search by title or filename" value={search} onChange={event => setSearch(event.target.value)} />
        <select aria-label="Document type" value={type} onChange={event => setType(event.target.value)}>
          <option value="">All document types</option>
          {Object.entries(types).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
      </div>
      {!documents && !error && <p className="page-message">Loading documents…</p>}
      {documents && <DataTable rows={shown} emptyMessage={documents.length ? 'No documents match these filters.' : 'No documents yet. Create one or add a file.'} columns={[
        { label: 'Title', render: row => <button type="button" className="text-button" onClick={() => open(row.id)} disabled={busy}>{row.title}</button> },
        { label: 'Type', render: row => types[row.type] },
        { label: 'Date', render: row => formatDate(row.document_date) },
        { label: 'Attachment', render: row => row.attachment_name || '—' },
      ]} />}
      {panel?.mode === 'edit' && <DocumentForm document={panel.document} onSave={save} onClose={() => setPanel(panel.document ? { ...panel, mode: 'view' } : null)} />}
      {panel?.mode === 'view' && <DocumentDetails document={panel.document} onEdit={() => setPanel({ ...panel, mode: 'edit' })} onRemove={remove} onClose={() => setPanel(null)} />}
    </div>
  );
}

function DocumentForm({ document, onSave, onClose }) {
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      await onSave(form);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      setSaving(false);
    }
  }

  return (
    <Modal title={document ? 'Edit document' : 'New document'} onClose={() => { if (!saving) onClose(); }}>
      <form className="form" onSubmit={submit}>
        {error && <p role="alert" className="alert alert-error">{error}</p>}
        <label>Title<input name="title" required maxLength={255} defaultValue={document?.title} /></label>
        <div className="form-row">
          <label>Type<select name="type" defaultValue={document?.type ?? 'minutes'}>
            {Object.entries(types).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select></label>
          <label>Document date<input type="date" name="document_date" required defaultValue={document?.document_date ?? todayDate()} /></label>
        </div>
        <label>Content<textarea name="body" rows={8} maxLength={100000} defaultValue={document?.body ?? ''} /></label>
        <label>{document?.attachment_name ? 'Replace attachment (optional)' : 'Attach a file (optional)'}<input type="file" name="attachment" accept=".pdf,.doc,.docx,.odt,.txt,.rtf,.xls,.xlsx,.ppt,.pptx,.csv,.png,.jpg,.jpeg" /></label>
        <p className="muted">Write content, attach a file up to 10 MB, or use both.</p>
        {document?.attachment_name && <label className="checkbox-item"><input type="checkbox" name="remove_attachment" value="1" /> Remove {document.attachment_name}</label>}
        <div className="actions">
          <button className="button" disabled={saving}>{saving ? 'Saving…' : 'Save document'}</button>
          <button type="button" className="button button-light" disabled={saving} onClick={onClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
}

function DocumentDetails({ document, onEdit, onRemove, onClose }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function run(action) {
    setBusy(true);
    setError('');
    try {
      await action();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title={document.title} onClose={() => { if (!busy) onClose(); }}>
      <p className="muted">{types[document.type]} · {formatDate(document.document_date)}</p>
      {document.body && <p className="pre-wrap">{document.body}</p>}
      {error && <p role="alert" className="alert alert-error">{error}</p>}
      {confirmDelete ? <div>
        <p>Delete this document and its attachment?</p>
        <div className="actions">
          <button type="button" className="button button-danger" disabled={busy} onClick={() => run(onRemove)}>Delete document</button>
          <button type="button" className="button button-light" disabled={busy} onClick={() => setConfirmDelete(false)}>Cancel</button>
        </div>
      </div> : <div className="actions">
        {document.attachment_name && <button type="button" className="button" disabled={busy} onClick={() => run(() => downloadFile('/documents/' + document.id + '/attachment', document.attachment_name))}>Download attachment</button>}
        <button type="button" className="button button-light" disabled={busy} onClick={onEdit}>Edit</button>
        <button type="button" className="button button-danger" disabled={busy} onClick={() => setConfirmDelete(true)}>Delete</button>
      </div>}
    </Modal>
  );
}
