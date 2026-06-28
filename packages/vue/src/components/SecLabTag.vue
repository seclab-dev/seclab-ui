<script setup lang="ts">
/**
 * @file SecLabTag.vue
 * @description SecLab 平台自研标签组件，严格遵循 SDL 设计规范。
 */

interface Props {
  /** 标签类型 */
  type?: "primary" | "success" | "warning" | "danger" | "info" | "default";
  /** 主题风格 */
  effect?: "light" | "plain" | "dark";
}

withDefaults(defineProps<Props>(), {
  type: "default",
  effect: "light",
});
</script>

<template>
  <span class="sl-tag" :class="[`sl-tag--${type}`, `sl-tag--${effect}`]">
    <slot></slot>
  </span>
</template>

<style scoped>
.sl-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 0 var(--sdl-space-2);
  font-size: var(--sdl-font-caption);
  line-height: 1;
  border-radius: var(--sdl-radius-sm);
  border: 1px solid transparent;
  white-space: nowrap;
  box-sizing: border-box;
}

/* --- 默认/中性样式 --- */
.sl-tag--default.sl-tag--light {
  background-color: var(--sdl-neutral-soft);
  color: var(--sdl-text-secondary);
  border-color: var(--sdl-border-subtle);
}

/* --- 成功样式 --- */
.sl-tag--success.sl-tag--light {
  background-color: var(--sdl-success-soft);
  color: var(--sdl-success);
  border-color: var(--sdl-success-soft);
}

/* --- 警告样式 --- */
.sl-tag--warning.sl-tag--light {
  background-color: var(--sdl-warning-soft);
  color: var(--sdl-warning);
  border-color: var(--sdl-warning-soft);
}

/* --- 危险样式 --- */
.sl-tag--danger.sl-tag--light {
  background-color: var(--sdl-danger-soft);
  color: var(--sdl-danger);
  border-color: var(--sdl-danger-soft);
}

/* --- 信息样式 --- */
.sl-tag--info.sl-tag--light {
  background-color: var(--sdl-info-soft);
  color: var(--sdl-info);
  border-color: var(--sdl-info-soft);
}

/* --- 品牌/主要样式 --- */
.sl-tag--primary.sl-tag--light {
  background-color: var(--sdl-bg-active);
  color: var(--sdl-primary);
  border-color: var(--sdl-border-brand);
}

/* 以后可按需扩充 plain 和 dark 风格 */
</style>
