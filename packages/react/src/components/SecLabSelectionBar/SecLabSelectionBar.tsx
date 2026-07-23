import React from "react";
import { SecLabButton } from "../SecLabButton/SecLabButton";
import "./SecLabSelectionBar.css";

export interface SecLabSelectionBarProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "aria-label"
> {
  /** 已选择项目数量。 */
  count: number;
  /** 数量前的本地化说明，例如“已选择”。 */
  label: string;
  /** 清除选择按钮文案；不传时隐藏按钮。 */
  clearLabel?: string;
  /** 是否禁止清除选择。 */
  clearDisabled?: boolean;
  /** 选择摘要的无障碍名称。 */
  ariaLabel?: string;
  /** 清除选择回调。 */
  onClear?: () => void;
  /** 批量操作。 */
  children?: React.ReactNode;
}

export const SecLabSelectionBar: React.FC<SecLabSelectionBarProps> = ({
  count,
  label,
  clearLabel,
  clearDisabled = false,
  ariaLabel,
  onClear,
  children,
  className = "",
  ...rest
}) => (
  <div
    className={`sl-selection-bar ${className}`.trim()}
    {...rest}
    data-ui="selection-bar"
  >
    <div
      className="sl-selection-summary"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label={ariaLabel}
      data-slot="selection-summary"
    >
      <span className="sl-selection-label">{label}</span>
      <span className="sl-selection-count">{count}</span>
    </div>
    <div className="sl-selection-actions" data-slot="selection-actions">
      {children}
      {clearLabel && (
        <SecLabButton
          disabled={clearDisabled}
          data-ui="clear-selection"
          onClick={onClear}
        >
          {clearLabel}
        </SecLabButton>
      )}
    </div>
  </div>
);
