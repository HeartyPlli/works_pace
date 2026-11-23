// format.js
// Small helper functions that turn raw values into nice text for the screen.

// Example: formatResolutionNumber(4, 2026) gives "Resolution No. 0004, Series of 2026"
export function formatResolutionNumber(number, seriesYear) {
  const paddedNumber = String(number).padStart(4, '0');
  return 'Resolution No. ' + paddedNumber + ', Series of ' + seriesYear;
}

// Example: formatMoney(1250.5) gives "PHP 1,250.50"
export function formatMoney(amount) {
  const number = Number(amount) || 0;
  const text = number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return 'PHP ' + text;
}

// Turn a date text into a Date object.
// A plain date like "2026-03-15" is read as a local date (not UTC),
// so the day does not move by one.
function toDate(value) {
  if (value.length === 10) {
    return new Date(value + 'T00:00:00');
  }
  return new Date(value);
}

// Example: formatDate("2026-03-15") gives "Mar 15, 2026"
export function formatDate(value) {
  if (!value) {
    return '-';
  }
  return toDate(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Example: formatLongDate("2026-03-15") gives "March 15, 2026"
export function formatLongDate(value) {
  if (!value) {
    return '-';
  }
  return toDate(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Today's date as "YYYY-MM-DD". Date inputs need this format.
export function todayDate() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return now.getFullYear() + '-' + month + '-' + day;
}

// Example: capitalize("adopted") gives "Adopted"
export function capitalize(text) {
  if (!text) {
    return '';
  }
  return text.charAt(0).toUpperCase() + text.slice(1);
}
