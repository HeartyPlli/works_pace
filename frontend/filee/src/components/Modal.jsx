// Modal.jsx
// A pop up box that shows on top of the page (used for small forms).
//
// Props:
//   title    - the heading of the box
//   onClose  - function to call when the user clicks the X button
//   children - whatever is placed between <Modal> and </Modal>

export default function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            X
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
