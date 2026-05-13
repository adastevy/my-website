## Context

当前网站仅有 Hero Section 和 ThemeToggle，页面结构简单。现在需要添加顶部导航栏，让访问者能够了解网站结构并快速导航。技术栈为 React 19 + TypeScript + Tailwind CSS v4，需保持与现有组件风格一致。

## Goals / Non-Goals

**Goals:**
- 实现固定在页面顶部的导航栏，滚动到下方时出现背景模糊效果
- 左侧展示品牌名（纯文本），右侧展示三个导航链接
- 点击链接使用 `scrollIntoView({ behavior: 'smooth' })` 平滑滚动到目标 section
- 移动端（<768px）时将链接收起到汉堡菜单中
- 支持暗色模式（dark: 前缀适配）

**Non-Goals:**
- 不实现搜索功能
- 不实现多级下拉菜单
- 不实现用户登录/注册
- 不实现滚动位置检测高亮当前 section（active link）
- 不引入图片 logo

## Decisions

### 1. 组件结构：Navbar 单组件 + 内联移动端菜单

Navbar 作为一个 `src/components/Navbar/Navbar.tsx` 组件，移动端菜单逻辑内联在同一组件中（不拆分子组件），因为当前移动端菜单逻辑简单（仅 3 个链接），不需要额外抽象。

**替代方案**：拆分为 `Navbar.tsx` + `MobileMenu.tsx` 两个文件。当前菜单逻辑足够简单，拆分反而增加文件跳转成本，不采用。

### 2. 滚动检测：useEffect + scroll 事件监听

使用 `useEffect` 注册 `scroll` 事件监听，检测 `window.scrollY > 10`，控制背景模糊的开关。滚动事件使用 `passive: true` 以优化性能。

**替代方案**：使用 IntersectionObserver 监听 Hero Section 是否在视口。对于简单的 "是否滚出顶部" 判断，scroll 事件更直接，且导航栏是全局 UI，不需要复杂可见性判断。

### 3. 平滑滚动：原生 scrollIntoView API

使用 `element.scrollIntoView({ behavior: 'smooth' })` 实现平滑滚动，无需引入第三方库。目标 section 通过 `id` 属性匹配（如 `#home`, `#projects`, `#contact`）。

**替代方案**：`window.scrollTo({ top, behavior: 'smooth' })` 手动计算偏移。`scrollIntoView` 语义更清晰，浏览器支持良好。

### 4. 背景模糊：Tailwind backdrop-blur

使用 Tailwind 的 `backdrop-blur-md` 配合 `bg-white/80 dark:bg-gray-950/80` 半透明背景，实现毛玻璃效果。滚动状态通过 state 控制 class 切换，使用 CSS transition 过渡。

### 5. 移动端菜单：汉堡图标 + 绝对定位下拉

使用三横线 SVG 图标作为汉堡菜单按钮，点击后展开绝对定位的下拉菜单。使用简单的 `useState` 控制开合，不引入 Portal 或第三方 drawer 组件。

### 6. z-index 层级

导航栏使用 `z-50`，确保在粒子 Canvas（当前无显式 z-index）和 Hero 内容之上。移动端下拉菜单使用 `z-40`。

## Risks / Trade-offs

- **导航链接与 section id 耦合**：链接的 href（如 `#projects`）必须与页面中 section 的 `id` 属性匹配。如果 section id 被修改，导航会静默失败 → 在 App.tsx 中集中管理 section ids 常量，Navbar 和 App 共用
- **移动端菜单在点击链接后应自动关闭**：点击导航链接后，菜单仍展开会造成遮挡 → 点击链接时调用 `setMenuOpen(false)` 关闭菜单
- **scroll 事件频率高**：可能导致不必要的 re-render → 使用 `passive: true`，不调用 `preventDefault`，React 批量更新已足够；如需进一步优化可加 throttle，当前场景不必要
- **与 ThemeToggle 的位置关系**：ThemeToggle 目前在 Hero 内部，不在 Navbar 中 → 本次不做改动，后续可考虑将 ThemeToggle 移入 Navbar，但本次不在范围内
