<script setup lang="ts">
/**
 * @file SecLabFormItem.vue
 * @description SecLab 平台自研表单项组件，处理标签和布局。
 */

interface Props {
  /** 标签文本 */
  label?: string;
  /** 是否必填 (显示红星) */
  required?: boolean;
  /** 提示文本 */
  hint?: string;
  for?: string;
  error?: string;
  hintId?: string;
}

defineProps<Props>();
</script>

<template>
  <div class="sl-form-item">
    <label v-if="label" class="sl-form-item-label" :for="for">
      <span v-if="required" class="sl-form-item-required">*</span>
      {{ label }}
    </label>
    <div class="sl-form-item-content">
      <slot></slot>
      <div v-if="hint" :id="hintId" class="sl-form-item-hint">{{ hint }}</div>
      <div v-if="error" class="sl-form-item-error" role="alert">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.sl-form-item {
  margin-bottom: var(--sdl-space-4);
  display: flex;
  flex-direction: column;
  gap: var(--sdl-space-2);
}

.sl-form-item-label {
  font-size: var(--sdl-font-body-sm);
  font-weight: 600;
  color: var(--sdl-text-secondary);
  line-height: 1.4;
  user-select: none;
}

.sl-form-item-required {
  color: var(--sdl-danger);
  margin-right: 4px;
}

.sl-form-item-content {
  position: relative;
  width: 100%;
}

.sl-form-item-hint {
  margin-top: var(--sdl-space-1);
  font-size: var(--sdl-font-caption);
  color: var(--sdl-text-muted);
  line-height: 1.4;
}
.sl-form-item-error {
  margin-top: var(--sdl-space-1);
  color: var(--sdl-danger);
  font-size: var(--sdl-font-caption);
}
</style>
