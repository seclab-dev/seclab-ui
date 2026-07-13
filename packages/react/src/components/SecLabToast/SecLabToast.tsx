import React from "react";
import { createPortal } from "react-dom";
import { SecLabIcon } from "../SecLabIcon/SecLabIcon";
import "./SecLabToast.css";

export interface ToastItem {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}

export interface SecLabToastProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 通知列表 */
  toasts: ToastItem[];
  /** 关闭事件 */
  onClose?: (id: string) => void;
  /** 关闭按钮的无障碍标签 */
  closeLabel?: string;
}

export const SecLabToast: React.FC<SecLabToastProps> = ({
  toasts = [],
  onClose,
  closeLabel = "Close notification",
  className = "",
  ...rest
}) => {
  const getToastIconName = (type: ToastItem["type"]) => {
    if (type === "success") return "success";
    if (type === "error") return "error";
    if (type === "warning") return "warning";
    return "info";
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`sl-toast-container ${className}`.trim()}
      aria-live="polite"
      aria-relevant="additions"
      {...rest}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`sl-toast-item is-${toast.type}`}
          role={toast.type === "error" ? "alert" : "status"}
        >
          <div className="sl-toast-icon">
            <SecLabIcon name={getToastIconName(toast.type)} size={20} />
          </div>
          <div className="sl-toast-content">
            <h4 className="sl-toast-title">{toast.title}</h4>
            <p className="sl-toast-message">{toast.message}</p>
          </div>
          <button
            type="button"
            className="sl-toast-close"
            aria-label={closeLabel}
            onClick={() => onClose?.(toast.id)}
          >
            &times;
          </button>
        </div>
      ))}
    </div>,
    document.body,
  );
};
