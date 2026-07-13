# 组件契约

本目录是 `@seclab-dev/vue` 与 `@seclab-dev/react` 的共享行为契约。公开类型仍以发布包 TypeScript 声明为准；本文档约束组件用途、交互语义和跨框架一致性。

| 分类                    | 组件                                                           |
| ----------------------- | -------------------------------------------------------------- |
| [操作](./actions.md)    | Button、ActionMenu                                             |
| [输入](./inputs.md)     | Input、Select、Switch、Checkbox、DateTimeRangePicker、FormItem |
| [数据](./data.md)       | Table、Pagination、Tag、Descriptions                           |
| [容器](./containers.md) | Card、Dialog、Drawer、Modal                                    |
| [反馈](./feedback.md)   | Alert、Toast、Loading、Empty、Tooltip、Icon                    |
| [导航](./navigation.md) | Tabs、Menu、Breadcrumb、BreadcrumbItem                         |

## 跨框架约定

- Vue 使用 `modelValue` / `update:modelValue`；React 使用 `value` / `onChange`。
- Vue 自定义内容使用 slot；React 使用 `children`、render 属性或对应回调。
- 交互组件的键盘路径、禁用行为、ARIA 语义和视觉状态必须一致。
- 默认场景同时验证正常、禁用、错误、加载和 320px 窄屏状态；高风险浮层还需验证视口边缘和祖先滚动。
