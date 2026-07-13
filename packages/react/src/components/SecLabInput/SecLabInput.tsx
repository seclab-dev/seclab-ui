import React, { useState } from "react";
import { SecLabIcon } from "../SecLabIcon/SecLabIcon";
import "./SecLabInput.css";

export interface SecLabInputProps<
  T extends string | number | null = string,
> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "value" | "onChange" | "onFocus" | "onBlur"
> {
  /** 绑定值 */
  value?: T;
  /** 输入类型 */
  type?: "text" | "password" | "textarea" | "number" | "datetime-local";
  /** 占位符 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否只读 */
  readonly?: boolean;
  readOnly?: boolean;
  /** 最大长度 */
  maxlength?: number;
  maxLength?: number;
  /** 行数 (仅 textarea 有效) */
  rows?: number;
  /** 是否显示密码切换按钮 */
  showPassword?: boolean;
  /** 最小值 (仅 number 有效) */
  min?: number | string;
  /** 最大值 (仅 number 有效) */
  max?: number | string;
  /** 步长 (仅 number 有效) */
  step?: number | string;
  /** 自动填充属性 */
  autocomplete?: string;
  autoComplete?: string;
  /** 值改变事件 */
  onChange?: (value: T) => void;
  invalid?: boolean;
  inputId?: string;
  ariaDescribedby?: string;
  /** focus 事件 */
  onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  /** blur 事件 */
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export function SecLabInput<T extends string | number | null = string>({
  value,
  type = "text",
  placeholder,
  disabled = false,
  readonly,
  readOnly,
  maxlength,
  maxLength,
  rows = 3,
  showPassword = false,
  min,
  max,
  step,
  autocomplete,
  autoComplete,
  onChange,
  onFocus,
  onBlur,
  invalid = false,
  inputId,
  ariaDescribedby,
  className = "",
  ...rest
}: SecLabInputProps<T>) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const nextValue = (
      type === "number"
        ? event.target.value === ""
          ? null
          : Number(event.target.value)
        : event.target.value
    ) as T;
    onChange?.(nextValue);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const finalReadOnly = readonly ?? readOnly;
  const finalMaxLength = maxlength ?? maxLength;
  const finalAutoComplete = autocomplete ?? autoComplete;

  const inputType = type === "password" && isPasswordVisible ? "text" : type;

  const displayValue =
    value === null || value === undefined ? "" : String(value);

  return (
    <div
      className={`sl-input-wrapper is-${type} ${disabled ? "is-disabled" : ""} ${className}`.trim()}
      {...rest}
    >
      {type === "textarea" ? (
        <textarea
          className="sl-textarea"
          id={inputId}
          aria-describedby={ariaDescribedby}
          value={displayValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={finalReadOnly}
          maxLength={finalMaxLength}
          rows={rows}
          onChange={handleInput}
          onFocus={onFocus}
          onBlur={onBlur}
          aria-invalid={invalid || undefined}
        />
      ) : (
        <div className="sl-input-inner-wrapper">
          <input
            className="sl-input"
            id={inputId}
            aria-describedby={ariaDescribedby}
            type={inputType}
            value={displayValue}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={finalReadOnly}
            maxLength={finalMaxLength}
            min={min}
            max={max}
            step={step}
            autoComplete={finalAutoComplete}
            onChange={handleInput}
            onFocus={onFocus}
            onBlur={onBlur}
            aria-invalid={invalid || undefined}
          />
          {showPassword && type === "password" && (
            <button
              type="button"
              className="sl-input-password-toggle"
              onClick={togglePasswordVisibility}
              disabled={disabled}
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
              aria-pressed={isPasswordVisible}
            >
              <SecLabIcon
                name={isPasswordVisible ? "eye-off" : "lock"}
                size={16}
              />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
