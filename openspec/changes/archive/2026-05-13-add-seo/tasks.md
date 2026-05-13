## 1. HTML 元数据配置

- [x] 1.1 修改 `index.html`：设置 `lang="zh-CN"`、`<title>` 为「张三 - 全栈开发工程师」、添加 `<meta name="description">`
- [x] 1.2 添加 Open Graph 标签：`og:title`、`og:description`、`og:image`、`og:url`、`og:type`
- [x] 1.3 添加 Twitter Card 标签：`twitter:card`（summary_large_image）、`twitter:title`、`twitter:description`、`twitter:image`
- [x] 1.4 创建或放置 `public/images/og-image.png`（1200×630px 社交分享预览图）

## 2. 爬虫配置文件

- [x] 2.1 创建 `public/robots.txt`，允许全站爬虫并指向 sitemap
- [x] 2.2 创建 `public/sitemap.xml`，列出首页 URL、lastmod、priority

## 3. 语义化 HTML 审查与修复

- [x] 3.1 审查现有组件中是否已使用 `<section>`、`<nav>`、`<h1>`-`<h3>` 等语义标签
- [x] 3.2 修改 `src/App.tsx`：用 `<header>` 包裹 Navbar，用 `<main>` 包裹内容区域

## 4. 验证

- [x] 4.1 验证 `index.html` 中所有 meta 标签渲染正确
- [x] 4.2 验证 `robots.txt` 和 `sitemap.xml` 可通过浏览器直接访问
- [x] 4.3 验证语义化地标不影响现有组件视觉和交互
- [x] 4.4 运行 `npx vite build` 确保生产构建无错误
