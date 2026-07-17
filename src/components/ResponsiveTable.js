'use client';
import { Card } from '@heroui/react';
import PaginationBar from './PaginationBar';

export default function ResponsiveTable({ columns, data, emptyMessage = 'No data', emptyColSpan, totalPages, page, onPageChange, totalItems }) {
  const hasPagination = totalPages !== undefined && page !== undefined && onPageChange;

  if (!data || data.length === 0) {
    return (
      <div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col, i) => (
                  <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr><td colSpan={emptyColSpan || columns.length} className="px-6 py-8 text-center text-gray-500">{emptyMessage}</td></tr>
            </tbody>
          </table>
        </div>
        {hasPagination && <PaginationBar total={totalPages} page={page} onChange={onPageChange} totalItems={totalItems} />}
      </div>
    );
  }

  return (
    <div>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, rowIdx) => (
              <tr key={row._id || rowIdx} className="hover:bg-gray-50">
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-6 py-4 text-sm">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden grid grid-cols-1 gap-4">
        {data.map((row, rowIdx) => {
          const titleCol = columns.find(c => c.label && c.key && !c.hideLabel);
          const actionCol = columns.find(c => !c.label || c.label === 'Actions');
          const detailCols = columns.filter(c => c !== titleCol && c !== actionCol && c.label);
          return (
            <Card key={row._id || rowIdx} className="shadow-sm mx-auto w-full max-w-md">
              {titleCol && (
                <Card.Header className="border-b px-4 py-3">
                  <div className="flex items-center justify-between w-full">
                    <Card.Title className="text-sm font-semibold text-gray-900 truncate">
                      {titleCol.render ? titleCol.render(row[titleCol.key], row) : row[titleCol.key]}
                    </Card.Title>
                  </div>
                </Card.Header>
              )}
              <Card.Content className="px-4 py-3 space-y-2">
                {detailCols.map(col => {
                  const value = col.render ? col.render(row[col.key], row) : row[col.key];
                  if (value === null || value === undefined) return null;
                  return (
                    <div key={col.key} className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500 uppercase">{col.label}</span>
                      <span className="text-sm text-right ml-2">{value}</span>
                    </div>
                  );
                })}
              </Card.Content>
              {actionCol && (
                <Card.Footer className="border-t px-4 py-3 flex justify-end gap-2">
                  {actionCol.render ? actionCol.render(null, row) : null}
                </Card.Footer>
              )}
            </Card>
          );
        })}
      </div>

      {hasPagination && <PaginationBar total={totalPages} page={page} onChange={onPageChange} totalItems={totalItems} />}
    </div>
  );
}
