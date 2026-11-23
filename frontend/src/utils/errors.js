// errors.js
// One helper that turns an axios error into a short message we can show on the screen.

export function getErrorMessage(error) {
  // No response at all means the Laravel server could not be reached.
  if (!error.response) {
    return 'Cannot reach the server. Is the Laravel server running?';
  }

  const data = error.response.data;

  // Laravel validation errors look like: { errors: { title: ["The title field is required."] } }
  // We take the first message of each field and join them.
  if (data && data.errors) {
    const messages = [];
    for (const field in data.errors) {
      messages.push(data.errors[field][0]);
    }
    return messages.join(' ');
  }

  // Other errors from our controllers look like: { message: "..." }
  if (data && data.message) {
    return data.message;
  }

  return 'Something went wrong. Please try again.';
}
