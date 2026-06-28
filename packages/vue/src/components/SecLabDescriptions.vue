<script setup lang="ts">
/**
 * @file SecLabDescriptions.vue
 * @description SecLab 平台自研详情列表组件，用于展示键值对数据。
 */

interface DescriptionItem {
  label: string;
  value?: string | number | boolean;
  slot?: string;
  span?: number;
}

interface Props {
  /** 标题 */
  title?: string;
  /** 列表项配置 */
  items: DescriptionItem[];
  /** 原始数据对象 (用于插槽渲染) */
  data?: Record<string, unknown>;
  /** 列数 */
  column?: number;
  /** 是否显示边框 */
  border?: boolean;
}

withDefaults(defineProps<Props>(), {
  column: 1,
  border: false,
});
</script>

<template>
  <div class="sl-descriptions" :class="{ 'is-border': border }">
    <div v-if="title" class="sl-descriptions-title">{{ title }}</div>
    <div
      class="sl-descriptions-grid"
      :style="{ gridTemplateColumns: `repeat(${column}, 1fr)` }"
    >
      <div
        v-for="(item, index) in items"
        :key="index"
        class="sl-descriptions-item"
        :style="{ gridColumn: `span ${item.span || 1}` }"
      >
        <div class="sl-descriptions-label">{{ item.label }}</div>
        <div class="sl-descriptions-content">
          <slot
            v-if="item.slot"
            :name="item.slot"
            :item="item"
            :data="data"
          ></slot>
          <template v-else>
            {{ item.value ?? (data && item.label ? data[item.label] : "--") }}
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sl-descriptions {
  width: 100%;
  font-family: var(--sdl-font-family);
}

.sl-descriptions-title {
  margin-bottom: var(--sdl-space-3);
  font-size: var(--sdl-font-subtitle);
  font-weight: 600;
  color: var(--sdl-text-primary);
}

.sl-descriptions-grid {
  display: grid;
  gap: 0;
  width: 100%;
}

.sl-descriptions-item {
  display: flex;
  min-height: 40px;
  border-bottom: 1px solid var(--sdl-border-subtle);
}

.sl-descriptions-label {
  width: 140px;
  padding: var(--sdl-space-2) var(--sdl-space-4);
  background-color: var(--sdl-bg-muted);
  color: var(--sdl-text-secondary);
  font-size: var(--sdl-font-body-sm);
  font-weight: 600;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.sl-descriptions-content {
  flex: 1;
  padding: var(--sdl-space-2) var(--sdl-space-4);
  color: var(--sdl-text-primary);
  font-size: var(--sdl-font-body-sm);
  display: flex;
  align-items: center;
  min-width: 0;
  word-break: break-all;
}

/* 边框模式 */
.is-border {
  border: 1px solid var(--sdl-border-default);
  border-bottom: none;
  border-radius: var(--sdl-radius-md);
  overflow: hidden;
}

.is-border .sl-descriptions-label {
  border-right: 1px solid var(--sdl-border-subtle);
}
</style>
