<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { activateModalLifecycle } from "../internal/modal-lifecycle";

defineOptions({
  inheritAttrs: false,
});
/**
 * @file SecLabDialog.vue
 * @description SecLab 平台自研通用对话框 (子窗口) 组件，符合 SDL 设计规范，具有高密度与精致的悬浮工程感。
 */

interface Props {
  /** 对话框是否显示 */
  visible: boolean;
  /** 对话框标题 */
  title: string;
  /** 自定义宽度，支持 px 或百分比，默认值为 500px */
  width?: string;
  /** 点击遮罩层是否允许自动关闭对话框，默认为 true */
  closeOnClickOverlay?: boolean;
  /** 对话框遮罩层级，默认使用 SDL modal 层级 */
  zIndex?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  width: "500px",
  closeOnClickOverlay: true,
  zIndex: "var(--sdl-z-index-modal)",
});

const emit = defineEmits<{
  (e: "close"): void;
}>();

const overlayStyle = computed(() => ({
  zIndex: props.zIndex,
}));
const cardRef = ref<HTMLElement | null>(null);
const titleId = `sl-dialog-title-${Math.random().toString(36).slice(2)}`;
let deactivate: (() => void) | undefined;
watch(
  () => props.visible,
  async (visible) => {
    deactivate?.();
    deactivate = undefined;
    if (visible) {
      await nextTick();
      if (cardRef.value)
        deactivate = activateModalLifecycle(cardRef.value, () => emit("close"));
    }
  },
  { immediate: true },
);
onBeforeUnmount(() => deactivate?.());
</script>

<template>
  <Teleport to="body">
    <Transition name="sl-dialog-fade">
      <div
        v-if="visible"
        class="sl-dialog-overlay"
        v-bind="$attrs"
        :style="overlayStyle"
        @click.self="closeOnClickOverlay ? emit('close') : undefined"
      >
        <div
          ref="cardRef"
          class="sl-dialog-card"
          :style="{ width, maxWidth: '95%' }"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          tabindex="-1"
        >
          <!-- 头部标题栏 -->
          <div class="sl-dialog-header" data-slot="header">
            <span :id="titleId" class="sl-dialog-title">{{ title }}</span>
            <button
              class="sl-dialog-close-btn"
              @click="emit('close')"
              aria-label="Close dialog"
            >
              &times;
            </button>
          </div>

          <!-- 主体内容承载区，默认带有溢出自动滚动 -->
          <div class="sl-dialog-body">
            <slot></slot>
          </div>

          <!-- 底部操作按钮栏，仅当传入 footer 插槽时渲染 -->
          <div v-if="$slots.footer" class="sl-dialog-footer" data-slot="footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sl-dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(8, 12, 24, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: var(--sdl-z-index-modal);
}

.sl-dialog-card {
  background-color: var(--sdl-bg-panel);
  border-radius: var(--sdl-radius-lg);
  border: 1px solid var(--sdl-border-strong);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 85%;
  animation: sl-dialog-pop 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.sl-dialog-header {
  padding: var(--sdl-space-4) var(--sdl-space-4);
  background-color: var(--sdl-bg-muted);
  border-bottom: 1px solid var(--sdl-border-subtle);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.sl-dialog-title {
  font-size: var(--sdl-font-subtitle);
  font-weight: 700;
  color: var(--sdl-text-primary);
  user-select: none;
}

.sl-dialog-close-btn {
  background: transparent;
  border: none;
  color: var(--sdl-text-muted);
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  padding: 0 var(--sdl-space-1);
  transition: color 0.15s ease;
}

.sl-dialog-close-btn:hover {
  color: var(--sdl-text-primary);
}

.sl-dialog-body {
  padding: var(--sdl-space-4);
  overflow-y: auto;
  flex: 1;
  color: var(--sdl-text-secondary);
}

.sl-dialog-footer {
  padding: var(--sdl-space-4) var(--sdl-space-4);
  background-color: var(--sdl-bg-muted);
  border-top: 1px solid var(--sdl-border-subtle);
  display: flex;
  justify-content: flex-end;
  gap: var(--sdl-space-3);
  flex-shrink: 0;
}

/* 缩放弹出式动画 */
@keyframes sl-dialog-pop {
  from {
    transform: scale(0.96) translateY(8px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

/* 渐变遮罩过度效果 */
.sl-dialog-fade-enter-active,
.sl-dialog-fade-leave-active {
  transition: opacity 0.2s ease;
}

.sl-dialog-fade-enter-from,
.sl-dialog-fade-leave-to {
  opacity: 0;
}
</style>
