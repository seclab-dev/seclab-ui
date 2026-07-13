# @seclab-dev/vue

SecLab Vue 3 基础组件库，实现 SecLab Design Language（SDL）的通用交互和视觉规范。

## 安装

```bash
pnpm add @seclab-dev/vue @seclab-dev/icons @seclab-dev/tokens
```

项目需要安装 Vue 3：

```bash
pnpm add vue
```

## 样式

在全局样式入口导入主题变量和组件样式：

```css
@import "@seclab-dev/tokens/index.css";
@import "@seclab-dev/vue/style.css";
```

## 使用

组件采用按需导入：

```vue
<script setup lang="ts">
import { SecLabButton, SecLabIcon, SecLabInput } from "@seclab-dev/vue";

const keyword = defineModel<string>({ default: "" });
</script>

<template>
  <SecLabInput v-model="keyword" placeholder="搜索" />
  <SecLabButton type="primary">
    <SecLabIcon name="search" :size="16" />
    查询
  </SecLabButton>
</template>
```

## 组件范围

- 操作：按钮、操作菜单
- 输入：输入框、选择器、开关、复选框、日期时间范围
- 数据：表格、分页、标签、描述列表
- 容器：卡片、对话框、抽屉、模态框
- 反馈：告警、通知、加载、空状态、提示
- 导航：菜单、标签页、面包屑

完整用途、交互、无障碍语义及跨框架映射参见[共享组件契约](https://github.com/seclab-dev/seclab-ui/tree/dev/docs/components)。实际 Props、事件和类型声明以发布包中的 TypeScript 类型为准。

## 约束

- 组件不依赖业务 API、Pinia Store 或 Vue Router。
- 视觉变量由 `@seclab-dev/tokens` 提供。
- 图标由 `@seclab-dev/icons` 提供。
- `vue` 是 peer dependency，不会被组件库重复打包。
