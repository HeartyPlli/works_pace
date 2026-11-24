// councilApi.js
// Functions that talk to the Council Records and Collections routes of the API:
// resolutions, students, charges, payments, the ledger, and the unpaid report.

import apiClient from './client.js';

// ---------- Resolutions ----------

// filters is an object like { search: 'fee', year: 2026, status: 'adopted' }
export async function getResolutions(filters) {
  const response = await apiClient.get('/resolutions', { params: filters });
  return response.data;
}

export async function getResolution(id) {
  const response = await apiClient.get('/resolutions/' + id);
  return response.data;
}

// Ask Laravel what the next resolution number is for a year.
export async function getNextResolutionNumber(year) {
  const response = await apiClient.get('/resolutions/next-number', { params: { year: year } });
  return response.data;
}

export async function createResolution(resolution) {
  const response = await apiClient.post('/resolutions', resolution);
  return response.data;
}

export async function updateResolution(id, resolution) {
  const response = await apiClient.put('/resolutions/' + id, resolution);
  return response.data;
}

export async function deleteResolution(id) {
  const response = await apiClient.delete('/resolutions/' + id);
  return response.data;
}

// ---------- Students ----------

export async function getStudents(search) {
  const response = await apiClient.get('/students', { params: { search: search } });
  return response.data;
}

export async function createStudent(student) {
  const response = await apiClient.post('/students', student);
  return response.data;
}

export async function updateStudent(id, student) {
  const response = await apiClient.put('/students/' + id, student);
  return response.data;
}

export async function deleteStudent(id) {
  const response = await apiClient.delete('/students/' + id);
  return response.data;
}

// The ledger shows one student's charges, payments, and balance.
export async function getStudentLedger(id) {
  const response = await apiClient.get('/students/' + id + '/ledger');
  return response.data;
}

// ---------- Charges, assigning charges, and payments ----------

export async function getCharges() {
  const response = await apiClient.get('/charges');
  return response.data;
}

export async function createCharge(charge) {
  const response = await apiClient.post('/charges', charge);
  return response.data;
}

// data is like { charge_id: 1, student_ids: [1, 2, 3], amount_due: 100, date_incurred: '2026-06-01' }
export async function assignCharge(data) {
  const response = await apiClient.post('/student-charges', data);
  return response.data;
}

// payment is like { student_charge_id: 5, amount: 50, paid_at: '2026-06-02', receipt_no: 'OR-0001' }
export async function createPayment(payment) {
  const response = await apiClient.post('/payments', payment);
  return response.data;
}

// ---------- Reports ----------

export async function getUnpaidReport() {
  const response = await apiClient.get('/reports/unpaid');
  return response.data;
}
