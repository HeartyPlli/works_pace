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
