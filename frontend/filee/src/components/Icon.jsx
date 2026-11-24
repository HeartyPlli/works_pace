// Icon.jsx
// Small line icons, drawn with SVG (so no icon library is needed).
// Use it like this: <Icon name="home" /> or <Icon name="plus" size={16} />
// Each icon is one SVG "path": a short list of drawing commands, stored in the list below.

// The drawing of each icon, by name.
const paths = {
  home: 'M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z',
  document: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Zm0 0v6h6M8 12h8M8 16h6',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  layers: 'm12 3 10 5-10 5L2 8Zm-10 9 10 5 10-5M2 16l10 5 10-5',
  report: 'M5 3h14v18l-3-2-4 2-4-2-3 2ZM9 7h6M9 11h6M9 15h3',
  code: 'm8 6-6 6 6 6m8-12 6 6-6 6m-3-16-2 20',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5',
  moon: 'M21 12.8A9 9 0 0 1 11.2 3 9 9 0 1 0 21 12.8Z',
  wallet: 'M3 7V5a2 2 0 0 1 2-2h13v4M3 7h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm18 5h-5v5h5',
  logout: 'M9 5H4v14h5m6-14 5 7-5 7M8 12h12',
  plus: 'M12 5v14M5 12h14',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'm6 6 12 12M6 18 18 6',
  check: 'm5 12 4 4L19 6',
};

// Shows one icon. "size" is the width and height in pixels (20 if you do not give one).
// If the name is unknown, it shows the "document" icon.
// Any other props (like className) are passed on to the <svg>.
export default function Icon({ name, size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name] || paths.document} />
    </svg>
  );
}
