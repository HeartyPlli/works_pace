// CodeBox.jsx
// Shows code in a grey box with a monospace font, plus a Copy button.
// The Copy button uses the browser's built in clipboard (no extra library).
//
// Props:
//   code - the text to show and copy

import { useState } from 'react';

// The older way to copy: put the text in a hidden text box, select it, and copy it.
// We use it when the browser does not allow the newer clipboard function.
function copyWithHiddenTextBox(text) {
  const textBox = document.createElement('textarea');
  textBox.value = text;
  textBox.style.position = 'fixed';
  textBox.style.opacity = '0';
  document.body.appendChild(textBox);
  textBox.select();
  const worked = document.execCommand('copy');
  document.body.removeChild(textBox);
  return worked;
}

export default function CodeBox({ code }) {
  // The text on the button. It changes to "Copied!" for 2 seconds.
  const [buttonText, setButtonText] = useState('Copy');

  async function handleCopy() {
    try {
      // The newer way. It works on http://localhost and on https:// pages.
      await navigator.clipboard.writeText(code);
      setButtonText('Copied!');
    } catch (error) {
      // The newer way was blocked, so we try the older way.
      if (copyWithHiddenTextBox(code)) {
        setButtonText('Copied!');
      } else {
        setButtonText('Could not copy');
      }
    }
    // After 2 seconds, change the button text back.
    setTimeout(() => setButtonText('Copy'), 2000);
  }

  return (
    <div className="code-box">
      <button type="button" className="button button-small code-copy" onClick={handleCopy}>
        {buttonText}
      </button>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
