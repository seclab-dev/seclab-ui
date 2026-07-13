<script setup lang="ts">
/**
 * @file SecLabToast.vue
 * @description SecLab 平台自研通知提示组件，支持多种类型和自动消失。
 * 注意：此组件通常配合 ToastStore 使用，直接渲染列表。
 */

import SecLabIcon from "./SecLabIcon.vue";

export interface ToastItem {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}

defineProps<{
  /** 通知列表 */
  toasts: ToastItem[];
  /** 关闭按钮的无障碍标签 */
  closeLabel?: string;
}>();

const emit = defineEmits<{
  (e: "close", id: string): void;
}>();

function toastIcon(type: ToastItem["type"]) {
  if (type === "success") return "success";
  if (type === "error") return "error";
  if (type === "warning") return "warning";
  return "info";
}
</script>

<template>
  <Teleport to="body">
    <div
      class="sl-toast-container"
      aria-live="polite"
      aria-relevant="additions"
    >
      <TransitionGroup name="sl-toast-list">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="sl-toast-item"
          :class="[`is-${toast.type}`]"
          :role="toast.type === 'error' ? 'alert' : 'status'"
        >
          <div class="sl-toast-icon">
            <SecLabIcon :name="toastIcon(toast.type)" :size="20" />
          </div>
          <div class="sl-toast-content">
            <h4 class="sl-toast-title">{{ toast.title }}</h4>
            <p class="sl-toast-message">{{ toast.message }}</p>
          </div>
          <button
            type="button"
            class="sl-toast-close"
            :aria-label="closeLabel ?? 'Close notification'"
            @click="emit('close', toast.id)"
          >
            ×
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.sl-toast-container {
  position: fixed;
  top: var(--sdl-space-4);
  right: var(--sdl-space-4);
  width: min(320px, calc(100vw - var(--sdl-space-8)));
  z-index: var(--sdl-z-index-toast);
  display: flex;
  flex-direction: column;
  gap: var(--sdl-space-3);
  pointer-events: none;
}

.sl-toast-item {
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  padding: var(--sdl-space-4);
  background-color: var(--sdl-bg-panel);
  border-radius: var(--sdl-radius-md);
  border: 1px solid var(--sdl-border-strong);
  box-shadow: var(--sdl-shadow-panel);
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sl-toast-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
}

.is-success::before {
  background-color: var(--sdl-success);
}
.is-error::before {
  background-color: var(--sdl-danger);
}
.is-warning::before {
  background-color: var(--sdl-warning);
}
.is-info::before {
  background-color: var(--sdl-info);
}

.sl-toast-icon {
  font-size: 20px;
  margin-right: var(--sdl-space-3);
  flex-shrink: 0;
}

.sl-toast-content {
  flex-grow: 1;
  min-width: 0;
}

.sl-toast-title {
  margin: 0 0 var(--sdl-space-1);
  font-size: var(--sdl-font-body);
  font-weight: 600;
  color: var(--sdl-text-primary);
}

.sl-toast-message {
  margin: 0;
  font-size: var(--sdl-font-body-sm);
  color: var(--sdl-text-secondary);
  line-height: 1.4;
}

.sl-toast-close {
  background: none;
  border: none;
  color: var(--sdl-text-muted);
  font-size: 20px;
  cursor: pointer;
  margin-left: var(--sdl-space-2);
  line-height: 1;
}

.sl-toast-close:hover {
  color: var(--sdl-text-primary);
}

.sl-toast-close:focus-visible {
  outline: none;
  border-radius: var(--sdl-radius-xs);
  box-shadow: var(--sdl-focus-ring);
}

/* 过渡动画 */
.sl-toast-list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.sl-toast-list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
.sl-toast-list-leave-active {
  position: absolute;
}
</style>
