import React, { useMemo } from "react";
import "./SecLabPagination.css";

export interface SecLabPaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 当前页码 (从 1 开始) */
  currentPage: number;
  /** 总页数 */
  totalPages: number;
  /** 最大可见页码数，默认为 5 */
  maxVisibleButtons?: number;
  /** 页码改变时的回调 */
  onPageChange?: (page: number) => void;
}

export const SecLabPagination: React.FC<SecLabPaginationProps> = ({
  currentPage,
  totalPages,
  maxVisibleButtons = 5,
  onPageChange,
  className = "",
  ...rest
}) => {
  const pages = useMemo(() => {
    const total = totalPages;
    const current = currentPage;
    const max = maxVisibleButtons;
    const r: (number | string)[] = [];

    if (total <= max) {
      for (let i = 1; i <= total; i++) {
        r.push(i);
      }
    } else {
      const half = Math.floor(max / 2);
      let start = Math.max(1, current - half);
      let end = Math.min(total, current + half);

      if (current - start < half) {
        end += half - (current - start);
      }
      if (end - current < half) {
        start -= half - (end - current);
      }

      start = Math.max(1, start);
      end = Math.min(total, end);

      if (start > 1) {
        r.push(1);
        if (start > 2) {
          r.push("...");
        }
      }
      for (let i = start; i <= end; i++) {
        r.push(i);
      }
      if (end < total) {
        if (end < total - 1) {
          r.push("...");
        }
        r.push(total);
      }
    }
    return r;
  }, [currentPage, totalPages, maxVisibleButtons]);

  if (totalPages <= 1) return null;

  const changePage = (page: number | string) => {
    if (typeof page === "number" && page !== currentPage) {
      onPageChange?.(page);
    }
  };

  return (
    <div className={`sl-pagination ${className}`.trim()} {...rest}>
      <button
        type="button"
        className="sl-pagination-btn"
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>

      {pages.map((page, index) => {
        const isActive = page === currentPage;
        const isEllipsis = typeof page === "string";
        return (
          <button
            key={index}
            type="button"
            className={`sl-pagination-btn ${isActive ? "active" : ""} ${isEllipsis ? "ellipsis" : ""}`.trim()}
            onClick={() => changePage(page)}
            disabled={isEllipsis}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        className="sl-pagination-btn"
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
};
