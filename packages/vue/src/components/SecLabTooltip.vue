<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";

/**
 * @file SecLabTooltip.vue
 * @description SecLab 平台自研文字提示组件，严格遵循 SDL 设计规范。
 */

type TooltipPosition = "top" | "bottom" | "left" | "right";

const props = withDefaults(
  defineProps<{
    /** 提示文字内容 */
    text: string;
    /** 显示位置 */
    position?: TooltipPosition;
    /** 显示延迟 (ms) */
    delay?: number;
  }>(),
  {
    position: "top",
    delay: 200,
  },
);

const isVisible = ref(false);
const tooltipStyle = ref({});
const triggerRef = ref<HTMLElement | null>(null);
const tooltipRef = ref<HTMLElement | null>(null);
const actualPosition = ref<TooltipPosition>(props.position);

let timer: number | undefined = undefined;

// --- 定位逻辑 ---

const calculatePosition = () => {
  if (!triggerRef.value || !tooltipRef.value) return;

  const triggerRect = triggerRef.value.getBoundingClientRect();
  const tooltipRect = tooltipRef.value.getBoundingClientRect();

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const margin = 5;

  let top = 0;
  let left = 0;

  const triggerCenterY = triggerRect.top + triggerRect.height / 2;
  const triggerCenterX = triggerRect.left + triggerRect.width / 2;
  const offset = 8;

  let placement = props.position;
  const fits = (candidate: TooltipPosition) => {
    if (candidate === "top")
      return triggerRect.top - tooltipRect.height - offset >= margin;
    if (candidate === "bottom")
      return (
        triggerRect.bottom + tooltipRect.height + offset <=
        viewportHeight - margin
      );
    if (candidate === "left")
      return triggerRect.left - tooltipRect.width - offset >= margin;
    return (
      triggerRect.right + tooltipRect.width + offset <= viewportWidth - margin
    );
  };
  const opposite: Record<TooltipPosition, TooltipPosition> = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  };
  if (!fits(placement) && fits(opposite[placement]))
    placement = opposite[placement];
  actualPosition.value = placement;

  switch (placement) {
    case "top":
    case "bottom":
      top =
        placement === "top"
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
        placement === "left"
          ? triggerRect.left - tooltipRect.width - offset
          : triggerRect.right + offset;
      break;
  }

  top = Math.min(
    Math.max(top, margin),
    Math.max(margin, viewportHeight - margin - tooltipRect.height),
  );
  left = Math.min(
    Math.max(left, margin),
    Math.max(margin, viewportWidth - margin - tooltipRect.width),
  );
  tooltipStyle.value = {
    position: "fixed",
    top: `${top}px`,
    left: `${left}px`,
  };
};

// --- 悬浮控制逻辑 ---

const handleMouseEnter = () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    isVisible.value = true;
    nextTick(() => {
      calculatePosition();
    });
  }, props.delay) as unknown as number;
};

const handleMouseLeave = () => {
  clearTimeout(timer);
  isVisible.value = false;
};

onMounted(() => {
  window.addEventListener("resize", calculatePosition);
  window.addEventListener("scroll", calculatePosition, true);
});

onUnmounted(() => {
  clearTimeout(timer);
  window.removeEventListener("resize", calculatePosition);
  window.removeEventListener("scroll", calculatePosition, true);
});
</script>

<template>
  <div
    class="sl-tooltip-wrapper"
    ref="triggerRef"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <slot></slot>
    <teleport to="body">
      <Transition name="sl-tooltip-fade">
        <div
          v-if="isVisible && text"
          ref="tooltipRef"
          class="sl-tooltip-content"
          :style="tooltipStyle"
          :data-position="actualPosition"
        >
          {{ text }}
          <span class="sl-tooltip-arrow" :data-position="actualPosition"></span>
        </div>
      </Transition>
    </teleport>
  </div>
</template>

<style scoped>
.sl-tooltip-wrapper {
  display: inline-block;
}

.sl-tooltip-content {
  z-index: var(--sdl-z-index-modal); /* 使用规范的 Z-Index */
  position: fixed;
  background-color: var(--sdl-bg-panel);
  color: var(--sdl-text-primary);
  padding: var(--sdl-space-1) var(--sdl-space-3);
  border-radius: var(--sdl-radius-sm);
  font-size: var(--sdl-font-caption);
  white-space: nowrap;
  box-shadow: var(--sdl-shadow-panel);
  border: 1px solid var(--sdl-border-strong);
  pointer-events: none;
  line-height: 1.6;
}

.sl-tooltip-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-width: 5px;
  border-style: solid;
}

.sl-tooltip-arrow[data-position="top"] {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-color: var(--sdl-border-strong) transparent transparent transparent;
}

.sl-tooltip-arrow[data-position="bottom"] {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-color: transparent transparent var(--sdl-border-strong) transparent;
}

.sl-tooltip-arrow[data-position="left"] {
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  border-color: transparent transparent transparent var(--sdl-border-strong);
}

.sl-tooltip-arrow[data-position="right"] {
  top: 50%;
  right: 100%;
  transform: translateY(-50%);
  border-color: transparent var(--sdl-border-strong) transparent transparent;
}

.sl-tooltip-fade-enter-active,
.sl-tooltip-fade-leave-active {
  transition: opacity 0.2s ease;
}

.sl-tooltip-fade-enter-from,
.sl-tooltip-fade-leave-to {
  opacity: 0;
}
</style>
