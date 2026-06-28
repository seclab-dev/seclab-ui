import React, { useContext } from "react";
import { BreadcrumbContext } from "../SecLabBreadcrumb/SecLabBreadcrumb";
import "./SecLabBreadcrumbItem.css";

export interface SecLabBreadcrumbItemProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 子元素，面包屑项内容 */
  children?: React.ReactNode;
}

export const SecLabBreadcrumbItem: React.FC<SecLabBreadcrumbItemProps> = ({
  className = "",
  children,
  ...rest
}) => {
  const separator = useContext(BreadcrumbContext);

  return (
    <span className={`sl-breadcrumb-item ${className}`.trim()} {...rest}>
      <span className="sl-breadcrumb-label">{children}</span>
      <span className="sl-breadcrumb-separator" role="presentation">
        {separator}
      </span>
    </span>
  );
};
