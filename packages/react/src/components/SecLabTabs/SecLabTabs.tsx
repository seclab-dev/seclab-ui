import React from "react";
import "./SecLabTabs.css";

export interface TabItem {
  label: string;
  name: string;
  disabled?: boolean;
}

export interface SecLabTabsProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  /** 当前选中的标签页 name */
  value?: string;
  /** 标签页列表 */
  tabs: TabItem[];
  /** 标签页改变事件 */
  onTabChange?: (name: string) => void;
  /** 绑定值改变事件 */
  onChange?: (name: string) => void;
}

export const SecLabTabs: React.FC<SecLabTabsProps> = ({
  value = "",
  tabs = [],
  onTabChange,
  onChange,
  className = "",
  ...rest
}) => {
  const handleTabClick = (tab: TabItem) => {
    if (tab.disabled) return;
    onChange?.(tab.name);
    onTabChange?.(tab.name);
  };

  return (
    <div className={`sl-tabs ${className}`.trim()} {...rest}>
      <div className="sl-tabs-nav" role="tablist">
        {tabs.map((tab) => (
          <div
            key={tab.name}
            className={`sl-tabs-item ${value === tab.name ? "is-active" : ""} ${tab.disabled ? "is-disabled" : ""}`.trim()}
            role="tab"
            aria-selected={value === tab.name}
            onClick={() => handleTabClick(tab)}
          >
            {tab.label}
          </div>
        ))}
      </div>
    </div>
  );
};
