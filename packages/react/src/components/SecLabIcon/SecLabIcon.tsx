import React, { useMemo } from "react";
import { getIcon } from "@seclab-dev/icons";
import type { IconNamespace } from "@seclab-dev/icons";
import "./SecLabIcon.css";

export interface SecLabIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name?: string | null;
  namespace?: IconNamespace;
  size?: number | string;
  label?: string;
  decorative?: boolean;
}

export const SecLabIcon: React.FC<SecLabIconProps> = ({
  name = "fallback",
  namespace = "common",
  size = 24,
  label = "",
  decorative = true,
  className = "",
  style,
  ...rest
}) => {
  const iconName = useMemo(() => {
    const normalized = (name ?? "").trim().toLowerCase();
    return /^[a-z0-9-]+$/.test(normalized) ? normalized : "fallback";
  }, [name]);

  const iconSource = useMemo(() => {
    return getIcon(iconName, namespace);
  }, [iconName, namespace]);

  const iconSize = useMemo(() => {
    return typeof size === "number" ? `${size}px` : size;
  }, [size]);

  const combinedStyle = {
    "--sl-icon-size": iconSize,
    ...style,
  } as React.CSSProperties;

  return (
    <span
      className={`sl-icon ${className}`.trim()}
      style={combinedStyle}
      aria-hidden={decorative ? "true" : undefined}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label || iconName}
      dangerouslySetInnerHTML={{ __html: iconSource }}
      {...rest}
    />
  );
};
