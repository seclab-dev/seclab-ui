<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from "vue";
import { activateModalLifecycle } from "../internal/modal-lifecycle";
defineOptions({
  inheritAttrs: false,
});
/**
 * @file SecLabModal.vue
 * @description SecLab 平台自研通用模态框组件，支持确认、信息展示及自定义操作。
 */

interface Props {
  /** 是否可见 */
  visible: boolean;
  /** 标题 */
  title: string;
  /** 消息内容 */
  message: string;
  /** 确认按钮文案 */
  confirmText?: string;
  /** 取消按钮文案 */
  cancelText?: string;
  /** 确认按钮类型 */
  type?: "primary" | "danger" | "warning";
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: "确定",
  cancelText: "取消",
  type: "primary",
});

const emit = defineEmits<{
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();
const cardRef = ref<HTMLElement | null>(null);
const titleId = `sl-modal-title-${Math.random().toString(36).slice(2)}`;
let deactivate: (() => void) | undefined;
watch(
  () => props.visible,
  async (visible) => {
    deactivate?.();
    deactivate = undefined;
    if (visible) {
      await nextTick();
      if (cardRef.value)
        deactivate = activateModalLifecycle(cardRef.value, () =>
          emit("cancel"),
        );
    }
  },
  { immediate: true },
);
onBeforeUnmount(() => deactivate?.());
</script>

<template>
  <Teleport to="body">
    <Transition name="sl-modal-fade">
      <div
        v-if="visible"
        class="sl-modal-overlay"
        v-bind="$attrs"
        @click.self="emit('cancel')"
      >
        <div
          ref="cardRef"
          class="sl-modal-card"
          role="alertdialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          tabindex="-1"
        >
          <div class="sl-modal-header" data-slot="header">
            <h3 :id="titleId" class="sl-modal-title">{{ title }}</h3>
          </div>
          <div class="sl-modal-body">
            <p class="sl-modal-message">{{ message }}</p>
          </div>
          <div class="sl-modal-footer" data-slot="footer">
            <button
              type="button"
              class="sl-modal-btn is-cancel"
              @click="emit('cancel')"
            >
              {{ cancelText }}
            </button>
            <button
              class="sl-modal-btn"
              type="button"
              :class="[`is-${type}`]"
              @click="emit('confirm')"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sl-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: var(--sdl-bg-backdrop);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: var(--sdl-z-index-modal);
}

.sl-modal-card {
  background: var(--sdl-bg-panel);
  border-radius: var(--sdl-radius-lg);
  border: 1px solid var(--sdl-border-strong);
  box-shadow: var(--sdl-shadow-window);
  width: 90%;
  max-width: 420px;
  overflow: hidden;
  animation: sl-modal-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.sl-modal-header {
  padding: var(--sdl-space-4) var(--sdl-space-5);
  background-color: var(--sdl-bg-muted);
  border-bottom: 1px solid var(--sdl-border-subtle);
}

.sl-modal-title {
  margin: 0;
  font-size: var(--sdl-font-subtitle);
  font-weight: 600;
  color: var(--sdl-text-primary);
}

.sl-modal-body {
  padding: var(--sdl-space-6) var(--sdl-space-5);
  color: var(--sdl-text-secondary);
}

.sl-modal-message {
  margin: 0;
  line-height: 1.6;
  font-size: var(--sdl-font-body);
}

.sl-modal-footer {
  padding: var(--sdl-space-4) var(--sdl-space-5);
  display: flex;
  justify-content: flex-end;
  gap: var(--sdl-space-3);
  background-color: var(--sdl-bg-muted);
  border-top: 1px solid var(--sdl-border-subtle);
}

.sl-modal-btn {
  height: 36px;
  min-width: 88px;
  padding: 0 var(--sdl-space-4);
  border-radius: var(--sdl-radius-md);
  border: 1px solid transparent;
  font-size: var(--sdl-font-body-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.sl-modal-btn.is-cancel {
  background-color: transparent;
  border-color: var(--sdl-border-default);
  color: var(--sdl-text-secondary);
}
.sl-modal-btn.is-cancel:hover {
  background-color: var(--sdl-bg-hover);
  color: var(--sdl-text-primary);
}

.sl-modal-btn.is-primary {
  background-color: var(--sdl-primary);
  color: var(--sdl-text-inverse);
}
.sl-modal-btn.is-primary:hover {
  background-color: var(--sdl-primary-hover);
}

.sl-modal-btn.is-danger {
  background-color: var(--sdl-danger);
  color: var(--sdl-text-on-danger);
}
.sl-modal-btn.is-danger:hover {
  filter: brightness(1.1);
}

/* 过渡动画 */
.sl-modal-fade-enter-active,
.sl-modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.sl-modal-fade-enter-from,
.sl-modal-fade-leave-to {
  opacity: 0;
}

@keyframes sl-modal-pop {
  from {
    transform: scale(0.95) translateY(10px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}
</style>
