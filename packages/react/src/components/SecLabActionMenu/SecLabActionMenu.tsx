import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { SecLabIcon } from "../SecLabIcon/SecLabIcon";
import { SecLabTooltip } from "../SecLabTooltip/SecLabTooltip";
import "./SecLabActionMenu.css";

export interface SecLabAction {
  label: string;
  class?: string;
  className?: string;
  icon?: string;
  disabled?: boolean;
  tooltip?: string;
  handler: () => void;
}

export interface SecLabActionMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 操作列表 */
  actions: SecLabAction[];
  /** 按钮文案 */
  label?: string;
  /** 是否禁用菜单入口 */
  disabled?: boolean;
  /** 菜单项默认图标 */
  defaultIcon?: string;
}

export const SecLabActionMenu: React.FC<SecLabActionMenuProps> = ({
  actions,
  label = "操作",
  disabled = false,
  defaultIcon = "settings",
  className = "",
  ...rest
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updateDropdownPosition = useCallback(() => {
    if (!menuRef.current || !showMenu) return;
    const rect = menuRef.current.getBoundingClientRect();
    setDropdownStyle({
      top: `${rect.bottom + window.scrollY + 4}px`,
      left: `${rect.right + window.scrollX}px`,
      transform: "translateX(-100%)",
      position: "absolute",
    });
  }, [showMenu]);

  useEffect(() => {
    if (showMenu) {
      updateDropdownPosition();
    }
  }, [showMenu, updateDropdownPosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        (!dropdownRef.current || !dropdownRef.current.contains(target))
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    window.addEventListener("resize", updateDropdownPosition);
    window.addEventListener("scroll", updateDropdownPosition, true);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition, true);
    };
  }, [updateDropdownPosition]);

  const toggleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (disabled) return;
    setShowMenu((prev) => !prev);
  };

  const handleActionClick = (
    action: SecLabAction,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    if (action.disabled) return;
    action.handler();
    setShowMenu(false);
  };

  return (
    <div
      className={`sl-action-menu ${className}`.trim()}
      ref={menuRef}
      {...rest}
    >
      <button
        type="button"
        className="sl-action-btn"
        disabled={disabled}
        onClick={toggleMenu}
      >
        <SecLabIcon className="sl-action-btn-icon" name="settings" size={16} />
        <span className="sl-action-btn-text">{label}</span>
      </button>

      {showMenu &&
        createPortal(
          <div
            ref={dropdownRef}
            className="sl-dropdown"
            style={dropdownStyle}
            onClick={(e) => e.stopPropagation()}
          >
            {actions.map((action, index) => {
              const itemClass = (action.className || action.class || "").trim();
              const isDisabled = action.disabled;
              const buttonNode = (
                <button
                  type="button"
                  className={`sl-dropdown-item ${itemClass} ${isDisabled ? "is-disabled" : ""}`.trim()}
                  disabled={isDisabled}
                  onClick={(e) => handleActionClick(action, e)}
                >
                  <SecLabIcon
                    className="sl-dropdown-icon"
                    name={action.icon || defaultIcon}
                    size={16}
                  />
                  <span className="sl-dropdown-label">{action.label}</span>
                </button>
              );

              return (
                <SecLabTooltip
                  key={index}
                  text={action.tooltip || ""}
                  disabled={!action.tooltip}
                  position="right"
                  className="sl-dropdown-tooltip-wrapper"
                >
                  {buttonNode}
                </SecLabTooltip>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
};
