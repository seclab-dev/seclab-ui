# Changelog

格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，并遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

## [Unreleased]

## [0.1.0-alpha.7] - 2026-07-23

### Added

- `SecLabTable` 增加受控行选择、当前页全选、半选和禁用行能力。
- 新增 `SecLabSelectionBar`，统一批量选择数量、清除入口和操作布局。

### Fixed

- `SecLabCheckbox` 在不确定状态下显示明确的半选图形。

## [0.1.0-alpha.6] - 2026-07-20

### Fixed

- `SecLabLoading` 在居中或收缩布局中保持完整容器宽度，并避免加载提示文字意外换行。

## [0.1.0-alpha.5] - 2026-07-17

### Fixed

- `SecLabActionMenu` 的 Teleport 菜单显示在 Drawer、Dialog 和 Modal 之上，避免操作项被模态遮罩遮挡。

## [0.1.0-alpha.4] - 2026-07-15

### Added

- 增加完整组件行为矩阵、跨框架回归测试、关键组件视觉基线和共享契约文档。

### Fixed

- 统一受控输入、Menu、Tabs、Tooltip 与 ActionMenu 的跨框架公开契约，消除重复事件和配置字段差异。
- `SecLabInput`、`SecLabCheckbox` 和 `SecLabSelect` 将字段标识与 ARIA 属性传递到真实控件，并在缺少 ID 时自动生成。
- `SecLabSelect` 使用按钮触发器并支持原生表单值提交；`SecLabFormItem` 为标签、提示和错误提供稳定关联点。
- `SecLabTooltip` 增加 tooltip 角色及触发器描述关联，辅助技术可以识别提示内容。
- `SecLabActionMenu` 的触发器和菜单项统一使用 SDL 字体，修复 Portal 场景下中文缺字。

## [0.1.0-alpha.3] - 2026-07-13

### Fixed

- `SecLabSelect` 根据视口可用空间自动向上或向下展开，并限制下拉列表尺寸以避免超出视口。
- 修复 Teleport 下拉内容被误判为外部点击的问题。
- ActionMenu、Tooltip 与日期时间范围选择器支持视口碰撞检测、滚动跟随和窄屏布局。
- Dialog、Drawer 与 Modal 支持 Esc 关闭、焦点陷阱、焦点恢复和嵌套滚动锁。
- Select、ActionMenu、Switch、Tabs、Menu 与 Pagination 补齐键盘操作和无障碍语义。
- Table 支持稳定行键并正确累计多个固定列偏移。
- FormItem、Input 与 Checkbox 补齐表单关联、数字值类型、密码按钮语义和不确定状态。
- Toast、Alert 与 Loading 优化窄屏布局、关闭行为和实时状态播报。

### Added

- 建立组件单元测试和 playground 浏览器回归测试，覆盖两端共享的关键交互行为。

## [0.1.0-alpha.2] - 2026-07-05

### Added

- `SecLabSelect` 支持下拉列表滚动事件和接近底部事件，便于实现滚动分页加载。
- `SecLabSelect` 支持 `dropdown-footer` 插槽，可在下拉列表底部展示加载状态等自定义内容。

## [0.1.0-alpha.1] - 2026-06-28

### Added

- 首次发布 SecLab Vue 3 基础组件库。
- 提供按钮、输入、选择、开关、复选框、日期范围和表单组件。
- 提供表格、分页、标签、描述列表、卡片和空状态组件。
- 提供弹窗、抽屉、模态框、菜单、标签页和面包屑组件。
- 提供提示、通知、加载、告警和统一 SVG 图标组件。
- 发布 ESM、TypeScript 类型声明和独立组件样式。
