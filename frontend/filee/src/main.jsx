// main.jsx
// This is the starting point of the React app.
// It finds <div id="root"> in index.html and shows the App component inside it.

import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ThemeProvider } from './components/ThemeContext.jsx';
import { AuthProvider } from './components/AuthContext.jsx';

// The styles. The order matters: design.css comes second, so it wins when both style the same thing.
import './index.css';
import './design.css';

// BrowserRouter lets us have pages with their own address (like /students).
// ThemeProvider shares light or dark mode with every page.
// AuthProvider shares the logged in user with every page.
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);
