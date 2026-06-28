import React from "react";
import "./SecLabMenu.css";

export interface MenuItem {
  key: string;
  label: string;
}

export interface MenuCategory {
  key: string;
  label: string;
  children: MenuItem[];
}

export interface SecLabMenuProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "onChange" | "onSelect"
> {
  /** 当前选中的菜单项 key */
  value?: string;
  /** 菜单项列表 (带分组) */
  items: MenuCategory[];
  /** 选中事件 */
  onSelect?: (key: string) => void;
  /** 绑定值改变事件 */
  onChange?: (key: string) => void;
}

export const SecLabMenu: React.FC<SecLabMenuProps> = ({
  value = "",
  items = [],
  onSelect,
  onChange,
  className = "",
  ...rest
}) => {
  const handleSelect = (key: string) => {
    onChange?.(key);
    onSelect?.(key);
  };

  return (
    <nav className={`sl-menu ${className}`.trim()} role="menu" {...rest}>
      {items.map((category) => (
        <div key={category.key} className="sl-menu-group">
          <div className="sl-menu-group-title">{category.label}</div>
          <ul className="sl-menu-items">
            {category.children.map((item) => (
              <li
                key={item.key}
                className={`sl-menu-item ${value === item.key ? "is-active" : ""}`.trim()}
                role="menuitem"
                onClick={() => handleSelect(item.key)}
              >
                <span className="sl-menu-item-label">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
};
