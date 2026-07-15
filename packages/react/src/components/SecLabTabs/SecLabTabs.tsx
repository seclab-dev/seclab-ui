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
  value: string;
  /** 标签页列表 */
  tabs: TabItem[];
  /** 绑定值改变事件 */
  onChange?: (name: string) => void;
}

export const SecLabTabs: React.FC<SecLabTabsProps> = ({
  value,
  tabs = [],
  onChange,
  className = "",
  ...rest
}) => {
  const handleTabClick = (tab: TabItem) => {
    if (tab.disabled) return;
    onChange?.(tab.name);
  };
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const enabled = tabs
      .map((tab, tabIndex) => ({ tab, tabIndex }))
      .filter(({ tab }) => !tab.disabled);
    const current = enabled.findIndex(({ tabIndex }) => tabIndex === index);
    const target =
      event.key === "Home"
        ? enabled[0]
        : event.key === "End"
          ? enabled.at(-1)
          : enabled[
              (current +
                (event.key === "ArrowRight" ? 1 : -1) +
                enabled.length) %
                enabled.length
            ];
    if (target) {
      handleTabClick(target.tab);
      document
        .querySelector<HTMLElement>(`[data-tab-name="${target.tab.name}"]`)
        ?.focus();
    }
  };

  return (
    <div className={`sl-tabs ${className}`.trim()} {...rest}>
      <div className="sl-tabs-nav" role="tablist">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.name}
            className={`sl-tabs-item ${value === tab.name ? "is-active" : ""} ${tab.disabled ? "is-disabled" : ""}`.trim()}
            role="tab"
            aria-selected={value === tab.name}
            tabIndex={value === tab.name ? 0 : -1}
            disabled={tab.disabled}
            data-tab-name={tab.name}
            onClick={() => handleTabClick(tab)}
            onKeyDown={(event) => handleKeyDown(event, tabs.indexOf(tab))}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
