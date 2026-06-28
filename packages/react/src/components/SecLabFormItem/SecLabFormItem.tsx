import React from "react";
import "./SecLabFormItem.css";

export interface SecLabFormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 标签文本 */
  label?: string;
  /** 是否必填 (显示红星) */
  required?: boolean;
  /** 提示文本 */
  hint?: string;
}

export const SecLabFormItem: React.FC<SecLabFormItemProps> = ({
  label,
  required = false,
  hint,
  className = "",
  children,
  ...rest
}) => {
  return (
    <div className={`sl-form-item ${className}`.trim()} {...rest}>
      {label && (
        <label className="sl-form-item-label">
          {required && <span className="sl-form-item-required">*</span>}
          {label}
        </label>
      )}
      <div className="sl-form-item-content">
        {children}
        {hint && <div className="sl-form-item-hint">{hint}</div>}
      </div>
    </div>
  );
};
