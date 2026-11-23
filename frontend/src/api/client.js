// client.js
// This file creates ONE axios object that all the other API files use.
// axios is a small library that sends requests to the Laravel API.
// This object knows the API address and adds the login token to every request.

import axios from 'axios';

// The API address comes from the .env file (VITE_API_URL).
// If it is missing, we use the normal Laravel address.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    Accept: 'application/json',
  },
});

// Before every request: add the saved token, if we have one.
// Laravel reads this "Authorization" header to know who is logged in.
apiClient.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

// After every response: if Laravel says 401 (you are not logged in),
// remove the old token and go back to the login page.
apiClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const isNotLoggedIn = error.response && error.response.status === 401;
    if (isNotLoggedIn && window.location.pathname !== '/login') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
