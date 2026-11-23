// SearchBar.jsx
// A text box with a Search button. Pressing Enter also searches.
//
// Props (the values this component receives):
//   value       - the text inside the box
//   onChange    - function to call when the text changes
//   onSearch    - function to call when the user clicks Search or presses Enter
//   placeholder - grey hint text inside the empty box

export default function SearchBar({ value, onChange, onSearch, placeholder }) {
  // Stop the browser from reloading the page, then run the search.
  function handleSubmit(event) {
    event.preventDefault();
    onSearch();
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      <button type="submit" className="button">
        Search
      </button>
    </form>
  );
}
