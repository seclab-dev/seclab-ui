# @seclab-dev/react

SecLab React 19 基础组件库，实现 SecLab Design Language（SDL）的通用交互和视觉规范。

## 安装

```bash
pnpm add @seclab-dev/react @seclab-dev/icons @seclab-dev/tokens
```

项目需要安装 React 19：

```bash
pnpm add react react-dom
```

## 样式

在全局样式入口导入主题变量和组件样式：

```css
@import "@seclab-dev/tokens/index.css";
@import "@seclab-dev/react/style.css";
```

## 使用

组件采用按需导入：

```tsx
import { useState } from "react";
import {
  SecLabButton,
  SecLabFormItem,
  SecLabIcon,
  SecLabInput,
} from "@seclab-dev/react";

export default function SearchPanel() {
  const [keyword, setKeyword] = useState("");

  return (
    <div>
      <SecLabFormItem
        label="关键词"
        htmlFor="search-keyword"
        labelId="search-keyword-label"
        hint="输入名称或标识"
        hintId="search-keyword-hint"
      >
        <SecLabInput
          id="search-keyword"
          value={keyword}
          name="keyword"
          ariaLabelledby="search-keyword-label"
          ariaDescribedby="search-keyword-hint"
          onChange={setKeyword}
          placeholder="搜索"
        />
      </SecLabFormItem>
      <SecLabButton type="primary">
        <SecLabIcon name="search" size={16} />
        查询
      </SecLabButton>
    </div>
  );
}
```

`SecLabInput`、`SecLabCheckbox` 和 `SecLabSelect` 未提供 `id` 时会自动生成；参与原生表单提交时应提供 `name`。复杂控件可通过 `ariaLabelledby` 和 `ariaDescribedby` 显式关联 `SecLabFormItem` 的标签、提示与错误节点。

受控组件的 `value`（Checkbox 为 `checked`）为必填，变化统一通过 `onChange` 返回。React DOM 属性使用 `readOnly`、`maxLength`、`autoComplete`、`htmlFor` 和 `className` 等惯用名称，不提供小写兼容别名；业务参数、默认值及配置对象字段与 Vue 契约保持一致。

## 组件范围

- 操作：按钮、操作菜单
- 输入：输入框、选择器、开关、复选框、日期时间范围
- 数据：表格、分页、标签、描述列表
- 容器：卡片、对话框、抽屉、模态框
- 反馈：告警、通知、加载、空状态、提示
- 导航：菜单、标签页、面包屑

完整用途、交互、无障碍语义及跨框架映射参见[共享组件契约](https://github.com/seclab-dev/seclab-ui/tree/dev/docs/components)。实际 Props、事件和类型声明以发布包中的 TypeScript 类型为准。

## 约束

- 组件不依赖业务 API、任何全局状态管理库或路由。
- 视觉变量由 `@seclab-dev/tokens` 提供。
- 图标由 `@seclab-dev/icons` 提供。
- `react` 和 `react-dom` 是 peer dependencies，不会被组件库重复打包。
