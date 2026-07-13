# SecLab UI

`seclab-ui` 是 SecLab Design Language、通用图标、基础组件和套件集成 SDK 的工作区。主控、API 治理库和官方套件通过该仓库共享一致的视觉语言与交互基础。

## 包结构

| 包                      | 说明                                         |
| ----------------------- | -------------------------------------------- |
| `@seclab-dev/tokens`    | SDL 主题变量、颜色、间距、圆角、阴影和层级。 |
| `@seclab-dev/icons`     | SVG 图标、命名空间图标表和兜底图标。         |
| `@seclab-dev/vue`       | Vue 3 基础组件库。                           |
| `@seclab-dev/react`     | React 19 基础组件库。                        |
| `@seclab-dev/suite-sdk` | 套件 iframe 与主控通信 SDK。                 |

辅助项目：

| 目录                | 说明                   |
| ------------------- | ---------------------- |
| `playground/`       | Vue 组件预览。         |
| `playground-react/` | React 组件预览。       |
| `scripts/`          | 包检查和发布辅助脚本。 |

## 开发命令

```bash
pnpm install
pnpm dev
pnpm dev:react
pnpm check
pnpm build
pnpm test:e2e
```

## 文档与测试

- [组件契约](./docs/components/README.md)
- [贡献指南](./CONTRIBUTING.md)
- `pnpm format:check`：检查代码格式，不改写文件。
- `pnpm check`：格式、类型、构建、单元测试、消费者构建和包归档检查。
- `pnpm test:e2e`：运行 Chromium 行为与视觉回归测试。
- `pnpm test:e2e:update`：人工确认视觉变更后更新截图基线。

Pull Request 和 `main` 分支推送必须通过完整质量检查；软件包发布前还会重复执行非浏览器检查。

单包构建：

```bash
pnpm --filter @seclab-dev/icons build
pnpm --filter @seclab-dev/vue build
pnpm --filter @seclab-dev/react build
```

## 使用示例

样式入口：

```css
@import "@seclab-dev/tokens/index.css";
```

Vue：

```vue
<script setup lang="ts">
import { SecLabButton, SecLabIcon } from "@seclab-dev/vue";
</script>

<template>
  <SecLabButton type="primary">
    <SecLabIcon name="settings" :size="16" />
    设置
  </SecLabButton>
</template>
```

React：

```tsx
import { SecLabButton, SecLabIcon } from "@seclab-dev/react";

export function SettingsButton() {
  return (
    <SecLabButton type="primary">
      <SecLabIcon name="settings" size={16} />
      设置
    </SecLabButton>
  );
}
```
