# Changelog

格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，并遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### Changed

- 导航示例改为打开套件中心，不再示范通过主控应用传递和渲染 HTML 内容。

## [0.1.0-alpha.2] - 2026-07-08

### Added

- 新增套件端 `bridge.navigate()`，支持套件请求主控执行统一导航动作。
- 新增 `SuiteNavigationPayload`，支持打开主控应用、外链、套件中心和桌面等导航目标。
- 支持导航请求携带 `payload`，用于向目标应用传递上下文数据。

### Changed

- 完善套件 SDK 文档，补充导航、通知、窗口聚焦和协议消息说明。

## [0.1.0-alpha.1] - 2026-06-28

### Added

- 首次发布 SecLab 套件集成 SDK。
- 提供套件端 `createSuiteBridge`，支持就绪上报、主题同步和消息订阅。
- 提供主控端 `createSuiteHostBridge`，支持向 iframe 套件推送主题。
- 支持主控向套件同步国际化语言，并提供套件端语言订阅能力。
- 支持套件请求主控展示统一通知，并在独立运行时降级为套件本地通知。
- 支持套件独立运行时使用系统主题作为降级方案。
