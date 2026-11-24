// journalApi.js
// Functions that talk to the Error Fix Journal routes of the API:
// entries and tags.

import apiClient from './client.js';

// filters is an object like { search: 'cors', tag: 'Laravel', favorite: 1 }
export async function getEntries(filters) {
  const response = await apiClient.get('/entries', { params: filters });
  return response.data;
}

export async function getEntry(id) {
  const response = await apiClient.get('/entries/' + id);
  return response.data;
}

export async function createEntry(entry) {
  const response = await apiClient.post('/entries', entry);
  return response.data;
}

export async function updateEntry(id, entry) {
  const response = await apiClient.put('/entries/' + id, entry);
  return response.data;
}

export async function deleteEntry(id) {
  const response = await apiClient.delete('/entries/' + id);
  return response.data;
}

// Add 1 to "seen count" because you met the same error again.
export async function markEntrySeen(id) {
  const response = await apiClient.post('/entries/' + id + '/seen');
  return response.data;
}

// Turn the favorite star on or off.
export async function toggleEntryFavorite(id) {
  const response = await apiClient.post('/entries/' + id + '/favorite');
  return response.data;
}

export async function getTags() {
  const response = await apiClient.get('/tags');
  return response.data;
}
