<script setup lang="ts">
import { inject } from "vue";

/**
 * @file SecLabBreadcrumbItem.vue
 * @description SecLab 平台自研面包屑导航项。
 */

const separator = inject("sl-breadcrumb-separator", "/");
</script>

<template>
  <span class="sl-breadcrumb-item">
    <span class="sl-breadcrumb-label">
      <slot></slot>
    </span>
    <span class="sl-breadcrumb-separator" role="presentation">{{
      separator
    }}</span>
  </span>
</template>

<style scoped>
.sl-breadcrumb-item {
  display: inline-flex;
  align-items: center;
}

.sl-breadcrumb-item:last-child .sl-breadcrumb-separator {
  display: none;
}

.sl-breadcrumb-label {
  color: var(--sdl-text-secondary);
  transition: color 0.2s;
}

.sl-breadcrumb-label:hover {
  color: var(--sdl-primary);
}

.sl-breadcrumb-separator {
  margin: 0 var(--sdl-space-2);
  color: var(--sdl-text-muted);
  user-select: none;
}
</style>
