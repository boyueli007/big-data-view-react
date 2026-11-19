# 大数据可视化大屏合集 · React

117 套精选数据可视化大屏，使用 **React + React Router + Vite** 重构。

## ✨ 特性

- 🖼️ **首页缩略图墙**：每套大屏以「缩略图 + 名称」的形式展示，支持按名称/编号搜索
- 🖱️ **点击进入全屏**：点击任意缩略图，路由跳转到 `/screen/:id`，全屏展示该大屏
- 🧼 **纯净展示**：大屏页面内除大屏本身与数据外，没有任何多余按钮
- 🔀 **全部路由控制**：`HashRouter` 控制，刷新、直达链接均可用
- 🚀 **GitHub Pages 在线预览**：开箱即用

## 🔗 在线预览

👉 https://boyueli007.github.io/big-data-view-react/

## 🛠️ 本地运行

```bash
npm install
npm run dev
```

## 📦 构建

```bash
npm run build      # 输出到 dist/
```

针对 GitHub Pages 项目站点（`/<repo>/` 子路径），构建时需指定 base：

```bash
GH_BASE=/big-data-view-react/ npm run build
```

## 📁 目录结构

```
public/
  screens/    # 117 套原始大屏静态页面（按编号）
  thumbs/     # 大屏缩略图
  .nojekyll   # 关闭 GitHub Pages 的 Jekyll 处理
src/
  manifest.json   # 大屏清单（编号、名称、入口、缩略图）
  pages/Gallery   # 缩略图展示页
  pages/Screen    # 全屏大屏页（iframe 载入原始页面）
docs/         # 构建产物（GitHub Pages 从此目录发布）
```

## 🧭 路由

| 路由 | 说明 |
| --- | --- |
| `/` | 缩略图 + 名称 展示墙 |
| `/screen/:id` | 全屏展示对应编号的大屏 |

## 说明

大屏原始页面均来自网络收集整理，仅用于学习交流，请勿用于商业售卖。
