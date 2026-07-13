import React, { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { activateModalLifecycle } from "../../internal/modal-lifecycle";
import "./SecLabModal.css";

export interface SecLabModalProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 是否可见 */
  visible: boolean;
  /** 标题 */
  title: string;
  /** 消息内容 */
  message: string;
  /** 确认按钮文案 */
  confirmText?: string;
  /** 取消按钮文案 */
  cancelText?: string;
  /** 确认按钮类型 */
  type?: "primary" | "danger" | "warning";
  /** 确认回调 */
  onConfirm?: () => void;
  /** 取消回调 */
  onCancel?: () => void;
}

export const SecLabModal: React.FC<SecLabModalProps> = ({
  visible,
  title,
  message,
  confirmText = "确定",
  cancelText = "取消",
  type = "primary",
  onConfirm,
  onCancel,
  className = "",
  ...rest
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useEffect(() => {
    if (!visible || !cardRef.current) return;
    return activateModalLifecycle(cardRef.current, () => onCancel?.());
  }, [visible, onCancel]);
  if (!visible) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onCancel?.();
    }
  };

  return createPortal(
    <div
      className={`sl-modal-overlay ${className}`.trim()}
      onClick={handleOverlayClick}
      role="presentation"
      {...rest}
    >
      <div
        ref={cardRef}
        className="sl-modal-card"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        {/* 头部标题栏 */}
        <div className="sl-modal-header" data-slot="header">
          <h3 id={titleId} className="sl-modal-title">
            {title}
          </h3>
        </div>

        {/* 消息内容 */}
        <div className="sl-modal-body">
          <p className="sl-modal-message">{message}</p>
        </div>

        {/* 底部操作按钮栏 */}
        <div className="sl-modal-footer" data-slot="footer">
          <button
            type="button"
            className="sl-modal-btn is-cancel"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`sl-modal-btn is-${type}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
