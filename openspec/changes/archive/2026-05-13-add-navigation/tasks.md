## 1. Navbar 组件基础结构

- [x] 1.1 创建 `src/components/Navbar/` 目录和 `Navbar.tsx` 组件文件，使用 TypeScript + 函数式组件
- [x] 1.2 实现 `fixed top-0 w-full z-50` 固定定位，左右分区布局（flex justify-between items-center）
- [x] 1.3 左侧渲染品牌名称文本，右侧渲染三个导航链接（首页 `#home`、项目 `#projects`、联系我 `#contact`）
- [x] 1.4 添加暗色模式样式：文字 `text-gray-900 dark:text-white`，链接 hover 效果

## 2. 滚动背景模糊效果

- [x] 2.1 实现 `useEffect` 监听 `scroll` 事件（passive: true），通过 `scrollY > 10` 状态控制背景切换
- [x] 2.2 滚动时添加 `backdrop-blur-md bg-white/80 dark:bg-gray-950/80 transition-[background,backdrop-filter] duration-300`，回顶部时恢复 `bg-transparent`
- [x] 2.3 确保组件卸载时清理 scroll 事件监听

## 3. 平滑锚点滚动

- [x] 3.1 实现 `handleNavClick` 函数，使用 `document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })`
- [x] 3.2 在 `App.tsx` 中为 Hero Section 添加 `id="home"`，预留 `id="projects"` 和 `id="contact"` 的 section 占位
- [x] 3.3 将 section IDs 抽取为常量（`src/constants.ts` 或组件内常量），Navbar 和 App 共用

## 4. 移动端响应式菜单

- [x] 4.1 添加 `md:hidden` 汉堡菜单按钮（三横线 SVG 图标），`md:flex` 显示桌面端链接
- [x] 4.2 实现 `useState` 控制菜单开合，点击汉堡按钮切换状态，使用绝对定位展示垂直链接列表
- [x] 4.3 点击菜单中链接后自动关闭菜单（调用 `setMenuOpen(false)`），并触发平滑滚动
- [x] 4.4 为汉堡按钮添加 `aria-label`、`aria-expanded`，菜单链接支持 Tab 键导航和 Enter 激活

## 5. 集成与验证

- [x] 5.1 在 `App.tsx` 中引入 `<Navbar />`，确保页面顶部留出 `pt-16` 间距避免内容被遮挡
- [x] 5.2 验证：桌面端导航、移动端汉堡菜单、平滑滚动、背景模糊、暗色模式切换均正常工作
