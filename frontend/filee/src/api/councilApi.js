// councilApi.js
// Resolution requests and authenticated downloads for council records.

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

export async function downloadFile(path, filename) {
  const response = await apiClient.get(path, { responseType: 'blob' });
  const url = URL.createObjectURL(response.data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
