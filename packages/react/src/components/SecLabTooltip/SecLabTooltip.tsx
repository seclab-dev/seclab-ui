import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import "./SecLabTooltip.css";

export type TooltipPosition = "top" | "bottom" | "left" | "right";

export interface SecLabTooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 提示文字内容 */
  text: string;
  /** 显示位置 */
  position?: TooltipPosition;
  /** 显示延迟 (ms) */
  delay?: number;
  /** 是否禁用 */
  disabled?: boolean;
  /** 子元素 */
  children: React.ReactNode;
}

export const SecLabTooltip: React.FC<SecLabTooltipProps> = ({
  text,
  position = "top",
  delay = 200,
  children,
  disabled = false,
  className = "",
  ...rest
}) => {
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const timerRef = useRef<any>(null);
  const animationTimerRef = useRef<any>(null);

  const calculatePosition = useCallback(
    (node: HTMLDivElement) => {
      if (!triggerRef.current || !node) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = node.getBoundingClientRect();

      const viewportWidth = window.innerWidth;
      const margin = 5;

      let top = 0;
      let left = 0;

      const triggerCenterY = triggerRect.top + triggerRect.height / 2;
      const triggerCenterX = triggerRect.left + triggerRect.width / 2;
      const offset = 8;

      switch (position) {
        case "top":
        case "bottom":
          top =
            position === "top"
              ? triggerRect.top - tooltipRect.height - offset
              : triggerRect.bottom + offset;
          left = triggerCenterX - tooltipRect.width / 2;

          if (left < margin) left = margin;
          const rightEdge = left + tooltipRect.width;
          const viewportRight = viewportWidth - margin;

          if (rightEdge > viewportRight) {
            left = Math.max(margin, left - (rightEdge - viewportRight));
          }
          break;

        case "left":
        case "right":
          top = triggerCenterY - tooltipRect.height / 2;
          left =
            position === "left"
              ? triggerRect.left - tooltipRect.width - offset
              : triggerRect.right + offset;
          break;
      }

      setTooltipStyle({
        top: `${top + window.scrollY}px`,
        left: `${left + window.scrollX}px`,
      });
    },
    [position],
  );

  const setTooltipRef = useCallback(
    (node: HTMLDivElement | null) => {
      tooltipRef.current = node;
      if (node) {
        calculatePosition(node);
      }
    },
    [calculatePosition],
  );

  const handleMouseEnter = () => {
    if (disabled) return;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (animationTimerRef.current)
      window.clearTimeout(animationTimerRef.current);

    if (isRendered) {
      setIsVisible(true);
    } else {
      timerRef.current = window.setTimeout(() => {
        setIsRendered(true);
        // wait a tiny bit to trigger CSS transition
        timerRef.current = window.setTimeout(() => {
          setIsVisible(true);
        }, 20);
      }, delay);
    }
  };

  const handleMouseLeave = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (animationTimerRef.current)
      window.clearTimeout(animationTimerRef.current);

    setIsVisible(false);
    animationTimerRef.current = window.setTimeout(() => {
      setIsRendered(false);
    }, 200);
  };

  // recalculate position on scroll or resize when visible
  useEffect(() => {
    if (!isVisible) return;

    const handleUpdate = () => {
      if (tooltipRef.current) {
        calculatePosition(tooltipRef.current);
      }
    };

    window.addEventListener("resize", handleUpdate);
    window.addEventListener("scroll", handleUpdate, { passive: true });

    return () => {
      window.removeEventListener("resize", handleUpdate);
      window.removeEventListener("scroll", handleUpdate);
    };
  }, [isVisible, calculatePosition]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (animationTimerRef.current)
        window.clearTimeout(animationTimerRef.current);
    };
  }, []);

  return (
    <div
      className={`sl-tooltip-wrapper ${className}`.trim()}
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {children}
      {isRendered &&
        text &&
        !disabled &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={setTooltipRef}
            className={`sl-tooltip-content ${isVisible ? "is-visible" : ""}`.trim()}
            style={tooltipStyle}
            data-position={position}
          >
            {text}
            <span className="sl-tooltip-arrow" data-position={position}></span>
          </div>,
          document.body,
        )}
    </div>
  );
};
