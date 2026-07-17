'use client';
import { Pagination } from '@heroui/react';

export default function PaginationBar({ total, page, onChange }) {
  if (total <= 1) return null;

  const pages = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="flex justify-center p-4">
      <Pagination.Root size="sm">
        <Pagination.Content className="flex items-center gap-1">
          <Pagination.Previous
            isDisabled={page <= 1}
            onPress={() => onChange(page - 1)}
            className="px-2 py-1 text-sm rounded hover:bg-gray-100 disabled:opacity-40"
          >
            <Pagination.PreviousIcon />
          </Pagination.Previous>

          {pages.map((p, idx) =>
            p === '...' ? (
              <Pagination.Item key={`ellipsis-${idx}`}>
                <Pagination.Ellipsis className="px-2 text-gray-400" />
              </Pagination.Item>
            ) : (
              <Pagination.Item key={p}>
                <Pagination.Link
                  isActive={p === page}
                  onPress={() => onChange(p)}
                  className={`px-3 py-1 text-sm rounded min-w-[32px] text-center ${
                    p === page
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {p}
                </Pagination.Link>
              </Pagination.Item>
            )
          )}

          <Pagination.Next
            isDisabled={page >= total}
            onPress={() => onChange(page + 1)}
            className="px-2 py-1 text-sm rounded hover:bg-gray-100 disabled:opacity-40"
          >
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Content>
      </Pagination.Root>
    </div>
  );
}
