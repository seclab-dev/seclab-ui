import React from "react";
import "./SecLabLoading.css";

export interface SecLabLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 是否显示加载中 */
  loading: boolean;
  /** 提示文字 */
  text?: string;
  /** 是否覆盖父容器 */
  cover?: boolean;
}

export const SecLabLoading: React.FC<SecLabLoadingProps> = ({
  loading,
  text,
  cover = false,
  className = "",
  children,
  ...rest
}) => {
  return (
    <div
      className={`sl-loading-host ${cover ? "is-cover" : ""} ${
        loading ? "is-loading" : ""
      } ${className}`.trim()}
      {...rest}
    >
      {children}
      {loading && (
        <div className="sl-loading-mask">
          <div className="sl-loading-spinner">
            <svg className="sl-spinner" viewBox="0 0 50 50">
              <circle
                className="path"
                cx="25"
                cy="25"
                r="20"
                fill="none"
                strokeWidth="5"
              />
            </svg>
            {text && <p className="sl-loading-text">{text}</p>}
          </div>
        </div>
      )}
    </div>
  );
};
