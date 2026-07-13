<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed, nextTick } from "vue";
import { computeFloatingPosition } from "../internal/floating-position";

/**
 * @file SecLabSelect.vue
 * @description SecLab 平台自研下拉选择组件，支持自定义内容渲染和 Teleport 浮层。
 */

interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
  hint?: string;
}

const props = defineProps<{
  /** 绑定值 */
  modelValue: string | number | null;
  /** 选项列表 */
  options: Option[];
  /** 占位符 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number | null): void;
  (e: "option-disabled", option: Option): void;
  (e: "dropdown-scroll", event: Event): void;
  (e: "dropdown-reach-bottom", event: Event): void;
}>();

const SCROLL_BOTTOM_THRESHOLD = 24;
const isOpen = ref(false);
const selectRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const dropdownPlacement = ref<"top" | "bottom">("bottom");
const dropdownStyle = ref<Record<string, string>>({
  visibility: "hidden",
});

const selectedLabel = computed(() => {
  const selectedOption = props.options.find(
    (opt) => opt.value === props.modelValue,
  );
  return selectedOption ? selectedOption.label : props.placeholder || "请选择";
});

const calculatePosition = () => {
  if (!selectRef.value || !dropdownRef.value || !isOpen.value) return;
  const position = computeFloatingPosition({
    anchor: selectRef.value,
    floating: dropdownRef.value,
    matchWidth: true,
  });
  dropdownPlacement.value = position.placement;
  dropdownStyle.value = position.style;
};

watch(isOpen, (val) => {
  if (val) {
    dropdownStyle.value = { visibility: "hidden" };
    nextTick(() => {
      calculatePosition();
    });
  }
});

watch(
  () => props.options.length,
  () => {
    if (isOpen.value) nextTick(calculatePosition);
  },
);

function toggleDropdown() {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
}

function selectOption(option: Option) {
  if (props.disabled) return;
  if (option.disabled) {
    emit("option-disabled", option);
    return;
  }
  emit("update:modelValue", option.value);
  isOpen.value = false;
}

function handleDropdownScroll(event: Event) {
  emit("dropdown-scroll", event);

  const target = event.currentTarget as HTMLElement | null;
  if (!target) return;

  const distanceToBottom =
    target.scrollHeight - target.scrollTop - target.clientHeight;
  if (distanceToBottom <= SCROLL_BOTTOM_THRESHOLD) {
    emit("dropdown-reach-bottom", event);
  }
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node;
  if (
    selectRef.value &&
    !selectRef.value.contains(target) &&
    (!dropdownRef.value || !dropdownRef.value.contains(target))
  ) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("resize", calculatePosition);
  window.addEventListener("scroll", calculatePosition, true);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("resize", calculatePosition);
  window.removeEventListener("scroll", calculatePosition, true);
});
</script>

<template>
  <div
    class="sl-select"
    :class="{ 'is-open': isOpen, 'is-disabled': disabled }"
    ref="selectRef"
  >
    <div class="sl-select-trigger" @click="toggleDropdown">
      <span class="sl-select-label">{{ selectedLabel }}</span>
      <span class="sl-select-arrow"></span>
    </div>
    <teleport to="body">
      <Transition name="sl-select-fade">
        <ul
          v-if="isOpen"
          ref="dropdownRef"
          class="sl-select-options"
          :style="dropdownStyle"
          :data-placement="dropdownPlacement"
          @scroll="handleDropdownScroll"
        >
          <li
            v-for="option in options"
            :key="option.value"
            class="sl-select-option"
            :class="{
              selected: modelValue === option.value,
              disabled: option.disabled,
            }"
            :title="option.hint"
            @click="selectOption(option)"
          >
            {{ option.label }}
          </li>
          <li v-if="$slots['dropdown-footer']" class="sl-select-footer">
            <slot name="dropdown-footer" />
          </li>
        </ul>
      </Transition>
    </teleport>
  </div>
</template>

<style scoped>
.sl-select {
  position: relative;
  width: 100%;
  font-size: var(--sdl-font-body);
}

.sl-select-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--sdl-space-3);
  height: 36px;
  border: 1px solid var(--sdl-border-default);
  border-radius: var(--sdl-radius-md);
  background-color: var(--sdl-bg-input);
  color: var(--sdl-text-primary);
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
}

.sl-select.is-disabled .sl-select-trigger {
  background-color: var(--sdl-bg-muted);
  cursor: not-allowed;
  color: var(--sdl-text-subtle);
  border-color: var(--sdl-border-subtle);
}

.sl-select:not(.is-disabled) .sl-select-trigger:hover {
  border-color: var(--sdl-border-strong);
}

.sl-select.is-open .sl-select-trigger {
  border-color: var(--sdl-primary);
  box-shadow: var(--sdl-focus-ring);
}

.sl-select-arrow {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid var(--sdl-text-muted);
  transition: transform 0.2s ease;
}

.sl-select.is-open .sl-select-arrow {
  transform: rotate(180deg);
}

.sl-select-options {
  position: fixed;
  background-color: var(--sdl-bg-panel);
  border: 1px solid var(--sdl-border-strong);
  border-radius: var(--sdl-radius-md);
  box-shadow: var(--sdl-shadow-panel);
  width: max-content;
  overflow-y: auto;
  box-sizing: border-box;
  scrollbar-width: thin;
  list-style: none;
  padding: var(--sdl-space-1);
  margin: 0;
  z-index: calc(var(--sdl-z-index-modal) + 1);
}

.sl-select-option {
  padding: var(--sdl-space-2) var(--sdl-space-3);
  border-radius: var(--sdl-radius-sm);
  cursor: pointer;
  color: var(--sdl-text-secondary);
  transition: all 0.2s;
  font-size: var(--sdl-font-body-sm);
  white-space: nowrap;
}

.sl-select-option:hover {
  background-color: var(--sdl-bg-hover);
  color: var(--sdl-text-primary);
}

.sl-select-option.selected {
  background-color: var(--sdl-bg-active);
  color: var(--sdl-primary);
  font-weight: 600;
}

.sl-select-option.disabled {
  color: var(--sdl-text-subtle);
  cursor: not-allowed;
}

.sl-select-footer {
  padding: var(--sdl-space-2) var(--sdl-space-3);
  color: var(--sdl-text-subtle);
  font-size: var(--sdl-font-body-sm);
  list-style: none;
}

.sl-select-fade-enter-active,
.sl-select-fade-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.sl-select-fade-enter-from,
.sl-select-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
