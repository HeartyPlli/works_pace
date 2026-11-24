// ThemeContext.jsx
// Light mode and dark mode.
// - ThemeProvider remembers the chosen theme (in the browser's localStorage) and puts it on the
//   <html> tag as data-theme="light" or data-theme="dark". design.css then uses the matching colors.
// - ThemeToggle is the small sun and moon switch that changes the theme.
// (index.html also sets the theme very early, so the page does not flash white in dark mode.)

import { createContext, useContext, useEffect, useState } from 'react';
import Icon from './Icon.jsx';

const ThemeContext = createContext(null);

// The theme to start with: the one saved last time, or else the computer's own light or dark setting.
function initialTheme() {
  try {
    const saved = localStorage.getItem('workspace-theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  } catch {
    // The browser does not allow localStorage (for example in some private windows). We use the computer's setting.
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Shares the theme with every component, and saves it every time it changes.
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme);

  // When the theme changes: put it on the <html> tag, and save it for next time.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('workspace-theme', theme);
    } catch {
      // Saving is not allowed. The theme still works until the page is closed.
    }
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

// The sun and moon switch. Clicking it changes light to dark, or dark to light.
// The selected side (sun or moon) gets the "selected" class.
export function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);
  const otherTheme = theme === 'light' ? 'dark' : 'light';

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={`Switch to ${otherTheme} mode`}
      onClick={() => setTheme(otherTheme)}
    >
      <span className={theme === 'light' ? 'selected' : ''}>
        <Icon name="sun" size={18} />
      </span>
      <span className={theme === 'dark' ? 'selected' : ''}>
        <Icon name="moon" size={18} />
      </span>
    </button>
  );
}
