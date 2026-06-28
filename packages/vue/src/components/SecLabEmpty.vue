<script setup lang="ts">
/**
 * @file SecLabEmpty.vue
 * @description SecLab 平台自研空状态组件，严格遵循 SDL 设计规范。
 */

import SecLabIcon from "./SecLabIcon.vue";

interface Props {
  /** 描述文字 */
  description?: string;
  /** SDL 图标名称。 */
  icon?: string;
}

withDefaults(defineProps<Props>(), {
  description: "暂无数据",
  icon: "empty",
});
</script>

<template>
  <div class="sl-empty">
    <div class="sl-empty-icon">
      <slot name="icon">
        <SecLabIcon :name="icon" :size="48" />
      </slot>
    </div>
    <p class="sl-empty-description">
      <slot>{{ description }}</slot>
    </p>
    <div v-if="$slots.extra" class="sl-empty-extra">
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<style scoped>
.sl-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--sdl-space-8) var(--sdl-space-4);
  text-align: center;
  box-sizing: border-box;
}

.sl-empty-icon {
  color: var(--sdl-text-muted);
  margin-bottom: var(--sdl-space-4);
  line-height: 1;
  opacity: 0.8;
}

.sl-empty-description {
  margin: 0;
  font-size: var(--sdl-font-body);
  color: var(--sdl-text-muted);
}

.sl-empty-extra {
  margin-top: var(--sdl-space-4);
}
</style>
