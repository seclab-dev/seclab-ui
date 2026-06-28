import React from "react";
import "./SecLabCheckbox.css";

export interface SecLabCheckboxProps extends Omit<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  "onChange"
> {
  /** 绑定值 */
  checked?: boolean;
  /** 禁用状态 */
  disabled?: boolean;
  /** 改变事件 */
  onChange?: (checked: boolean) => void;
}

export const SecLabCheckbox: React.FC<SecLabCheckboxProps> = ({
  checked = false,
  disabled = false,
  onChange,
  className = "",
  children,
  ...rest
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onChange?.(e.target.checked);
  };

  return (
    <label
      className={`sl-checkbox ${checked ? "is-active" : ""} ${
        disabled ? "is-disabled" : ""
      } ${className}`.trim()}
      {...rest}
    >
      <span className="sl-checkbox-input">
        <input
          type="checkbox"
          className="sl-checkbox-original"
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
        />
        <span className="sl-checkbox-inner" />
      </span>
      {children && <span className="sl-checkbox-label">{children}</span>}
    </label>
  );
};
