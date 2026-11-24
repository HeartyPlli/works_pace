// dashboardApi.js
// Function that gets the numbers and lists for the Dashboard page.

import apiClient from './client.js';

// Get totals, latest resolutions, and most repeated errors.
export async function getDashboard() {
  const response = await apiClient.get('/dashboard');
  return response.data;
}
