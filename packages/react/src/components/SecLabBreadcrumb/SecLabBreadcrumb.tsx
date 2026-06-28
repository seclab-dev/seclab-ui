import React, { createContext } from "react";
import "./SecLabBreadcrumb.css";

export const BreadcrumbContext = createContext<string>("/");

export interface SecLabBreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /** 分隔符 */
  separator?: string;
}

export const SecLabBreadcrumb: React.FC<SecLabBreadcrumbProps> = ({
  separator = "/",
  className = "",
  children,
  ...rest
}) => {
  return (
    <BreadcrumbContext.Provider value={separator}>
      <nav
        className={`sl-breadcrumb ${className}`.trim()}
        aria-label="Breadcrumb"
        {...rest}
      >
        {children}
      </nav>
    </BreadcrumbContext.Provider>
  );
};
