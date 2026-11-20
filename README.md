# 大数据可视化大屏合集 · React

**142 套**精选数据可视化大屏，使用 **React + React Router + Vite** 重构，按两个合集分组展示。

## ✨ 特性

- 🗂️ **双合集 Tab 切换**：首页顶部 Tab 在「大屏合集 ①（117 套）」与「大屏合集 ②（25 套 · 按行业分类）」间切换
- 🖼️ **缩略图墙**：每套大屏以「缩略图 + 名称」展示，支持按名称/编号搜索
- 🖱️ **点击进入全屏**：点击缩略图，路由跳转 `/screen/:id`，全屏展示该大屏
- 🧼 **纯净展示**：大屏页内除大屏本身与数据外，无任何多余按钮
- 🔀 **全部路由控制**：`HashRouter`，刷新、直达链接均可用；支持 `#/?tab=b` 深链到第二个合集
- 🚀 **GitHub Pages 在线预览**

## 🔗 在线预览

👉 https://boyueli007.github.io/big-data-view-react/

## 🛠️ 本地运行

```bash
npm install
npm run dev
```

## 📦 构建（GitHub Pages 子路径）

```bash
GH_BASE=/big-data-view-react/ npm run build
```

## 📁 目录结构

```
public/
  screens/    # 合集① 117 套原始大屏（按编号）
  screens2/   # 合集② 25 套大屏（按 s001…s025）
  thumbs/     # 合集① 缩略图
  thumbs2/    # 合集② 缩略图
  .nojekyll
src/
  manifest.json   # 合集① 清单
  manifest2.json  # 合集② 清单（含行业分类 cat）
  pages/Gallery   # 首页（Tab + 缩略图墙）
  pages/Screen    # 全屏大屏页（iframe）
docs/         # 构建产物（GitHub Pages 从此发布）
```

## 🧭 路由

| 路由 | 说明 |
| --- | --- |
| `/` | 缩略图墙（Tab 切换两个合集） |
| `/?tab=b` | 直接打开合集② |
| `/screen/:id` | 全屏展示对应编号大屏（① 数字 id，② sNNN） |

## ⚠️ 已知说明

部分大屏（约 20 套）源文件引用了 `http://` 的外部资源（如百度地图 API、旧版 CDN 脚本），
在 HTTPS 的 GitHub Pages 上会因混合内容（mixed content）被浏览器拦截，导致其中地图/图表无法加载。
这是原始模板自带的问题；本地 `http://` 环境或替换为 https/本地资源后可正常。

原始大屏均来自网络收集整理，仅用于学习交流。
