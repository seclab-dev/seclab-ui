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
}

export const SecLabToast: React.FC<SecLabToastProps> = ({
  toasts = [],
  onClose,
  className = "",
  ...rest
}) => {
  const getToastIconName = (type: ToastItem["type"]) => {
    if (type === "success") return "success";
    if (type === "error") return "error";
    if (type === "warning") return "warning";
    return "info";
  };

  const handleClose = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onClose?.(id);
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className={`sl-toast-container ${className}`.trim()} {...rest}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`sl-toast-item is-${toast.type}`}
          role="alert"
          onClick={() => onClose?.(toast.id)}
        >
          <div className="sl-toast-icon">
            <SecLabIcon name={getToastIconName(toast.type)} size={20} />
          </div>
          <div className="sl-toast-content">
            <h4 className="sl-toast-title">{toast.title}</h4>
            <p className="sl-toast-message">{toast.message}</p>
          </div>
          <button
            className="sl-toast-close"
            onClick={(e) => handleClose(e, toast.id)}
          >
            &times;
          </button>
        </div>
      ))}
    </div>,
    document.body,
  );
};
