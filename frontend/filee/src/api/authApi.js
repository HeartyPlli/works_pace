// authApi.js
// Functions that talk to the login routes of the Laravel API.

import apiClient from './client.js';

// Send the email and password. Laravel answers with a token and the user.
export async function loginRequest(email, password) {
  const response = await apiClient.post('/login', { email: email, password: password });
  return response.data;
}

// Tell Laravel to delete the current token.
export async function logoutRequest() {
  const response = await apiClient.post('/logout');
  return response.data;
}

// Ask Laravel "who am I?" using the saved token.
export async function getMe() {
  const response = await apiClient.get('/me');
  return response.data.user;
}

export async function requestAccount(email, password, showJournal) {
  const response = await apiClient.post('/register', { email, password, show_journal: showJournal });
  return response.data.message;
}

export async function saveJournalPreference(showJournal) {
  const response = await apiClient.patch('/me/preferences', { show_journal: showJournal });
  return response.data.user;
}

export async function getPendingAccounts() {
  const response = await apiClient.get('/accounts/pending');
  return response.data;
}

export async function approveAccount(id) {
  await apiClient.post('/accounts/' + id + '/approve');
}
