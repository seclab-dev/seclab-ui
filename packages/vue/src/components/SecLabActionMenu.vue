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
  className?: string;
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
const dropdownPositioned = ref(false);
const menuRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const dropdownStyle = ref<Record<string, string>>({});
const dropdownPlacement = ref<"top" | "bottom">("bottom");
const ACTION_MENU_OPEN_EVENT = "seclab-action-menu-open";

const updateDropdownPosition = () => {
  if (!menuRef.value || !dropdownRef.value || !showMenu.value) return;
  const position = computeFloatingPosition({
    anchor: menuRef.value,
    floating: dropdownRef.value,
  });
  dropdownPlacement.value = position.placement;
  dropdownStyle.value = position.style;
  dropdownPositioned.value = true;
};

const closeMenu = () => {
  showMenu.value = false;
  dropdownPositioned.value = false;
};

const openMenu = (focusFirst = false) => {
  dropdownPositioned.value = false;
  showMenu.value = true;
  document.dispatchEvent(
    new CustomEvent(ACTION_MENU_OPEN_EVENT, { detail: menuRef.value }),
  );
  nextTick(() => {
    updateDropdownPosition();
    if (focusFirst) focusItem(0);
  });
};

const toggleMenu = () => {
  if (props.disabled) return;
  if (showMenu.value) closeMenu();
  else openMenu();
};

const handleActionClick = (action: Action) => {
  if (action.disabled) return;
  action.handler();
  closeMenu();
};
const focusItem = (index: number) => {
  const items = [
    ...(dropdownRef.value?.querySelectorAll<HTMLButtonElement>(
      ".sl-dropdown-item:not(:disabled)",
    ) ?? []),
  ];
  items[(index + items.length) % items.length]?.focus();
};
const handleTriggerKeydown = (event: KeyboardEvent) => {
  if (!["Enter", " ", "ArrowDown"].includes(event.key)) return;
  event.preventDefault();
  openMenu(true);
};
const handleMenuKeydown = (event: KeyboardEvent) => {
  const items = [
    ...(dropdownRef.value?.querySelectorAll<HTMLButtonElement>(
      ".sl-dropdown-item:not(:disabled)",
    ) ?? []),
  ];
  const index = items.indexOf(document.activeElement as HTMLButtonElement);
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    focusItem(index + (event.key === "ArrowDown" ? 1 : -1));
  } else if (event.key === "Home" || event.key === "End") {
    event.preventDefault();
    focusItem(event.key === "Home" ? 0 : items.length - 1);
  } else if (event.key === "Escape") {
    event.preventDefault();
    closeMenu();
    menuRef.value?.querySelector<HTMLButtonElement>(".sl-action-btn")?.focus();
  }
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node;
  if (
    menuRef.value &&
    !menuRef.value.contains(target) &&
    (!dropdownRef.value || !dropdownRef.value.contains(target))
  ) {
    closeMenu();
  }
};

const handleOtherMenuOpen = (event: Event) => {
  if ((event as CustomEvent<HTMLElement | null>).detail !== menuRef.value) {
    closeMenu();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  document.addEventListener(ACTION_MENU_OPEN_EVENT, handleOtherMenuOpen);
  window.addEventListener("resize", updateDropdownPosition);
  window.addEventListener("scroll", updateDropdownPosition, true);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener(ACTION_MENU_OPEN_EVENT, handleOtherMenuOpen);
  window.removeEventListener("resize", updateDropdownPosition);
  window.removeEventListener("scroll", updateDropdownPosition, true);
});
</script>

<template>
  <div class="sl-action-menu" ref="menuRef">
    <button
      type="button"
      class="sl-action-btn"
      :disabled="disabled"
      aria-haspopup="menu"
      :aria-expanded="showMenu"
      @click.stop="toggleMenu"
      @keydown="handleTriggerKeydown"
    >
      <SecLabIcon class="sl-action-btn-icon" name="settings" :size="16" />
      <span class="sl-action-btn-text">{{ label || "操作" }}</span>
    </button>
    <teleport to="body">
      <transition name="sl-fade">
        <div
          v-if="showMenu"
          ref="dropdownRef"
          class="sl-dropdown"
          :class="{ 'is-positioned': dropdownPositioned }"
          role="menu"
          :style="dropdownStyle"
          :data-placement="dropdownPlacement"
          @click.stop
          @keydown="handleMenuKeydown"
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
                role="menuitem"
                :class="[action.className, { 'is-disabled': action.disabled }]"
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
  font-family: var(--sdl-font-family);
  display: flex;
  align-items: center;
  gap: var(--sdl-space-2);
}

.sl-action-btn:hover {
  background-color: var(--sdl-bg-hover);
  border-color: var(--sdl-border-brand);
}
.sl-action-btn:focus-visible,
.sl-dropdown-item:focus-visible {
  outline: none;
  box-shadow: var(--sdl-focus-ring);
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
  z-index: calc(var(--sdl-z-index-modal) + 1);
  min-width: 140px;
  padding: var(--sdl-space-1);
  max-height: 260px;
  overflow-y: auto;
}

.sl-dropdown:not(.is-positioned) {
  top: 0;
  left: 0;
  visibility: hidden;
  pointer-events: none;
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
  font-family: var(--sdl-font-family);
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
