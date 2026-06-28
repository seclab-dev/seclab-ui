import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
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
}

export const SecLabSelect: React.FC<SecLabSelectProps> = ({
  value,
  options,
  placeholder = "请选择",
  disabled = false,
  onChange,
  onOptionDisabled,
  className = "",
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedLabel = useMemo(() => {
    const selectedOption = options.find((opt) => opt.value === value);
    return selectedOption ? selectedOption.label : placeholder;
  }, [value, options, placeholder]);

  const calculatePosition = useCallback(() => {
    if (!selectRef.current || !isOpen) return;
    const rect = selectRef.current.getBoundingClientRect();
    setDropdownStyle({
      minWidth: `${rect.width}px`,
      top: `${rect.bottom + window.scrollY + 4}px`,
      left: `${rect.left + window.scrollX}px`,
      position: "absolute",
    });
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      calculatePosition();
    }
  }, [isOpen, calculatePosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
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
          <ul className="sl-select-options" style={dropdownStyle}>
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
          </ul>,
          document.body,
        )}
    </div>
  );
};
