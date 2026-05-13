## Why

当前网站只有 Hero Section 和占位区域，导航栏「项目」链接和 Hero CTA 按钮都指向一个空白的占位 section。需要添加实际的项目展示区，让访问者能够浏览作品并访问 GitHub 仓库。

## What Changes

- 新增 `ProjectSection` 组件，渲染在 Hero Section 下方，使用 `id="projects"` 替代当前的占位 section
- 卡片式网格布局，每张卡片包含：项目截图、项目名称、项目简介、GitHub 链接
- 至少展示 4 个项目，项目数据通过静态配置文件管理
- 鼠标悬浮卡片时触发微交互特效（上浮 + 阴影变化 + 边框高亮过渡）
- Hero Section 的 CTA 按钮目标保持 `#projects`，跳转到新的项目展示区
- 导航栏「项目」链接同样指向本 section（已与常量 `SECTION_IDS.projects` 对齐）

## Capabilities

### New Capabilities

- `project-section`: 项目展示区，包含卡片网格布局、项目数据管理、悬浮微交互特效

### Modified Capabilities

<!-- 无 -->

## Impact

- 新增 `src/components/ProjectSection/ProjectSection.tsx`（主组件）和 `ProjectCard.tsx`（卡片子组件）
- 新增 `src/data/projects.ts`（项目静态数据 + TypeScript 类型定义）
- 修改 `src/App.tsx`：将 `id="projects"` 的占位 section 替换为 `<ProjectSection />`
- 不影响 Hero、Navbar、ThemeToggle、ParticleBackground 组件行为

## Out of Scope

- 不做项目详情页
- 不做项目搜索/筛选功能
- 不做分页或懒加载
- 不做项目数据 CMS 管理
- 不做图片轮播/点击放大
