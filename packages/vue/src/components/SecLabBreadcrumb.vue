<script setup lang="ts">
import { provide } from "vue";

/**
 * @file SecLabBreadcrumb.vue
 * @description SecLab 平台自研面包屑导航容器。
 */

interface Props {
  /** 分隔符 */
  separator?: string;
}

const props = withDefaults(defineProps<Props>(), {
  separator: "/",
});

provide("sl-breadcrumb-separator", props.separator);
</script>

<template>
  <nav class="sl-breadcrumb" aria-label="Breadcrumb">
    <slot></slot>
  </nav>
</template>

<style scoped>
.sl-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0;
  font-size: var(--sdl-font-body-sm);
  color: var(--sdl-text-muted);
}
</style>
