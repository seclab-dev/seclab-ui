<script setup lang="ts">
/**
 * @file SecLabSelectionBar.vue
 * @description 为表格及列表的批量选择状态提供统一摘要和操作布局。
 */

import SecLabButton from "./SecLabButton.vue";

interface Props {
  /** 已选择项目数量。 */
  count: number;
  /** 数量前的本地化说明，例如“已选择”。 */
  label: string;
  /** 清除选择按钮文案；不传时隐藏按钮。 */
  clearLabel?: string;
  /** 是否禁止清除选择。 */
  clearDisabled?: boolean;
  /** 整个选择栏的无障碍名称。 */
  ariaLabel?: string;
}

withDefaults(defineProps<Props>(), {
  clearDisabled: false,
});

const emit = defineEmits<{
  clear: [];
}>();
</script>

<template>
  <div class="sl-selection-bar" data-ui="selection-bar">
    <div
      class="sl-selection-summary"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      :aria-label="ariaLabel"
      data-slot="selection-summary"
    >
      <span class="sl-selection-label">{{ label }}</span>
      <span class="sl-selection-count">{{ count }}</span>
    </div>
    <div class="sl-selection-actions" data-slot="selection-actions">
      <slot></slot>
      <SecLabButton
        v-if="clearLabel"
        :disabled="clearDisabled"
        data-ui="clear-selection"
        @click="emit('clear')"
      >
        {{ clearLabel }}
      </SecLabButton>
    </div>
  </div>
</template>

<style scoped>
.sl-selection-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sdl-space-3);
  min-height: 40px;
  box-sizing: border-box;
  padding: var(--sdl-space-2) var(--sdl-space-3);
  border: 1px solid var(--sdl-border-brand);
  border-radius: var(--sdl-radius-md);
  background-color: var(--sdl-bg-active);
  color: var(--sdl-text-primary);
}

.sl-selection-summary,
.sl-selection-actions {
  display: flex;
  align-items: center;
  gap: var(--sdl-space-2);
}

.sl-selection-label {
  color: var(--sdl-text-secondary);
  font-size: var(--sdl-font-body-sm);
  font-weight: 600;
}

.sl-selection-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  box-sizing: border-box;
  padding: 0 var(--sdl-space-2);
  border-radius: var(--sdl-radius-pill);
  background-color: var(--sdl-primary);
  color: var(--sdl-text-inverse);
  font-size: var(--sdl-font-caption);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 640px) {
  .sl-selection-bar {
    align-items: flex-start;
    flex-direction: column;
  }

  .sl-selection-actions {
    width: 100%;
    flex-wrap: wrap;
  }
}
</style>
