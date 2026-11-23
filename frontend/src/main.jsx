// main.jsx
// This is the starting point of the React app.
// It finds <div id="root"> in index.html and shows the App component inside it.

import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './auth/AuthContext.jsx';
import './index.css';

// BrowserRouter lets us have pages with their own address (like /students).
// AuthProvider shares the logged in user with every page.
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
