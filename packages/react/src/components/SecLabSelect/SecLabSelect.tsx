import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { computeFloatingPosition } from "../../internal/floating-position";
import "./SecLabSelect.css";

export interface SecLabSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  hint?: string;
}

export interface SecLabSelectProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "value" | "onChange"
> {
  /** 绑定值 */
  value: string | number | null;
  /** 选项列表 */
  options: SecLabSelectOption[];
  /** 占位符 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 改变值时的回调 */
  onChange?: (value: string | number | null) => void;
  /** 禁用选项被点击时的回调 */
  onOptionDisabled?: (option: SecLabSelectOption) => void;
  /** 下拉列表滚动时的回调 */
  onDropdownScroll?: (event: React.UIEvent<HTMLUListElement>) => void;
  /** 下拉列表滚动到底部附近时的回调 */
  onDropdownReachBottom?: (event: React.UIEvent<HTMLUListElement>) => void;
  /** 下拉列表底部内容 */
  dropdownFooter?: React.ReactNode;
}

const SCROLL_BOTTOM_THRESHOLD = 24;

export const SecLabSelect: React.FC<SecLabSelectProps> = ({
  value,
  options,
  placeholder = "请选择",
  disabled = false,
  onChange,
  onOptionDisabled,
  onDropdownScroll,
  onDropdownReachBottom,
  dropdownFooter,
  className = "",
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPlacement, setDropdownPlacement] = useState<
    "top" | "bottom"
  >("bottom");
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({
    visibility: "hidden",
  });
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const selectedLabel = useMemo(() => {
    const selectedOption = options.find((opt) => opt.value === value);
    return selectedOption ? selectedOption.label : placeholder;
  }, [value, options, placeholder]);

  const calculatePosition = useCallback(() => {
    if (!selectRef.current || !dropdownRef.current || !isOpen) return;
    const position = computeFloatingPosition({
      anchor: selectRef.current,
      floating: dropdownRef.current,
      matchWidth: true,
    });
    setDropdownPlacement(position.placement);
    setDropdownStyle(position.style);
  }, [isOpen]);

  useLayoutEffect(() => {
    if (isOpen) {
      calculatePosition();
    } else {
      setDropdownStyle({ visibility: "hidden" });
    }
  }, [isOpen, calculatePosition, options.length, dropdownFooter]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node) &&
        (!dropdownRef.current ||
          !dropdownRef.current.contains(event.target as Node))
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    window.addEventListener("resize", calculatePosition);
    window.addEventListener("scroll", calculatePosition, true);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("resize", calculatePosition);
      window.removeEventListener("scroll", calculatePosition, true);
    };
  }, [calculatePosition]);

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  const selectOption = (option: SecLabSelectOption) => {
    if (disabled) return;
    if (option.disabled) {
      onOptionDisabled?.(option);
      return;
    }
    onChange?.(option.value);
    setIsOpen(false);
  };

  const handleDropdownScroll = (event: React.UIEvent<HTMLUListElement>) => {
    onDropdownScroll?.(event);

    const target = event.currentTarget;
    const distanceToBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight;
    if (distanceToBottom <= SCROLL_BOTTOM_THRESHOLD) {
      onDropdownReachBottom?.(event);
    }
  };

  return (
    <div
      className={`sl-select ${isOpen ? "is-open" : ""} ${disabled ? "is-disabled" : ""} ${className}`.trim()}
      ref={selectRef}
      {...rest}
    >
      <div className="sl-select-trigger" onClick={toggleDropdown}>
        <span className="sl-select-label">{selectedLabel}</span>
        <span className="sl-select-arrow"></span>
      </div>

      {isOpen &&
        createPortal(
          <ul
            ref={dropdownRef}
            className="sl-select-options"
            style={dropdownStyle}
            data-placement={dropdownPlacement}
            onScroll={handleDropdownScroll}
          >
            {options.map((option) => {
              const isSelected = value === option.value;
              return (
                <li
                  key={option.value}
                  className={`sl-select-option ${isSelected ? "selected" : ""} ${option.disabled ? "disabled" : ""}`.trim()}
                  title={option.hint}
                  onClick={() => selectOption(option)}
                >
                  {option.label}
                </li>
              );
            })}
            {dropdownFooter ? (
              <li className="sl-select-footer">{dropdownFooter}</li>
            ) : null}
          </ul>,
          document.body,
        )}
    </div>
  );
};
