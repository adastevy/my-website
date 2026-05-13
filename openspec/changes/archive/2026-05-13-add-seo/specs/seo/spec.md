## ADDED Requirements

### Requirement: HTML document has correct language and encoding

系统 SHALL 在 `index.html` 中声明语言为 `zh-CN` 和字符编码为 UTF-8。

#### Scenario: Browser loads the page

- **GIVEN** 搜索引擎爬虫或浏览器访问网站
- **WHEN** 解析 HTML 文档
- **THEN** `<html>` 标签的 `lang` 属性为 `zh-CN`
- **AND** `<meta charset>` 为 `UTF-8`

### Requirement: Page has a meaningful title

系统 SHALL 在 `<title>` 标签中提供包含姓名和职业的描述性标题。

#### Scenario: Search engine indexes the page

- **GIVEN** 搜索引擎爬虫访问网站
- **WHEN** 解析 `<head>` 内容
- **THEN** `<title>` 标签包含用户姓名和职业关键词
- **AND** 标题长度不超过 60 个字符

#### Scenario: User opens page in browser tab

- **GIVEN** 用户在浏览器中打开网站
- **WHEN** 页面加载
- **THEN** 浏览器标签页显示网站标题（而非默认 "my-website"）

### Requirement: Page has a meta description

系统 SHALL 提供 `<meta name="description">` 标签，描述网站内容和作者信息。

#### Scenario: Search result snippet

- **GIVEN** 搜索引擎已索引网站
- **WHEN** 网站在搜索结果中展示
- **THEN** 搜索结果摘要使用 meta description 的内容
- **AND** description 长度在 120–160 字符之间

### Requirement: Open Graph tags for social sharing

系统 SHALL 提供 Open Graph 标签，确保社交平台分享链接时生成预览卡片。

#### Scenario: URL shared on social platforms (WeChat, Twitter, Facebook)

- **GIVEN** 用户在社交平台粘贴网站 URL
- **WHEN** 平台爬虫抓取页面
- **THEN** 解析到 `og:title`、`og:description`、`og:image`、`og:url`、`og:type` 标签
- **AND** 生成的预览卡片显示网站标题、描述和图片
- **AND** `og:type` 为 `website`
- **AND** `og:url` 包含完整的 GitHub Pages 路径

#### Scenario: OG image is accessible

- **GIVEN** 社交平台爬虫请求 `og:image` URL
- **WHEN** 图片文件存在于服务器
- **THEN** 返回 200 状态码
- **AND** 图片尺寸为 1200×630 px（推荐）

### Requirement: Twitter Card tags

系统 SHALL 提供 Twitter Card 标签，确保在 Twitter/X 上分享链接时展示摘要卡片。

#### Scenario: URL shared on Twitter/X

- **GIVEN** 用户在 Twitter/X 发布包含网站 URL 的推文
- **WHEN** Twitter 爬虫抓取页面
- **THEN** 解析到 `twitter:card`（值为 `summary_large_image`）
- **AND** 解析到 `twitter:title`、`twitter:description`、`twitter:image`
- **AND** 展示大图卡片而非缩略图

### Requirement: robots.txt allows search engine crawling

系统 SHALL 在站点根路径提供 `robots.txt`，明确允许搜索引擎爬虫索引。

#### Scenario: Googlebot crawls the site

- **GIVEN** `public/robots.txt` 文件存在
- **WHEN** Googlebot 请求 `/robots.txt`
- **THEN** 返回 200 状态码
- **AND** 包含 `User-agent: *` 和 `Allow: /` 指令
- **AND** 引用 sitemap 位置

#### Scenario: robots.txt is accessible at root

- **GIVEN** 站点部署到 GitHub Pages（base path `/my-website/`）
- **WHEN** 爬虫请求根路径 `/robots.txt`
- **THEN** 文件可访问（GitHub Pages 直接从仓库 root 提供）

### Requirement: Sitemap XML lists all pages

系统 SHALL 提供 `sitemap.xml` 站点地图，列出网站所有可索引页面。

#### Scenario: Search engine requests sitemap

- **GIVEN** `public/sitemap.xml` 文件存在
- **WHEN** 搜索引擎请求 `/sitemap.xml`
- **THEN** 返回有效的 XML 文档
- **AND** 包含首页 `<url>` 条目
- **AND** 每个条目包含 `<loc>`、`<lastmod>`、`<priority>` 字段

### Requirement: Semantic HTML landmarks are present

系统 SHALL 使用 HTML5 语义地标元素组织页面结构。

#### Scenario: Screen reader navigates the page

- **GIVEN** 用户使用屏幕阅读器访问网站
- **WHEN** 页面渲染完成
- **THEN** `<header>` 元素包裹导航栏
- **AND** `<main>` 元素包裹主要内容区域（Hero、About、Projects）
- **AND** 各内容区块使用 `<section>` 元素
- **AND** 每个 `<section>` 有明确的 `<h1>` 或 `<h2>` 标题

#### Scenario: Existing components still render correctly

- **GIVEN** App.tsx 修改了外层包裹结构
- **WHEN** 页面加载
- **THEN** 所有组件视觉呈现不变
- **AND** 不影响粒子背景渲染
- **AND** 不影响主题切换功能
