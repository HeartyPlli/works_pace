// DataTable.jsx
// A simple table that many pages share.
//
// Props:
//   columns      - a list like [{ label: 'Name', render: (row) => row.name }]
//                  "label" is the column title.
//                  "render" is a function that gets one row and returns what to show in the cell.
//   rows         - the list of records to show (each record must have an "id")
//   emptyMessage - text to show when there are no rows

export default function DataTable({ columns, rows, emptyMessage }) {
  if (rows.length === 0) {
    return <p className="empty-message">{emptyMessage || 'No records found.'}</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.label}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column.label}>{column.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
