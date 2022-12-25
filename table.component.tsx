import React from 'react';

interface TableProps {
  headers: string[];
  content: { [key: string]: any }[];
  renderRow: (row: unknown, index: number) => any;
}

const Table: React.FC<TableProps> = ({ headers, content, renderRow }) => {
  return (
    <table className='table-auto'>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.isArray(content) && content.length > 0 ? (
          content.map((rowItem: any, index: number) => renderRow(rowItem, index))
        ) : (
          <td colSpan={headers.length}>
            <h3 >No Results Found</h3>
          </td>
        )}
      </tbody>
    </table>
  );
};

export default Table;
