'use client';
import { Card, CardContent } from '@heroui/react';

export default function ResponsiveTable({ columns, data, emptyMessage = 'No data', emptyColSpan }) {
  if (!data || data.length === 0) {
    return (
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
    );
  }

  return (
    <>
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
        {data.map((row, rowIdx) => (
          <Card key={row._id || rowIdx} className="shadow-sm mx-auto w-full max-w-md">
            <CardContent className="p-4">
              <div className="space-y-3">
                {columns.map((col, colIdx) => {
                  const rendered = col.render ? col.render(row[col.key], row) : row[col.key];
                  if (rendered === null || rendered === undefined) return null;
                  return (
                    <div key={colIdx} className={col.label ? 'flex items-center justify-between' : 'flex justify-end'}>
                      {col.label && <span className="text-xs font-medium text-gray-500 uppercase">{col.label}</span>}
                      <span className={`text-sm text-right ${col.label ? '' : 'w-full'}`}>{rendered}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
