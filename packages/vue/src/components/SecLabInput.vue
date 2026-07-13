<script setup lang="ts">
/**
 * @file SecLabInput.vue
 * @description SecLab 平台自研输入框组件，严格遵循 SDL 设计规范。
 */

interface Props {
  /** 绑定值 */
  modelValue: string | number | null;
  /** 输入类型 */
  type?: "text" | "password" | "textarea" | "number" | "datetime-local";
  /** 占位符 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否只读 */
  readonly?: boolean;
  /** 最大长度 */
  maxlength?: number;
  /** 行数 (仅 textarea 有效) */
  rows?: number;
  /** 是否显示密码切换按钮 */
  showPassword?: boolean;
  /** 最小值 (仅 number 有效) */
  min?: number;
  /** 最大值 (仅 number 有效) */
  max?: number;
  /** 步长 (仅 number 有效) */
  step?: number;
  /** 自动填充属性 */
  autocomplete?: string;
  id?: string;
  ariaDescribedby?: string;
  invalid?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  disabled: false,
  readonly: false,
  rows: 3,
  showPassword: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number | null): void;
  (e: "focus", event: FocusEvent): void;
  (e: "blur", event: FocusEvent): void;
  (e: "change", value: string | number | null): void;
}>();

import { ref, computed } from "vue";
import SecLabIcon from "./SecLabIcon.vue";
const isPasswordVisible = ref(false);

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  emit(
    "update:modelValue",
    props.type === "number"
      ? target.value === ""
        ? null
        : Number(target.value)
      : target.value,
  );
}

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  emit(
    "change",
    props.type === "number"
      ? target.value === ""
        ? null
        : Number(target.value)
      : target.value,
  );
}

function togglePasswordVisibility() {
  isPasswordVisible.value = !isPasswordVisible.value;
}

const inputType = computed(() => {
  if (props.type === "password" && isPasswordVisible.value) {
    return "text";
  }
  return props.type;
});
</script>

<template>
  <div
    class="sl-input-wrapper"
    :class="[`is-${type}`, { 'is-disabled': disabled }]"
  >
    <template v-if="type === 'textarea'">
      <textarea
        class="sl-textarea"
        :id="id"
        :aria-describedby="ariaDescribedby"
        :aria-invalid="invalid || undefined"
        :value="modelValue?.toString()"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :rows="rows"
        @input="handleInput"
        @change="handleChange"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
      ></textarea>
    </template>
    <template v-else>
      <div class="sl-input-inner-wrapper">
        <input
          class="sl-input"
          :id="id"
          :aria-describedby="ariaDescribedby"
          :aria-invalid="invalid || undefined"
          :type="inputType"
          :value="modelValue?.toString()"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :maxlength="maxlength"
          :min="min"
          :max="max"
          :step="step"
          :autocomplete="autocomplete"
          @input="handleInput"
          @change="handleChange"
          @focus="emit('focus', $event)"
          @blur="emit('blur', $event)"
        />
        <button
          v-if="showPassword && type === 'password'"
          type="button"
          class="sl-input-password-toggle"
          :disabled="disabled"
          :aria-label="isPasswordVisible ? 'Hide password' : 'Show password'"
          :aria-pressed="isPasswordVisible"
          @click="togglePasswordVisibility"
        >
          <SecLabIcon
            :name="isPasswordVisible ? 'eye-off' : 'lock'"
            :size="16"
          />
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.sl-input-wrapper {
  position: relative;
  width: 100%;
  font-family: var(--sdl-font-family);
}

.sl-input-inner-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  background-color: var(--sdl-bg-input);
  border: 1px solid var(--sdl-border-default);
  border-radius: var(--sdl-radius-md);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.sl-input-inner-wrapper:focus-within {
  border-color: var(--sdl-primary);
  box-shadow: var(--sdl-focus-ring);
}

.sl-input {
  flex: 1;
  height: 36px;
  padding: 0 var(--sdl-space-3);
  background: transparent;
  border: none;
  outline: none;
  color: var(--sdl-text-primary);
  font-size: var(--sdl-font-body);
  width: 100%;
  box-sizing: border-box;
}

.sl-textarea {
  width: 100%;
  background-color: var(--sdl-bg-input);
  border: 1px solid var(--sdl-border-default);
  border-radius: var(--sdl-radius-md);
  padding: var(--sdl-space-2) var(--sdl-space-3);
  color: var(--sdl-text-primary);
  font-size: var(--sdl-font-body);
  font-family: inherit;
  outline: none;
  resize: vertical;
  transition: all 0.2s;
  display: block;
}

.sl-textarea:focus {
  border-color: var(--sdl-primary);
  box-shadow: var(--sdl-focus-ring);
}

.sl-input-wrapper.is-disabled .sl-input-inner-wrapper,
.sl-input-wrapper.is-disabled .sl-textarea {
  background-color: var(--sdl-bg-muted);
  cursor: not-allowed;
  opacity: 0.6;
}

.sl-input:disabled,
.sl-textarea:disabled {
  cursor: not-allowed;
}

.sl-input-password-toggle {
  background: none;
  border: none;
  padding: 0 var(--sdl-space-2);
  cursor: pointer;
  font-size: 14px;
  color: var(--sdl-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.sl-input-password-toggle:hover {
  color: var(--sdl-text-primary);
}

.sl-input::placeholder,
.sl-textarea::placeholder {
  color: var(--sdl-text-subtle);
}
</style>
