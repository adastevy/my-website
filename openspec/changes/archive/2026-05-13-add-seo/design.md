## Context

当前 `index.html` 仅包含最基础的 meta 标签（charset、viewport）和 generic title "my-website"，缺少搜索引擎所需的 description、社交平台所需的 Open Graph / Twitter Card 标签。`public/` 目录无 robots.txt、sitemap.xml。React 组件中缺少 `<main>` 和 `<header>` 语义地标，App.tsx 顶层用空 Fragment 包裹。

部署目标：GitHub Pages，base path `/my-website/`。SEO 方案需与静态部署兼容，不引入运行时 SEO 插件。

## Goals / Non-Goals

**Goals:**
- 在 `index.html` 中集中配置所有 meta 标签（title、description、OG、Twitter Card）
- 添加 `public/robots.txt` 和 `public/sitemap.xml`
- 修复语义化 HTML：`<header>` 包裹 Navbar、`<main>` 包裹内容区
- HTML `lang` 属性设为 `zh-CN`

**Non-Goals:**
- 不做 JSON-LD 结构化数据
- 不做 Google Analytics/GTM
- 不做多语言 hreflang
- 不引入 react-helmet 等运行时 head 管理库

## Decisions

**1. Meta 标签方案：静态 index.html vs 运行时注入**
选静态 `index.html`。原因：站点是 SPA 但内容固定，不需要动态 head 管理。所有 meta 标签在 build 时已确定，运行时注入（如 react-helmet）增加了 bundle 体积和复杂度，对爬虫也不友好（部分爬虫不执行 JS）。

**2. OG Image**
使用 1200×630 px 的静态 PNG 图片放置于 `public/images/og-image.png`。包含网站名称和简短描述，用于社交平台链接预览。如无法及时设计，先使用占位或纯色背景。

**3. robots.txt 策略**
```
User-agent: *
Allow: /
Sitemap: https://<username>.github.io/my-website/sitemap.xml
```
允许全部爬虫索引，指向 sitemap。

**4. sitemap.xml 策略**
手写静态 XML，列出首页（唯一的页面）。后续有更多页面时手动添加 `<url>` 条目。

**5. 语义化 HTML 改造**
- `App.tsx`：Fragment `<>` → 添加 `<header>` + `<main>` 地标
- Navbar 已在 `<nav>` 中（符合规范），无需改动
- Hero、ProjectSection、AboutSection 使用 `<section>`（已正确）
- 品牌名 `<span>` → 保持 `<span>`（导航内无需 heading）

## Risks / Trade-offs

- **静态 meta 标签不支持动态路由** → 当前仅单页应用，无风险
- **OG Image 可能缺失影响社交预览** → 先提供简单占位，后续可优化设计
- **GitHub Pages 不自动识别 sitemap** → 需在 Google Search Console 手动提交 URL，out of scope
