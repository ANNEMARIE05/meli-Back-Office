import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  from: number;
  to: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  totalItems,
  pageSize,
  from,
  to,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25],
}) => {
  const pages = getVisiblePages(page, totalPages);

  return (
    <div className="pagination-bar">
      <div className="pagination-meta">
        <span className="pagination-count">
          {totalItems === 0 ? 'Aucun résultat' : `${from}–${to} sur ${totalItems}`}
        </span>
        {onPageSizeChange && (
          <label className="pagination-size">
            <span className="pagination-size-label">Par page</span>
            <select
              className="form-select pagination-size-select"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              aria-label="Nombre de résultats par page"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination-nav">
          <button
            type="button"
            className="btn btn-secondary pagination-btn"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Page précédente"
          >
            <ChevronLeft size={16} />
            <span className="pagination-btn-label">Précédent</span>
          </button>

          <div className="pagination-pages">
            {pages.map((p, i) =>
              p === '…' ? (
                <span key={`ellipsis-${i}`} className="pagination-ellipsis">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  className={`pagination-page ${p === page ? 'is-active' : ''}`}
                  onClick={() => onPageChange(p)}
                  aria-current={p === page ? 'page' : undefined}
                >
                  {p}
                </button>
              )
            )}
          </div>

          <span className="pagination-mobile-indicator">
            {page} / {totalPages}
          </span>

          <button
            type="button"
            className="btn btn-secondary pagination-btn"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Page suivante"
          >
            <span className="pagination-btn-label">Suivant</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

function getVisiblePages(current: number, total: number): Array<number | '…'> {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: Array<number | '…'> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push('…');
  for (let p = start; p <= end; p += 1) pages.push(p);
  if (end < total - 1) pages.push('…');
  pages.push(total);

  return pages;
}
