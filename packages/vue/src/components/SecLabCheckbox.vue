<script setup lang="ts">
import { ref, watchEffect } from "vue";
/**
 * @file SecLabCheckbox.vue
 * @description SecLab 平台自研复选框组件，严格遵循 SDL 设计规范。
 */

interface Props {
  /** 绑定值 */
  modelValue: boolean;
  /** 禁用状态 */
  disabled?: boolean;
  indeterminate?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "change", value: boolean): void;
}>();
const inputRef = ref<HTMLInputElement | null>(null);
watchEffect(() => {
  if (inputRef.value)
    inputRef.value.indeterminate = Boolean(props.indeterminate);
});

function toggle() {
  if (props.disabled) return;
  const newValue = !props.modelValue;
  emit("update:modelValue", newValue);
  emit("change", newValue);
}
</script>

<template>
  <label
    class="sl-checkbox"
    :class="{ 'is-active': modelValue, 'is-disabled': disabled }"
  >
    <span class="sl-checkbox-input">
      <input
        ref="inputRef"
        type="checkbox"
        class="sl-checkbox-original"
        :checked="modelValue"
        :disabled="disabled"
        :aria-checked="indeterminate ? 'mixed' : modelValue"
        @change="toggle"
      />
      <span class="sl-checkbox-inner"></span>
    </span>
    <span v-if="$slots.default" class="sl-checkbox-label">
      <slot></slot>
    </span>
  </label>
</template>

<style scoped>
.sl-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  font-size: var(--sdl-font-body-sm);
  color: var(--sdl-text-primary);
  gap: var(--sdl-space-2);
}

.sl-checkbox.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.sl-checkbox-input {
  position: relative;
  display: inline-block;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.sl-checkbox-original {
  opacity: 0;
  outline: none;
  position: absolute;
  margin: 0;
  width: 0;
  height: 0;
  z-index: -1;
}

.sl-checkbox-inner {
  display: inline-block;
  position: relative;
  border: 1px solid var(--sdl-border-default);
  border-radius: 2px;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  background-color: var(--sdl-bg-input);
  z-index: 1;
  transition:
    border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
    background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
}

.sl-checkbox-inner::after {
  box-sizing: content-box;
  content: "";
  border: 2px solid var(--sdl-text-inverse);
  border-left: 0;
  border-top: 0;
  height: 8px;
  left: 5px;
  position: absolute;
  top: 1px;
  transform: rotate(45deg) scaleY(0);
  width: 3px;
  transition: transform 0.15s ease-in 0.05s;
  transform-origin: center;
}

.sl-checkbox.is-active .sl-checkbox-inner {
  background-color: var(--sdl-primary);
  border-color: var(--sdl-primary);
}

.sl-checkbox.is-active .sl-checkbox-inner::after {
  transform: rotate(45deg) scaleY(1);
}

.sl-checkbox:hover:not(.is-disabled) .sl-checkbox-inner {
  border-color: var(--sdl-primary);
}
.sl-checkbox-original:focus-visible + .sl-checkbox-inner {
  box-shadow: var(--sdl-focus-ring);
  border-color: var(--sdl-primary);
}

.sl-checkbox-label {
  line-height: 1;
}
</style>
