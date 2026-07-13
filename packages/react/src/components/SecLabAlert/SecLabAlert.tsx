import React, { useState } from "react";
import { SecLabIcon } from "../SecLabIcon/SecLabIcon";
import "./SecLabAlert.css";

export interface SecLabAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 警告标题 */
  title?: string;
  /** 警告描述 (如果有 title, 则在下方显示) */
  description?: string;
  /** 警告类型 */
  type?: "success" | "warning" | "error" | "info";
  /** 是否显示图标 */
  showIcon?: boolean;
  /** 是否可关闭 */
  closable?: boolean;
  /** 关闭事件 */
  onClose?: () => void;
  /** 关闭按钮的无障碍标签 */
  closeLabel?: string;
  /** 子元素，将作为 description 渲染 */
  children?: React.ReactNode;
}

export const SecLabAlert: React.FC<SecLabAlertProps> = ({
  title,
  description,
  type = "info",
  showIcon = false,
  closable = false,
  onClose,
  closeLabel = "Close alert",
  className = "",
  children,
  ...rest
}) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    setVisible(false);
    onClose?.();
  };

  const getAlertIcon = (t: "success" | "warning" | "error" | "info") => {
    if (t === "success") return "success";
    if (t === "error") return "error";
    if (t === "warning") return "warning";
    return "info";
  };

  return (
    <div
      className={`sl-alert is-${type} ${className}`.trim()}
      role="alert"
      {...rest}
    >
      {showIcon && (
        <div className="sl-alert-icon">
          <SecLabIcon name={getAlertIcon(type)} size={16} />
        </div>
      )}
      <div className="sl-alert-content">
        {title && <h4 className="sl-alert-title">{title}</h4>}
        <div className="sl-alert-description">{children || description}</div>
      </div>
      {closable && (
        <button
          type="button"
          className="sl-alert-close"
          aria-label={closeLabel}
          onClick={handleClose}
        >
          ×
        </button>
      )}
    </div>
  );
};
