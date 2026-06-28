<script setup lang="ts">
/**
 * @file SecLabLoading.vue
 * @description SecLab 平台自研加载遮罩组件，严格遵循 SDL 设计规范。
 */

interface Props {
  /** 是否显示加载中 */
  loading: boolean;
  /** 提示文字 */
  text?: string;
  /** 是否覆盖父容器 */
  cover?: boolean;
}

defineProps<Props>();
</script>

<template>
  <div
    class="sl-loading-host"
    :class="{ 'is-cover': cover, 'is-loading': loading }"
  >
    <slot></slot>
    <Transition name="sl-loading-fade">
      <div v-if="loading" class="sl-loading-mask">
        <div class="sl-loading-spinner">
          <svg class="sl-spinner" viewBox="0 0 50 50">
            <circle
              class="path"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke-width="5"
            ></circle>
          </svg>
          <p v-if="text" class="sl-loading-text">{{ text }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.sl-loading-host {
  position: relative;
}

.sl-loading-host.is-loading {
  min-height: 120px;
}

.sl-loading-host.is-cover {
  position: absolute;
  inset: 0;
  pointer-events: none;
  min-height: 0;
}

.sl-loading-host.is-cover.is-loading {
  pointer-events: auto;
}

.sl-loading-mask {
  position: absolute;
  inset: 0;
  background-color: var(--sdl-bg-backdrop);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(2px);
}

.sl-loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sdl-space-3);
}

.sl-spinner {
  animation: rotate 2s linear infinite;
  width: 42px;
  height: 42px;
  color: var(--sdl-primary);
}

.sl-spinner .path {
  stroke: currentColor;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

.sl-loading-text {
  margin: 0;
  font-size: var(--sdl-font-body-sm);
  color: var(--sdl-text-primary);
  font-weight: 500;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

.sl-loading-fade-enter-active,
.sl-loading-fade-leave-active {
  transition: opacity 0.3s;
}

.sl-loading-fade-enter-from,
.sl-loading-fade-leave-to {
  opacity: 0;
}
</style>
