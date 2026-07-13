import React from "react";
import "./SecLabFormItem.css";

export interface SecLabFormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 标签文本 */
  label?: string;
  /** 是否必填 (显示红星) */
  required?: boolean;
  /** 提示文本 */
  hint?: string;
  htmlFor?: string;
  error?: string;
  hintId?: string;
}

export const SecLabFormItem: React.FC<SecLabFormItemProps> = ({
  label,
  required = false,
  hint,
  htmlFor,
  error,
  hintId,
  className = "",
  children,
  ...rest
}) => {
  return (
    <div className={`sl-form-item ${className}`.trim()} {...rest}>
      {label && (
        <label className="sl-form-item-label" htmlFor={htmlFor}>
          {required && <span className="sl-form-item-required">*</span>}
          {label}
        </label>
      )}
      <div className="sl-form-item-content">
        {children}
        {hint && (
          <div id={hintId} className="sl-form-item-hint">
            {hint}
          </div>
        )}
        {error && (
          <div className="sl-form-item-error" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};
