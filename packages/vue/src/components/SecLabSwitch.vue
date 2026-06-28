<script setup lang="ts">
/**
 * @file SecLabSwitch.vue
 * @description SecLab 平台自研开关组件，严格遵循 SDL 设计规范。
 */

interface Props {
  /** 绑定值 */
  modelValue: boolean;
  /** 激活时的文字 */
  activeText?: string;
  /** 禁用状态 */
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  activeText: "",
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "change", value: boolean): void;
}>();

function toggle() {
  if (props.disabled) return;
  const newValue = !props.modelValue;
  emit("update:modelValue", newValue);
  emit("change", newValue);
}
</script>

<template>
  <div
    class="sl-switch"
    :class="{ 'is-active': modelValue, 'is-disabled': disabled }"
    @click="toggle"
  >
    <div class="sl-switch-track">
      <div class="sl-switch-handle"></div>
    </div>
    <span v-if="activeText" class="sl-switch-label">{{ activeText }}</span>
  </div>
</template>

<style scoped>
.sl-switch {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  gap: var(--sdl-space-2);
}

.sl-switch.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.sl-switch-track {
  position: relative;
  width: 40px;
  height: 20px;
  background-color: var(--sdl-bg-muted);
  border: 1px solid var(--sdl-border-default);
  border-radius: var(--sdl-radius-pill);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sl-switch.is-active .sl-switch-track {
  background-color: var(--sdl-primary);
  border-color: var(--sdl-primary);
}

.sl-switch-handle {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  background-color: var(--sdl-text-primary);
  border-radius: 50%;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sl-switch.is-active .sl-switch-handle {
  transform: translateX(20px);
  background-color: var(--sdl-text-inverse);
}

.sl-switch-label {
  font-size: var(--sdl-font-body-sm);
  color: var(--sdl-text-secondary);
}

.sl-switch.is-active .sl-switch-label {
  color: var(--sdl-text-primary);
}
</style>
