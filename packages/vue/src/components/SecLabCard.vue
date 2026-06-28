<script setup lang="ts">
import type { CSSProperties } from "vue";

/**
 * @file SecLabCard.vue
 * @description SecLab 平台自研卡片组件，严格遵循 SDL 设计规范。
 */

interface Props {
  /** 阴影显示时机 */
  shadow?: "always" | "hover" | "never";
  /** 内容区自定义样式 */
  contentStyle?: CSSProperties;
  /** 默认插槽容器语义 */
  contentRole?: "content" | "header";
  /** 内容区是否撑满高度 (用于包含滚动表格的场景) */
  fullHeight?: boolean;
}

withDefaults(defineProps<Props>(), {
  shadow: "always",
  contentRole: "content",
  fullHeight: false,
});
</script>

<template>
  <div
    class="sl-card"
    :class="[`is-shadow-${shadow}`, { 'is-full-height': fullHeight }]"
  >
    <div v-if="$slots.header" class="sl-card-header">
      <slot name="header"></slot>
    </div>
    <div
      :class="[
        contentRole === 'header' ? 'sl-card-header' : 'sl-card-content',
        { 'is-full-height': fullHeight },
      ]"
      :style="contentStyle"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.sl-card {
  border-radius: var(--sdl-radius-lg);
  border: 1px solid var(--sdl-border-default);
  background-color: var(--sdl-bg-card);
  color: var(--sdl-text-primary);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.sl-card-header {
  padding: var(--sdl-space-4);
  border-bottom: 1px solid var(--sdl-border-subtle);
  background-color: var(--sdl-bg-muted);
  flex-shrink: 0;
}

.sl-card-content {
  padding: var(--sdl-space-4);
  flex: 1;
  min-height: 0;
}

.sl-card-content.is-full-height {
  padding: 0;
  display: flex;
  flex-direction: column;
}

.sl-card.is-full-height {
  height: 100%;
}

/* 阴影效果 */
.is-shadow-always {
  box-shadow: var(--sdl-shadow-panel);
}

.is-shadow-hover:hover {
  box-shadow: var(--sdl-shadow-panel);
  border-color: var(--sdl-border-brand);
}

.is-shadow-never {
  box-shadow: none;
}
</style>
