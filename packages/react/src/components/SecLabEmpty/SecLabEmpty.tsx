import React from "react";
import { SecLabIcon } from "../SecLabIcon/SecLabIcon";
import "./SecLabEmpty.css";

export interface SecLabEmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 描述文字 */
  description?: string;
  /** SDL 图标名称 */
  icon?: string;
  /** 自定义图标节点，会覆盖 icon 属性 */
  iconNode?: React.ReactNode;
  /** 额外内容 */
  extra?: React.ReactNode;
  /** 子元素，将作为 description 渲染 */
  children?: React.ReactNode;
}

export const SecLabEmpty: React.FC<SecLabEmptyProps> = ({
  description = "暂无数据",
  icon = "empty",
  iconNode,
  extra,
  className = "",
  children,
  ...rest
}) => {
  return (
    <div className={`sl-empty ${className}`.trim()} {...rest}>
      <div className="sl-empty-icon">
        {iconNode || <SecLabIcon name={icon} size={48} />}
      </div>
      <p className="sl-empty-description">{children || description}</p>
      {extra && <div className="sl-empty-extra">{extra}</div>}
    </div>
  );
};
