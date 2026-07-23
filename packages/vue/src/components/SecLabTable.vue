<script setup lang="ts" generic="T extends Record<string, any>">
/**
 * @file SecLabTable.vue
 * @description SecLab 平台自研表格组件，严格遵循 SDL 设计规范。
 * 支持数据驱动列配置、自定义插槽渲染、固定列以及全网格边框。
 */

import { computed } from "vue";
import type { CSSProperties } from "vue";
import SecLabCheckbox from "./SecLabCheckbox.vue";

export type SecLabTableRowKey = string | number;

export interface SecLabTableColumn {
  prop?: string;
  label: string;
  width?: string | number;
  minWidth?: string | number;
  align?: "left" | "center" | "right";
  headerAlign?: "left" | "center" | "right";
  slot?: string;
  headerSlot?: string;
  fixed?: "left" | "right";
}

const props = withDefaults(
  defineProps<{
    /** 表格数据 */
    data: T[];
    /** 列配置 */
    columns: SecLabTableColumn[];
    /** 是否显示全网格边框 */
    border?: boolean;
    /** 无数据时显示的占位文案 */
    emptyText?: string;
    /** 稳定行键字段或计算函数。 */
    rowKey?: string | ((row: T) => SecLabTableRowKey);
    /** 是否显示内置选择列。 */
    selectable?: boolean;
    /** 当前选中的稳定行键。 */
    selectedRowKeys?: SecLabTableRowKey[];
    /** 判断一行是否允许选择。 */
    rowSelectable?: (row: T, index: number) => boolean;
    /** 全选复选框的无障碍名称。 */
    selectAllLabel?: string;
    /** 行复选框的无障碍名称或计算函数。 */
    selectRowLabel?: string | ((row: T, index: number) => string);
    /** 选择列宽度。 */
    selectionColumnWidth?: number;
  }>(),
  {
    border: false,
    emptyText: "暂无数据",
    selectable: false,
    selectedRowKeys: () => [],
    selectAllLabel: "Select all rows on this page",
    selectRowLabel: "Select row",
    selectionColumnWidth: 48,
  },
);

const emit = defineEmits<{
  rowMouseenter: [row: T, event: MouseEvent, index: number];
  rowContextmenu: [row: T, event: MouseEvent, index: number];
  "update:selectedRowKeys": [keys: SecLabTableRowKey[]];
  selectionChange: [keys: SecLabTableRowKey[]];
}>();

const selectedKeySet = computed(() => new Set(props.selectedRowKeys));
const selectableRows = computed(() =>
  props.data
    .map((row, index) => ({ row, index, key: resolveRowKey(row, index) }))
    .filter(({ row, index }) => isRowSelectable(row, index)),
);
const allPageRowsSelected = computed(
  () =>
    selectableRows.value.length > 0 &&
    selectableRows.value.every(({ key }) => selectedKeySet.value.has(key)),
);
const somePageRowsSelected = computed(
  () =>
    !allPageRowsSelected.value &&
    selectableRows.value.some(({ key }) => selectedKeySet.value.has(key)),
);

/**
 * 格式化宽度数值
 */
function formatWidth(width?: string | number) {
  if (width === undefined) return undefined;
  return typeof width === "number" ? `${width}px` : width;
}

/**
 * 获取表头单元格的样式
 */
function getHeaderStyle(col: SecLabTableColumn) {
  return {
    width: formatWidth(col.width),
    minWidth: formatWidth(col.minWidth),
    textAlign: col.headerAlign || col.align || "center", // 默认表头居中
  };
}

/**
 * 获取数据单元格的样式
 */
function getCellStyle(col: SecLabTableColumn) {
  return {
    width: formatWidth(col.width),
    minWidth: formatWidth(col.minWidth),
    textAlign: col.align || "left", // 默认内容居左
  };
}
function fixedOffset(index: number, side: "left" | "right") {
  const range =
    side === "left"
      ? props.columns.slice(0, index)
      : props.columns.slice(index + 1);
  const columnOffset = range
    .filter((column) => column.fixed === side)
    .reduce(
      (total, column) =>
        total + (typeof column.width === "number" ? column.width : 0),
      0,
    );
  return side === "left" && props.selectable
    ? columnOffset + props.selectionColumnWidth
    : columnOffset;
}
function getColumnStyle(
  col: SecLabTableColumn,
  index: number,
  header = false,
): CSSProperties {
  const base = header ? getHeaderStyle(col) : getCellStyle(col);
  return col.fixed
    ? {
        ...base,
        position: "sticky",
        [col.fixed]: `${fixedOffset(index, col.fixed)}px`,
      }
    : base;
}
function resolveRowKey(row: T, index: number) {
  if (typeof props.rowKey === "function") return props.rowKey(row);
  if (props.rowKey) return row[props.rowKey];
  return index;
}

/** 判断指定行是否允许选择。 */
function isRowSelectable(row: T, index: number) {
  return props.rowSelectable?.(row, index) ?? true;
}

/** 生成行选择控件的无障碍名称。 */
function resolveSelectRowLabel(row: T, index: number) {
  return typeof props.selectRowLabel === "function"
    ? props.selectRowLabel(row, index)
    : props.selectRowLabel;
}

/** 发出受控选择状态更新。 */
function updateSelection(keys: SecLabTableRowKey[]) {
  emit("update:selectedRowKeys", keys);
  emit("selectionChange", keys);
}

/** 更新单行选择状态。 */
function updateRowSelection(row: T, index: number, selected: boolean) {
  if (!isRowSelectable(row, index)) return;
  const key = resolveRowKey(row, index);
  const next = new Set(props.selectedRowKeys);
  if (selected) next.add(key);
  else next.delete(key);
  updateSelection([...next]);
}

/** 选择或取消选择当前页全部可选行，同时保留其他页面的选择。 */
function updatePageSelection(selected: boolean) {
  const next = new Set(props.selectedRowKeys);
  for (const { key } of selectableRows.value) {
    if (selected) next.add(key);
    else next.delete(key);
  }
  updateSelection([...next]);
}
</script>

<template>
  <div
    class="sl-table-container"
    :class="{ 'sl-table-border': border }"
    data-native-context-menu
  >
    <div class="sl-table-wrapper">
      <table class="sl-table">
        <thead>
          <tr class="sl-table-header-row">
            <th
              v-if="selectable"
              class="sl-table-header-cell sl-table-selection-cell is-fixed-left"
              :style="{
                width: `${selectionColumnWidth}px`,
                minWidth: `${selectionColumnWidth}px`,
                left: '0',
              }"
              data-slot="selection-header"
            >
              <div class="sl-cell sl-table-selection-control">
                <SecLabCheckbox
                  :model-value="allPageRowsSelected"
                  :indeterminate="somePageRowsSelected"
                  :disabled="selectableRows.length === 0"
                  :aria-label="selectAllLabel"
                  data-ui="table-select-all"
                  @change="updatePageSelection"
                />
              </div>
            </th>
            <th
              v-for="(col, index) in columns"
              :key="index"
              class="sl-table-header-cell"
              :class="[col.fixed ? `is-fixed-${col.fixed}` : '']"
              :style="getColumnStyle(col, index, true)"
            >
              <div class="sl-cell">
                <!-- 如果配置了表头插槽且传入了插槽内容 -->
                <slot
                  v-if="col.headerSlot && $slots[col.headerSlot]"
                  :name="col.headerSlot"
                  v-bind="{ column: col, index, row: undefined as any }"
                ></slot>
                <template v-else>
                  {{ col.label }}
                </template>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="data.length > 0">
            <tr
              v-for="(row, rowIndex) in data"
              :key="resolveRowKey(row, rowIndex)"
              class="sl-table-row"
              :class="{
                'is-selected':
                  selectable &&
                  selectedKeySet.has(resolveRowKey(row, rowIndex)),
              }"
              @mouseenter="
                (event) => emit('rowMouseenter', row, event, rowIndex)
              "
              @contextmenu="
                (event) => emit('rowContextmenu', row, event, rowIndex)
              "
            >
              <td
                v-if="selectable"
                class="sl-table-cell sl-table-selection-cell is-fixed-left"
                :style="{
                  width: `${selectionColumnWidth}px`,
                  minWidth: `${selectionColumnWidth}px`,
                  left: '0',
                }"
                data-slot="selection-cell"
              >
                <div class="sl-cell sl-table-selection-control">
                  <SecLabCheckbox
                    :model-value="
                      selectedKeySet.has(resolveRowKey(row, rowIndex))
                    "
                    :disabled="!isRowSelectable(row, rowIndex)"
                    :aria-label="resolveSelectRowLabel(row, rowIndex)"
                    data-ui="table-row-selection"
                    @change="
                      (selected) => updateRowSelection(row, rowIndex, selected)
                    "
                  />
                </div>
              </td>
              <td
                v-for="(col, colIndex) in columns"
                :key="colIndex"
                class="sl-table-cell"
                :class="[col.fixed ? `is-fixed-${col.fixed}` : '']"
                :style="getColumnStyle(col, colIndex)"
              >
                <div class="sl-cell">
                  <!-- 如果配置了插槽且传入了插槽内容 -->
                  <slot
                    v-if="col.slot && $slots[col.slot]"
                    :name="col.slot"
                    v-bind="{ row, column: col, index: rowIndex }"
                  ></slot>
                  <!-- 否则渲染普通的 prop 数据 -->
                  <template v-else>
                    {{ col.prop ? row[col.prop] : "" }}
                  </template>
                </div>
              </td>
            </tr>
          </template>
          <!-- 空状态 -->
          <tr v-else>
            <td
              :colspan="columns.length + (selectable ? 1 : 0)"
              class="sl-table-empty-cell"
            >
              <slot name="empty">
                <div class="sl-table-empty">{{ emptyText }}</div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.sl-table-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  border-radius: var(--sdl-radius-md);
}

.sl-table-wrapper {
  width: 100%;
  flex: 1;
  min-height: 0;
  overflow: auto;
  scrollbar-width: thin;
}

.sl-table {
  width: 100%;
  min-width: max-content;
  border-spacing: 0;
  border-collapse: separate;
  table-layout: auto;
}

/* 表头样式 */
.sl-table-header-cell {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: var(--sdl-bg-muted);
  color: var(--sdl-text-primary);
  font-size: var(--sdl-font-body-sm);
  font-weight: 600;
  padding: var(--sdl-space-3) 0;
  border-bottom: 1px solid var(--sdl-border-default);
  white-space: nowrap;
  user-select: none;
}

/* 单元格通用样式 */
.sl-table-cell {
  background-color: transparent;
  color: var(--sdl-text-primary);
  font-size: var(--sdl-font-body-sm);
  font-weight: 500;
  padding: var(--sdl-space-2) 0;
  border-bottom: 1px solid var(--sdl-border-default);
  transition: background-color 0.2s;
}

.sl-table-row.is-selected .sl-table-cell {
  background-color: var(--sdl-bg-active);
}

.sl-cell {
  padding: 0 var(--sdl-space-3);
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
}

.sl-table-selection-cell {
  box-sizing: border-box;
  padding-left: 0;
  padding-right: 0;
}

.sl-table-selection-control {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1;
}

/* 边框模式样式 */
.sl-table-border {
  border: 1px solid var(--sdl-border-default);
}

.sl-table-border .sl-table-header-cell,
.sl-table-border .sl-table-cell {
  border-right: 1px solid var(--sdl-border-default);
}

.sl-table-border .sl-table-header-cell:last-child,
.sl-table-border .sl-table-cell:last-child {
  border-right: none;
}

/* 固定列实现 (简单版) */
.is-fixed-right {
  position: sticky;
  right: 0;
  z-index: 20;
  background-color: var(--sdl-bg-panel); /* 固定列需要有不透明背景 */
}
.is-fixed-left {
  position: sticky;
  left: 0;
  z-index: 20;
  background-color: var(--sdl-bg-panel);
}
.sl-table-header-cell.is-fixed-left {
  z-index: 30;
}

/* 如果表头也有固定列，层级需要更高 */
.sl-table-header-cell.is-fixed-right {
  z-index: 30;
}

/* 空状态样式 */
.sl-table-empty-cell {
  padding: var(--sdl-space-8) 0;
  text-align: center;
}

.sl-table-empty {
  color: var(--sdl-text-muted);
  font-size: var(--sdl-font-body-sm);
}

/* 滚动条美化 */
.sl-table-wrapper::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.sl-table-wrapper::-webkit-scrollbar-thumb {
  background: var(--sdl-scrollbar-thumb);
  border-radius: var(--sdl-radius-pill);
}

.sl-table-wrapper::-webkit-scrollbar-track {
  background: var(--sdl-scrollbar-track);
}
</style>
