import React from "react";
import "./SecLabTag.css";

export interface SecLabTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 标签类型 */
  type?: "primary" | "success" | "warning" | "danger" | "info" | "default";
  /** 主题风格 */
  effect?: "light" | "plain" | "dark";
}

export const SecLabTag: React.FC<SecLabTagProps> = ({
  type = "default",
  effect = "light",
  className = "",
  children,
  ...rest
}) => {
  return (
    <span
      className={`sl-tag sl-tag--${type} sl-tag--${effect} ${className}`.trim()}
      {...rest}
    >
      {children}
    </span>
  );
};
