import React from "react";
import "./SecLabSwitch.css";

export interface SecLabSwitchProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "value"
> {
  value: boolean;
  onChange?: (value: boolean) => void;
  activeText?: string;
  disabled?: boolean;
}

export const SecLabSwitch: React.FC<SecLabSwitchProps> = ({
  value,
  onChange,
  activeText = "",
  disabled = false,
  className = "",
  ...rest
}) => {
  const toggle = () => {
    if (disabled) return;
    onChange?.(!value);
  };

  return (
    <button
      type="button"
      className={`sl-switch ${value ? "is-active" : ""} ${disabled ? "is-disabled" : ""} ${className}`.trim()}
      onClick={toggle}
      role="switch"
      aria-checked={value}
      disabled={disabled}
      {...rest}
    >
      <div className="sl-switch-track">
        <div className="sl-switch-handle" />
      </div>
      {activeText && <span className="sl-switch-label">{activeText}</span>}
    </button>
  );
};
