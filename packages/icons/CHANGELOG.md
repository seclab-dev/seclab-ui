# Changelog

格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，并遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

## [0.1.0-alpha.1] - 2026-06-28

### Added

- 首次发布 SecLab 自有 SVG 图标包。
- 提供应用、状态、接口治理、基础交互、文件传输、生命周期和窗口控制图标。
- 提供主机空闲、扫描中、存活、开放端口和无响应状态图标。
- 提供 `getIcon` 与 `iconMap` 接口，并在图标不存在时回退到默认图标。
- `common` 与 `apps` 使用独立命名空间，允许同名图标并存。
- `getIcon` 支持指定命名空间，`iconMap` 按命名空间组织。
- 默认兜底图标仅保留在 `common` 命名空间。
