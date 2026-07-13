<script setup lang="ts">
/**
 * @file SecLabTabs.vue
 * @description SecLab 平台自研标签页组件，支持单选高亮，严格遵循 SDL 设计规范。
 */

interface TabItem {
  label: string;
  name: string;
  disabled?: boolean;
}

interface Props {
  /** 当前选中的标签页 name */
  modelValue: string;
  /** 标签页列表 */
  tabs: TabItem[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "tab-change", value: string): void;
}>();

function handleTabClick(tab: TabItem) {
  if (tab.disabled) return;
  emit("update:modelValue", tab.name);
  emit("tab-change", tab.name);
}
function handleKeydown(event: KeyboardEvent, index: number) {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const enabled = props.tabs
    .map((tab, tabIndex) => ({ tab, tabIndex }))
    .filter(({ tab }) => !tab.disabled);
  const current = enabled.findIndex(({ tabIndex }) => tabIndex === index);
  const target =
    event.key === "Home"
      ? enabled[0]
      : event.key === "End"
        ? enabled.at(-1)
        : enabled[
            (current + (event.key === "ArrowRight" ? 1 : -1) + enabled.length) %
              enabled.length
          ];
  if (target) {
    handleTabClick(target.tab);
    document
      .querySelector<HTMLElement>(`[data-tab-name="${target.tab.name}"]`)
      ?.focus();
  }
}
</script>

<template>
  <div class="sl-tabs">
    <div class="sl-tabs-nav" role="tablist">
      <button
        v-for="(tab, index) in tabs"
        type="button"
        :key="tab.name"
        class="sl-tabs-item"
        :class="{
          'is-active': modelValue === tab.name,
          'is-disabled': tab.disabled,
        }"
        role="tab"
        :aria-selected="modelValue === tab.name"
        :tabindex="modelValue === tab.name ? 0 : -1"
        :disabled="tab.disabled"
        :data-tab-name="tab.name"
        @click="handleTabClick(tab)"
        @keydown="handleKeydown($event, index)"
      >
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.sl-tabs {
  width: 100%;
}

.sl-tabs-nav {
  display: flex;
  align-items: center;
  gap: var(--sdl-space-6);
  border-bottom: 1px solid var(--sdl-border-subtle);
  padding: 0 var(--sdl-space-1);
}

.sl-tabs-item {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--sdl-font-body);
  color: var(--sdl-text-secondary);
  cursor: pointer;
  position: relative;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  user-select: none;
  padding: 0;
  border: 0;
  background: transparent;
}
.sl-tabs-item:focus-visible {
  outline: none;
  box-shadow: var(--sdl-focus-ring);
}

.sl-tabs-item:hover:not(.is-disabled) {
  color: var(--sdl-text-primary);
}

.sl-tabs-item.is-active {
  color: var(--sdl-primary);
  font-weight: 600;
}

.sl-tabs-item.is-active::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--sdl-primary);
  border-radius: var(--sdl-radius-pill) var(--sdl-radius-pill) 0 0;
}

.sl-tabs-item.is-disabled {
  cursor: not-allowed;
  opacity: 0.4;
}
</style>
