import React, { useRef } from "react";
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
  const menuRef = useRef<HTMLElement>(null);
  const handleSelect = (key: string) => {
    onChange?.(key);
    onSelect?.(key);
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const buttons = [...(menuRef.current?.querySelectorAll<HTMLButtonElement>(".sl-menu-item-button") ?? [])];
    const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const index = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (current + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length;
    event.preventDefault(); buttons[index]?.focus();
  };

  return (
    <nav ref={menuRef} className={`sl-menu ${className}`.trim()} aria-label="Menu" onKeyDown={handleKeyDown} {...rest}>
      {items.map((category) => (
        <div key={category.key} className="sl-menu-group">
          <div className="sl-menu-group-title">{category.label}</div>
          <ul className="sl-menu-items">
            {category.children.map((item) => (
              <li
                key={item.key}
                className={`sl-menu-item ${value === item.key ? "is-active" : ""}`.trim()}
              >
                <button type="button" className="sl-menu-item-button" aria-current={value === item.key ? "page" : undefined} onClick={() => handleSelect(item.key)}>
                  <span className="sl-menu-item-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
};
