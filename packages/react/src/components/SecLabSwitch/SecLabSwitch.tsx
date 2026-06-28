import React from "react";
import "./SecLabSwitch.css";

export interface SecLabSwitchProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
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
    <div
      className={`sl-switch ${value ? "is-active" : ""} ${disabled ? "is-disabled" : ""} ${className}`.trim()}
      onClick={toggle}
      {...rest}
    >
      <div className="sl-switch-track">
        <div className="sl-switch-handle" />
      </div>
      {activeText && <span className="sl-switch-label">{activeText}</span>}
    </div>
  );
};
