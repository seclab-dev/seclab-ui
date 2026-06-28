import React from "react";
import "./SecLabButton.css";

export interface SecLabButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> {
  type?: "primary" | "secondary" | "danger" | "warning" | "info";
  size?: "small" | "default" | "large";
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
}

export const SecLabButton: React.FC<SecLabButtonProps> = ({
  type = "secondary",
  size = "default",
  disabled = false,
  loading = false,
  onClick,
  className = "",
  children,
  ...rest
}) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    onClick?.(event);
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={`sl-button sl-button--${type} sl-button--${size} ${loading ? "is-loading" : ""} ${className}`.trim()}
      disabled={isDisabled}
      type="button"
      onClick={handleClick}
      {...rest}
    >
      {loading && (
        <span className="sl-button-loading-icon">
          <svg className="sl-spinner" viewBox="0 0 50 50">
            <circle
              className="path"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="5"
            />
          </svg>
        </span>
      )}
      <span className="sl-button-content">{children}</span>
    </button>
  );
};
