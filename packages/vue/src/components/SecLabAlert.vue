<script setup lang="ts">
/**
 * @file SecLabAlert.vue
 * @description SecLab 平台自研通知横幅组件，严格遵循 SDL 设计规范。
 */

interface Props {
  /** 警告标题 */
  title?: string;
  /** 警告描述 (如果有 title, 则在下方显示) */
  description?: string;
  /** 警告类型 */
  type?: "success" | "warning" | "error" | "info";
  /** 是否显示图标 */
  showIcon?: boolean;
  /** 是否可关闭 */
  closable?: boolean;
  /** 关闭按钮的无障碍标签 */
  closeLabel?: string;
}

withDefaults(defineProps<Props>(), {
  type: "info",
  showIcon: false,
  closable: false,
});

const emit = defineEmits<{
  (e: "close"): void;
}>();

import { ref } from "vue";
import SecLabIcon from "./SecLabIcon.vue";
const visible = ref(true);

function handleClose() {
  visible.value = false;
  emit("close");
}

function alertIcon(type: NonNullable<Props["type"]>) {
  if (type === "success") return "success";
  if (type === "error") return "error";
  if (type === "warning") return "warning";
  return "info";
}
</script>

<template>
  <Transition name="sl-alert-fade">
    <div v-if="visible" class="sl-alert" :class="[`is-${type}`]" role="alert">
      <div v-if="showIcon" class="sl-alert-icon">
        <SecLabIcon :name="alertIcon(type)" :size="16" />
      </div>
      <div class="sl-alert-content">
        <h4 v-if="title" class="sl-alert-title">{{ title }}</h4>
        <div class="sl-alert-description">
          <slot>{{ description }}</slot>
        </div>
      </div>
      <button
        v-if="closable"
        type="button"
        class="sl-alert-close"
        :aria-label="closeLabel ?? 'Close alert'"
        @click="handleClose"
      >
        ×
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.sl-alert {
  display: flex;
  align-items: flex-start;
  width: 100%;
  padding: var(--sdl-space-2) var(--sdl-space-4);
  border-radius: var(--sdl-radius-md);
  border: 1px solid transparent;
  box-sizing: border-box;
  margin-bottom: var(--sdl-space-3);
  font-family: var(--sdl-font-family);
}

.sl-alert-icon {
  margin-right: var(--sdl-space-3);
  font-size: 16px;
  line-height: 1.6;
}

.sl-alert-content {
  flex: 1;
  min-width: 0;
}

.sl-alert-title {
  margin: 0;
  font-size: var(--sdl-font-body);
  font-weight: 600;
  line-height: 1.6;
}

.sl-alert-description {
  font-size: var(--sdl-font-body-sm);
  line-height: 1.6;
}

.sl-alert-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: inherit;
  opacity: 0.6;
  margin-left: var(--sdl-space-3);
  line-height: 1;
  transition: opacity 0.2s;
}

.sl-alert-close:hover {
  opacity: 1;
}

.sl-alert-close:focus-visible {
  outline: none;
  border-radius: var(--sdl-radius-xs);
  box-shadow: var(--sdl-focus-ring);
}

/* --- 类型预设 (SDL 软色调) --- */
.is-info {
  background-color: var(--sdl-info-soft);
  color: var(--sdl-info);
  border-color: rgba(0, 200, 255, 0.2);
}

.is-success {
  background-color: var(--sdl-success-soft);
  color: var(--sdl-success);
  border-color: rgba(0, 210, 122, 0.2);
}

.is-warning {
  background-color: var(--sdl-warning-soft);
  color: var(--sdl-warning);
  border-color: rgba(255, 181, 71, 0.2);
}

.is-error {
  background-color: var(--sdl-danger-soft);
  color: var(--sdl-danger);
  border-color: rgba(255, 94, 122, 0.2);
}

/* 动画 */
.sl-alert-fade-enter-active,
.sl-alert-fade-leave-active {
  transition: opacity 0.3s ease;
}

.sl-alert-fade-enter-from,
.sl-alert-fade-leave-to {
  opacity: 0;
}
</style>
