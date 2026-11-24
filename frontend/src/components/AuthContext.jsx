// AuthContext.jsx
// This file remembers WHO is logged in and shares it with every page.
// Any component can call useAuth() to get the user, the login function, and the logout function.

import { createContext, useContext, useEffect, useState } from 'react';
import { loginRequest, logoutRequest, getMe } from '../api/authApi.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // user is null when nobody is logged in.
  const [user, setUser] = useState(null);
  // loading is true while we check the saved token when the app starts.
  const [loading, setLoading] = useState(true);

  // When the app starts: if a token is saved, ask Laravel who it belongs to.
  useEffect(() => {
    loadUserFromToken();
  }, []);

  async function loadUserFromToken() {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const me = await getMe();
      setUser(me);
    } catch (error) {
      // The token is old or wrong, so we throw it away.
      localStorage.removeItem('token');
    }
    setLoading(false);
  }

  // Log in: send email and password, then save the token we get back.
  // If the login fails, the error goes back to the Login page to show it.
  async function login(email, password) {
    const data = await loginRequest(email, password);
    localStorage.setItem('token', data.token);
    setUser(data.user);
  }

  // Log out: tell Laravel to delete the token, then forget it here too.
  async function logout() {
    try {
      await logoutRequest();
    } catch (error) {
      // Even if the server fails, we still log out on this computer.
    }
    localStorage.removeItem('token');
    setUser(null);
  }

  // Officers can add, edit, and delete. Viewers can only look.
  const isOfficer = user !== null && user.role === 'officer';

  const value = {
    user: user,
    loading: loading,
    isOfficer: isOfficer,
    login: login,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// A short way for components to get the login information.
export function useAuth() {
  return useContext(AuthContext);
}
