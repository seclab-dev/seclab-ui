<script setup lang="ts" generic="T extends Record<string, any>">
/**
 * @file SecLabTable.vue
 * @description SecLab 平台自研表格组件，严格遵循 SDL 设计规范。
 * 支持数据驱动列配置、自定义插槽渲染、固定列以及全网格边框。
 */

export interface SecLabTableColumn {
  prop?: string;
  label: string;
  width?: string | number;
  minWidth?: string | number;
  align?: "left" | "center" | "right";
  headerAlign?: "left" | "center" | "right";
  slot?: string;
  headerSlot?: string;
  fixed?: string;
}

withDefaults(
  defineProps<{
    /** 表格数据 */
    data: T[];
    /** 列配置 */
    columns: SecLabTableColumn[];
    /** 是否显示全网格边框 */
    border?: boolean;
    /** 无数据时显示的占位文案 */
    emptyText?: string;
  }>(),
  {
    border: false,
    emptyText: "暂无数据",
  },
);

const emit = defineEmits<{
  rowMouseenter: [row: T, event: MouseEvent, index: number];
  rowContextmenu: [row: T, event: MouseEvent, index: number];
}>();

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
              v-for="(col, index) in columns"
              :key="index"
              class="sl-table-header-cell"
              :class="[col.fixed ? `is-fixed-${col.fixed}` : '']"
              :style="getHeaderStyle(col)"
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
              :key="rowIndex"
              class="sl-table-row"
              @mouseenter="
                (event) => emit('rowMouseenter', row, event, rowIndex)
              "
              @contextmenu="
                (event) => emit('rowContextmenu', row, event, rowIndex)
              "
            >
              <td
                v-for="(col, colIndex) in columns"
                :key="colIndex"
                class="sl-table-cell"
                :class="[col.fixed ? `is-fixed-${col.fixed}` : '']"
                :style="getCellStyle(col)"
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
            <td :colspan="columns.length" class="sl-table-empty-cell">
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

.sl-cell {
  padding: 0 var(--sdl-space-3);
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
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
