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

## 📦 构建 / 部署

`docs/` 是**唯一提交的源与部署产物**（GitHub Pages 从 `main:/docs` 发布）。`public/` 是可再生的构建工作区，已 `gitignore`，由构建脚本自动从 `docs/` 补齐，无需入库。

```bash
npm install
GH_BASE=/big-data-view-react/ npm run build   # docs 静态内容 -> public -> vite build -> dist -> docs(index+assets)
```

`scripts/build.mjs` 负责：从 `docs/` 同步静态资源到 `public/`、执行 `vite build`、再把 `dist` 的 `index.html`+`assets` 回写到 `docs/`。

## 📁 目录结构

```
docs/                         # 唯一提交源 + Pages 部署产物
  screens/   screens2/        # 142 套大屏静态页面
  thumbs_opt/  thumbs2_opt/   # 首页缩略图
  enhance/                    # 大屏美化增强（CSS/JS/highmaps）
  index.html  assets/         # 构建后的 React 应用壳
src/
  manifest.json   manifest2.json   # 两合集清单（含行业分类 cat）
  pages/Gallery   pages/Screen     # 首页（Tab+缩略图墙）/ 全屏 iframe 页
scripts/build.mjs             # 构建同步脚本
```
（`public/` 为构建时临时生成，已忽略）

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
