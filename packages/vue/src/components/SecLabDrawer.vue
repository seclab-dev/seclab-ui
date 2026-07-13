<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { activateModalLifecycle } from "../internal/modal-lifecycle";

defineOptions({
  inheritAttrs: false,
});

/**
 * @file SecLabDrawer.vue
 * @description SecLab 平台自研侧边抽屉组件，严格遵循 SDL 设计规范。
 */

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    width?: string;
    closeOnOverlay?: boolean;
  }>(),
  {
    title: "",
    width: "420px",
    closeOnOverlay: true,
  },
);

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
  (event: "close"): void;
}>();

const drawerStyle = computed(() => ({ width: props.width }));
const panelRef = ref<HTMLElement | null>(null);
const titleId = `sl-drawer-title-${Math.random().toString(36).slice(2)}`;
let deactivate: (() => void) | undefined;

const closeDrawer = () => {
  emit("update:modelValue", false);
  emit("close");
};

const handleOverlayClick = () => {
  if (!props.closeOnOverlay) return;
  closeDrawer();
};
watch(
  () => props.modelValue,
  async (visible) => {
    deactivate?.();
    deactivate = undefined;
    if (visible) {
      await nextTick();
      if (panelRef.value) deactivate = activateModalLifecycle(panelRef.value, closeDrawer);
    }
  },
  { immediate: true },
);
onBeforeUnmount(() => deactivate?.());
</script>

<template>
  <Teleport to="body">
    <Transition name="sl-drawer-fade">
      <div
        v-if="props.modelValue"
        class="sl-drawer-overlay"
        v-bind="$attrs"
        @click.self="handleOverlayClick"
      >
        <div
          ref="panelRef"
          class="sl-drawer-panel"
          :style="drawerStyle"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          tabindex="-1"
        >
          <div class="sl-drawer-header" data-slot="header">
            <h3 :id="titleId" class="sl-drawer-title">{{ props.title }}</h3>
            <button type="button" class="sl-drawer-close-btn" aria-label="Close drawer" @click="closeDrawer">×</button>
          </div>
          <div class="sl-drawer-body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="sl-drawer-footer" data-slot="footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sl-drawer-overlay {
  position: fixed;
  inset: 0;
  background-color: var(--sdl-bg-backdrop);
  display: flex;
  justify-content: flex-end;
  z-index: var(--sdl-z-index-modal);
}

.sl-drawer-panel {
  height: 100%;
  background: var(--sdl-bg-panel);
  box-shadow: var(--sdl-shadow-panel);
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--sdl-border-strong);
}

.sl-drawer-header {
  padding: var(--sdl-space-4) var(--sdl-space-5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--sdl-border-subtle);
  background: var(--sdl-bg-muted);
}

.sl-drawer-title {
  margin: 0;
  font-size: var(--sdl-font-subtitle);
  font-weight: 600;
  color: var(--sdl-text-primary);
}

.sl-drawer-close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--sdl-text-muted);
  line-height: 1;
  transition: color 0.2s;
}

.sl-drawer-close-btn:hover {
  color: var(--sdl-text-primary);
}

.sl-drawer-body {
  padding: var(--sdl-space-5);
  flex: 1;
  overflow-y: auto;
  color: var(--sdl-text-primary);
}

.sl-drawer-footer {
  padding: var(--sdl-space-4) var(--sdl-space-5);
  border-top: 1px solid var(--sdl-border-subtle);
  background: var(--sdl-bg-muted);
  display: flex;
  justify-content: flex-end;
  gap: var(--sdl-space-3);
}

/* 过渡动画 */
.sl-drawer-fade-enter-active,
.sl-drawer-fade-leave-active {
  transition: opacity 0.25s ease;
}

.sl-drawer-fade-enter-from,
.sl-drawer-fade-leave-to {
  opacity: 0;
}

.sl-drawer-fade-enter-active .sl-drawer-panel,
.sl-drawer-fade-leave-active .sl-drawer-panel {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.sl-drawer-fade-enter-from .sl-drawer-panel,
.sl-drawer-fade-leave-to .sl-drawer-panel {
  transform: translateX(100%);
}
</style>
