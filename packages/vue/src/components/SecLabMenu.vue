<script setup lang="ts">
import { ref } from "vue";
/**
 * @file SecLabMenu.vue
 * @description SecLab 平台自研侧边栏菜单组件，支持分组和单选高亮，严格遵循 SDL 设计规范。
 */

interface MenuItem {
  key: string;
  label: string;
}

interface MenuCategory {
  key: string;
  label: string;
  children: MenuItem[];
}

interface Props {
  /** 当前选中的菜单项 key */
  modelValue: string;
  /** 菜单项列表 (带分组) */
  items: MenuCategory[];
}

defineProps<Props>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "select", value: string): void;
}>();

function handleSelect(key: string) {
  emit("update:modelValue", key);
  emit("select", key);
}
const menuRef = ref<HTMLElement | null>(null);
function handleKeydown(event: KeyboardEvent) {
  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
  const items = [...(menuRef.value?.querySelectorAll<HTMLButtonElement>(".sl-menu-item-button") ?? [])];
  const current = items.indexOf(document.activeElement as HTMLButtonElement);
  const index = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : (current + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
  event.preventDefault(); items[index]?.focus();
}
</script>

<template>
  <nav ref="menuRef" class="sl-menu" aria-label="Menu" @keydown="handleKeydown">
    <div v-for="category in items" :key="category.key" class="sl-menu-group">
      <div class="sl-menu-group-title">{{ category.label }}</div>
      <ul class="sl-menu-items">
        <li
          v-for="item in category.children"
          :key="item.key"
          class="sl-menu-item"
          :class="{ 'is-active': modelValue === item.key }"
        >
          <button type="button" class="sl-menu-item-button" :aria-current="modelValue === item.key ? 'page' : undefined" @click="handleSelect(item.key)">
            <span class="sl-menu-item-label">{{ item.label }}</span>
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.sl-menu {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--sdl-space-5);
  font-family: var(--sdl-font-family);
  user-select: none;
}

.sl-menu-group {
  display: flex;
  flex-direction: column;
  gap: var(--sdl-space-2);
}

.sl-menu-group-title {
  padding: 0 var(--sdl-space-2);
  font-size: var(--sdl-font-caption);
  font-weight: 700;
  color: var(--sdl-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sl-menu-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sl-menu-item {
  height: 38px;
  padding: 0 var(--sdl-space-4);
  display: flex;
  align-items: center;
  border-radius: var(--sdl-radius-md);
  color: var(--sdl-text-secondary);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}
.sl-menu-item-button { width: 100%; height: 100%; padding: 0; border: 0; background: transparent; color: inherit; text-align: left; cursor: inherit; font: inherit; }
.sl-menu-item-button:focus-visible { outline: none; box-shadow: var(--sdl-focus-ring); border-radius: var(--sdl-radius-md); }

.sl-menu-item:hover {
  background-color: var(--sdl-bg-hover);
  color: var(--sdl-text-primary);
}

.sl-menu-item.is-active {
  background-color: var(--sdl-bg-active);
  color: var(--sdl-primary);
  font-weight: 600;
}

.sl-menu-item.is-active::before {
  content: "";
  position: absolute;
  left: 6px;
  top: 8px;
  bottom: 8px;
  width: 3px;
  border-radius: var(--sdl-radius-pill);
  background-color: var(--sdl-primary);
}

.sl-menu-item-label {
  font-size: var(--sdl-font-body);
}
</style>
