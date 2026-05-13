## Why

当前网站标题为默认的 "my-website"，`lang` 属性为 "en"，缺少 meta description、Open Graph 标签和 robots.txt。搜索引擎无法正确索引中文内容，社交平台分享链接时也无法生成预览卡片。需要在部署前补齐 SEO 基础配置。

## What Changes

- 在 `index.html` 中设置正确的 `<title>`（如「张三 - 全栈开发工程师」）、`<meta name="description">`、`lang="zh-CN"`
- 添加 Open Graph 标签（`og:title`、`og:description`、`og:image`、`og:url`、`og:type`）用于社交平台链接预览
- 添加 Twitter Card 标签（`twitter:card`、`twitter:title`、`twitter:description`、`twitter:image`）
- 审查并修复现有组件中的语义化 HTML 问题（如缺少 `<main>`、`<header>` 地标）
- 添加 `public/robots.txt` 允许 Google 等搜索引擎爬虫索引
- 添加 `public/sitemap.xml` 站点地图

## Capabilities

### New Capabilities

- `seo`: HTML 元数据配置（title、description、OG、Twitter Card）、robots.txt 爬虫规则、语义化 HTML 地标审查

### Modified Capabilities

<!-- 无 — 语义化 HTML 修改不涉及 spec 级行为变更 -->

## Impact

- 修改 `index.html`：title、description、OG、Twitter Card 标签
- 新增 `public/robots.txt`
- 新增 `public/sitemap.xml`
- 修改 `src/App.tsx`：用 `<main>` 包裹主要内容区域，`<header>` 包裹导航
- 可能修改 Navbar 中的 `<span>` 品牌名改为语义化标签
- 不影响任何组件的视觉表现或交互行为

## Out of Scope

- 不做 Google Analytics / GTM 埋点
- 不做结构化数据（JSON-LD / Schema.org）
- 不做多语言 SEO（hreflang）
- 不做搜索引擎注册和提交（Google Search Console）
- 不做 canonical URL 配置
