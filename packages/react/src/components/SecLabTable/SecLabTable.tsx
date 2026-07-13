import React from "react";
import "./SecLabTable.css";

export interface SecLabTableColumn<T = any> {
  prop?: string;
  label: string;
  width?: string | number;
  minWidth?: string | number;
  align?: "left" | "center" | "right";
  headerAlign?: "left" | "center" | "right";
  slot?: string;
  headerSlot?: string;
  renderCell?: (
    row: T,
    column: SecLabTableColumn<T>,
    index: number,
  ) => React.ReactNode;
  renderHeader?: (
    column: SecLabTableColumn<T>,
    index: number,
  ) => React.ReactNode;
  fixed?: "left" | "right";
}

export interface SecLabTableProps<
  T,
> extends React.HTMLAttributes<HTMLDivElement> {
  /** 表格数据 */
  data: T[];
  /** 列配置 */
  columns: SecLabTableColumn<T>[];
  /** 是否显示全网格边框 */
  border?: boolean;
  /** 无数据时显示的占位文案 */
  emptyText?: string;
  rowKey?: keyof T | ((row: T) => React.Key);
  /** 插槽映射 (对应 Vue 中的 scoped slots) */
  slots?: Record<
    string,
    (scope: {
      row: T;
      column: SecLabTableColumn<T>;
      index: number;
    }) => React.ReactNode
  >;
  /** 表头插槽映射 */
  headerSlots?: Record<
    string,
    (scope: { column: SecLabTableColumn<T>; index: number }) => React.ReactNode
  >;
  /** 自定义空数据占位 */
  emptySlot?: React.ReactNode;
  /** 鼠标悬浮行回调 */
  onRowMouseEnter?: (
    row: T,
    event: React.MouseEvent<HTMLTableRowElement>,
    index: number,
  ) => void;
  /** 右键行回调 */
  onRowContextMenu?: (
    row: T,
    event: React.MouseEvent<HTMLTableRowElement>,
    index: number,
  ) => void;
}

const formatWidth = (width?: string | number) => {
  if (width === undefined) return undefined;
  return typeof width === "number" ? `${width}px` : width;
};

const getHeaderStyle = <T,>(col: SecLabTableColumn<T>): React.CSSProperties => {
  return {
    width: formatWidth(col.width),
    minWidth: formatWidth(col.minWidth),
    textAlign: col.headerAlign || col.align || "center",
  };
};

const getCellStyle = <T,>(col: SecLabTableColumn<T>): React.CSSProperties => {
  return {
    width: formatWidth(col.width),
    minWidth: formatWidth(col.minWidth),
    textAlign: col.align || "left",
  };
};

export function SecLabTable<T extends Record<string, any>>({
  data,
  columns,
  border = false,
  emptyText = "暂无数据",
  rowKey,
  slots,
  headerSlots,
  emptySlot,
  onRowMouseEnter,
  onRowContextMenu,
  className = "",
  ...rest
}: SecLabTableProps<T>) {
  const fixedOffset = (index: number, side: "left" | "right") => {
    const range =
      side === "left" ? columns.slice(0, index) : columns.slice(index + 1);
    return range
      .filter((column) => column.fixed === side)
      .reduce(
        (total, column) =>
          total + (typeof column.width === "number" ? column.width : 0),
        0,
      );
  };
  const columnStyle = (
    column: SecLabTableColumn<T>,
    index: number,
    header = false,
  ): React.CSSProperties => {
    const base = header ? getHeaderStyle(column) : getCellStyle(column);
    return column.fixed
      ? {
          ...base,
          position: "sticky",
          [column.fixed]: fixedOffset(index, column.fixed),
        }
      : base;
  };
  const resolveRowKey = (row: T, index: number): React.Key =>
    typeof rowKey === "function"
      ? rowKey(row)
      : rowKey
        ? (row[rowKey] as React.Key)
        : index;
  return (
    <div
      className={`sl-table-container ${border ? "sl-table-border" : ""} ${className}`.trim()}
      data-native-context-menu="true"
      {...rest}
    >
      <div className="sl-table-wrapper">
        <table className="sl-table">
          <thead>
            <tr className="sl-table-header-row">
              {columns.map((col, index) => {
                const isFixed = col.fixed ? `is-fixed-${col.fixed}` : "";
                return (
                  <th
                    key={index}
                    className={`sl-table-header-cell ${isFixed}`.trim()}
                    style={columnStyle(col, index, true)}
                  >
                    <div className="sl-cell">
                      {col.renderHeader
                        ? col.renderHeader(col, index)
                        : col.headerSlot &&
                            headerSlots &&
                            headerSlots[col.headerSlot]
                          ? headerSlots[col.headerSlot]({ column: col, index })
                          : col.label}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={resolveRowKey(row, rowIndex)}
                  className="sl-table-row"
                  onMouseEnter={(event) =>
                    onRowMouseEnter?.(row, event, rowIndex)
                  }
                  onContextMenu={(event) =>
                    onRowContextMenu?.(row, event, rowIndex)
                  }
                >
                  {columns.map((col, colIndex) => {
                    const isFixed = col.fixed ? `is-fixed-${col.fixed}` : "";
                    return (
                      <td
                        key={colIndex}
                        className={`sl-table-cell ${isFixed}`.trim()}
                        style={columnStyle(col, colIndex)}
                      >
                        <div className="sl-cell">
                          {col.renderCell
                            ? col.renderCell(row, col, rowIndex)
                            : col.slot && slots && slots[col.slot]
                              ? slots[col.slot]({
                                  row,
                                  column: col,
                                  index: rowIndex,
                                })
                              : col.prop
                                ? String(row[col.prop] ?? "")
                                : ""}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="sl-table-empty-cell">
                  {emptySlot || (
                    <div className="sl-table-empty">{emptyText}</div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
