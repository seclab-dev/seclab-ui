# @seclab-dev/tokens

SecLab Design Language（SDL）主题变量包，为 SecLab 前端项目提供统一的颜色、字体、间距、圆角、阴影和层级定义。

## 安装

```bash
pnpm add @seclab-dev/tokens
```

使用 GitHub Packages 时，需要在项目 `.npmrc` 中配置 `@seclab-dev` 作用域和读取令牌。

## 使用

在应用的全局样式入口导入：

```css
@import "@seclab-dev/tokens/index.css";
```

业务样式通过 `--sdl-*` 变量引用：

```css
.panel {
  color: var(--sdl-text-primary);
  background: var(--sdl-bg-panel);
  border: 1px solid var(--sdl-border-default);
  border-radius: var(--sdl-radius-md);
  padding: var(--sdl-space-4);
}
```

## 主题

默认主题为浅色，无需设置主题属性。需要显式声明时使用：

```html
<html data-theme="light"></html>
```

切换到深色主题：

```html
<html data-theme="dark"></html>
```

消费项目专属的图片、字体和其他静态资源路径不属于公共 Token，应由消费项目自行定义。

## 主要变量

- 背景：`--sdl-bg-*`
- 文本：`--sdl-text-*`
- 品牌与状态：`--sdl-primary`、`--sdl-success`、`--sdl-warning`、`--sdl-danger`
- 边框：`--sdl-border-*`
- 字体：`--sdl-font-*`
- 间距：`--sdl-space-*`
- 圆角：`--sdl-radius-*`
- 层级：`--sdl-z-index-*`
