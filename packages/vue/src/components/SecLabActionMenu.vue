<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";

/**
 * @file SecLabActionMenu.vue
 * @description SecLab 平台自研操作菜单组件，支持自定义操作列表和图标。
 */

import SecLabTooltip from "./SecLabTooltip.vue";
import SecLabIcon from "./SecLabIcon.vue";
import { computeFloatingPosition } from "../internal/floating-position";

interface Action {
  label: string;
  class?: string;
  icon?: string;
  disabled?: boolean;
  tooltip?: string;
  handler: () => void;
}

const props = withDefaults(
  defineProps<{
    /** 操作列表 */
    actions: Action[];
    /** 按钮文案 */
    label?: string;
    /** 是否禁用菜单入口 */
    disabled?: boolean;
    /** 菜单项默认图标 */
    defaultIcon?: string;
  }>(),
  {
    disabled: false,
    defaultIcon: "settings",
  },
);

const showMenu = ref(false);
const menuRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const dropdownStyle = ref<Record<string, string>>({});
const dropdownPlacement = ref<"top" | "bottom">("bottom");

const updateDropdownPosition = () => {
  if (!menuRef.value || !dropdownRef.value || !showMenu.value) return;
  const position = computeFloatingPosition({
    anchor: menuRef.value,
    floating: dropdownRef.value,
  });
  dropdownPlacement.value = position.placement;
  dropdownStyle.value = position.style;
};

const toggleMenu = () => {
  if (props.disabled) return;
  showMenu.value = !showMenu.value;
  if (showMenu.value) {
    nextTick(updateDropdownPosition);
  }
};

const handleActionClick = (action: Action) => {
  if (action.disabled) return;
  action.handler();
  showMenu.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node;
  if (
    menuRef.value &&
    !menuRef.value.contains(target) &&
    (!dropdownRef.value || !dropdownRef.value.contains(target))
  ) {
    showMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("resize", updateDropdownPosition);
  window.addEventListener("scroll", updateDropdownPosition, true);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("resize", updateDropdownPosition);
  window.removeEventListener("scroll", updateDropdownPosition, true);
});
</script>

<template>
  <div class="sl-action-menu" ref="menuRef">
    <button class="sl-action-btn" :disabled="disabled" @click.stop="toggleMenu">
      <SecLabIcon class="sl-action-btn-icon" name="settings" :size="16" />
      <span class="sl-action-btn-text">{{ label || "操作" }}</span>
    </button>
    <teleport to="body">
      <transition name="sl-fade">
        <div
          v-if="showMenu"
          ref="dropdownRef"
          class="sl-dropdown"
          :style="dropdownStyle"
          :data-placement="dropdownPlacement"
          @click.stop
        >
          <template v-for="(action, index) in actions" :key="index">
            <SecLabTooltip
              :text="action.tooltip || ''"
              :disabled="!action.tooltip"
              position="right"
              class="sl-dropdown-tooltip-wrapper"
            >
              <button
                class="sl-dropdown-item"
                :class="[action.class, { 'is-disabled': action.disabled }]"
                :disabled="action.disabled"
                @click="handleActionClick(action)"
              >
                <SecLabIcon
                  class="sl-dropdown-icon"
                  :name="action.icon || defaultIcon"
                  :size="16"
                />
                <span class="sl-dropdown-label">{{ action.label }}</span>
              </button>
            </SecLabTooltip>
          </template>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<style scoped>
.sl-action-menu {
  position: relative;
  display: inline-block;
}

.sl-action-btn {
  background-color: var(--sdl-bg-muted);
  color: var(--sdl-text-primary);
  padding: 0 var(--sdl-space-3);
  height: 32px;
  border: 1px solid var(--sdl-border-default);
  border-radius: var(--sdl-radius-sm);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: var(--sdl-font-body-sm);
  display: flex;
  align-items: center;
  gap: var(--sdl-space-2);
}

.sl-action-btn:hover {
  background-color: var(--sdl-bg-hover);
  border-color: var(--sdl-border-brand);
}

.sl-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sl-dropdown {
  position: fixed;
  background-color: var(--sdl-bg-panel);
  border: 1px solid var(--sdl-border-strong);
  border-radius: var(--sdl-radius-md);
  box-shadow: var(--sdl-shadow-panel);
  z-index: var(--sdl-z-index-popover);
  min-width: 140px;
  padding: var(--sdl-space-1);
  max-height: 260px;
  overflow-y: auto;
}

.sl-dropdown-tooltip-wrapper {
  display: block;
  width: 100%;
}

.sl-dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--sdl-space-2);
  width: 100%;
  padding: var(--sdl-space-2) var(--sdl-space-3);
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: var(--sdl-font-body-sm);
  color: var(--sdl-text-secondary);
  transition: all 0.2s;
  border-radius: var(--sdl-radius-sm);
}

.sl-dropdown-item:hover:not(:disabled) {
  background-color: var(--sdl-bg-hover);
  color: var(--sdl-text-primary);
}

.sl-dropdown-item:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.sl-dropdown-icon {
  width: 20px;
  opacity: 0.8;
}

/* 业务语义颜色扩展 */
.sl-dropdown-item.app-btn-start {
  color: var(--sdl-primary);
}
.sl-dropdown-item.app-btn-stop {
  color: var(--sdl-warning);
}
.sl-dropdown-item.app-btn-delete {
  color: var(--sdl-danger);
}

.sl-fade-enter-active,
.sl-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.sl-fade-enter-from,
.sl-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
