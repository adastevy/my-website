## 1. 项目数据层

- [x] 1.1 创建 `src/data/projects.ts`，定义 `Project` 接口和至少 4 个示例项目数据（name、description、image、githubUrl、tags）
- [x] 1.2 放置项目占位图片到 `public/images/projects/`（使用 placehold.co 占位或本地占位图）

## 2. ProjectCard 卡片组件

- [x] 2.1 创建 `src/components/ProjectSection/ProjectCard.tsx`，渲染卡片结构：图片（aspect-video + lazy loading）、项目名称、简介、GitHub 链接按钮（target="_blank"）
- [x] 2.2 实现悬浮微交互：`hover:-translate-y-1` + hover 阴影增强 + 边框颜色过渡 `border-purple-500/50`，统一 `transition-all duration-300`
- [x] 2.3 添加暗色模式样式：卡片背景、文字、边框、GitHub 按钮的 dark: 变体
- [x] 2.4 处理边界情况：图片加载失败的占位背景、空 tags 不渲染标签区

## 3. ProjectSection 主组件

- [x] 3.1 创建 `src/components/ProjectSection/ProjectSection.tsx`，使用 CSS Grid 布局（`grid-cols-1 md:grid-cols-2 gap-6`），从 `src/data/projects.ts` 读取数据渲染 ProjectCard 列表
- [x] 3.2 添加 section 标题（如「我的项目」）、section 容器样式及暗色模式适配

## 4. App 集成

- [x] 4.1 修改 `src/App.tsx`：将 `id="projects"` 的占位 `<section>` 替换为 `<ProjectSection />`，确保 section 仍有 `id="projects"` 和 `scroll-mt-16`
- [x] 4.2 验证 Hero CTA 按钮点击后平滑滚动到项目展示区
- [x] 4.3 验证 Navbar「项目」链接点击后平滑滚动到项目展示区

## 5. 验证与收尾

- [x] 5.1 验证桌面端布局：2 列网格、悬浮特效、图片懒加载
- [x] 5.2 验证移动端布局：单列、汉堡菜单导航跳转正常
- [x] 5.3 验证暗色模式：亮/暗切换后卡片颜色即时更新
