## Context

当前 `App.tsx` 中 `id="projects"` 是一个空占位 `<section>`（仅 `min-h-screen` 的空白区域）。Hero CTA 按钮和 Navbar 的「项目」链接都指向这个空 section。本次需要将其替换为真实的项目展示区。

约束：React 19 + TypeScript + Tailwind CSS v4，无额外第三方依赖，图片 lazy loading。

## Goals / Non-Goals

**Goals:**
- 创建可复用的 ProjectSection + ProjectCard 组件
- 卡片网格自动适配：桌面 2 列 / 平板 2 列 / 手机 1 列
- 悬浮微交互：卡片上浮（translate-y）+ 阴影加深 + 边框颜色过渡
- 项目数据从独立文件引用，方便日后增删改
- 所有图片使用 `loading="lazy"`

**Non-Goals:**
- 不做项目详情页、搜索、筛选
- 不做卡片点击/跳转（GitHub 链接通过独立按钮打开新标签）
- 不做图片轮播或放大预览

## Decisions

**1. 布局：CSS Grid vs Flexbox**
选 Grid。2 列自动分配，间距控制更简洁，不需要手动管理 flex-basis。使用 `grid-cols-1 md:grid-cols-2` 实现响应式。

**2. 项目数据结构**
内联静态数组 `projects: Project[]` 存放于 `src/data/projects.ts`。字段：
```ts
interface Project {
  name: string;
  description: string;
  image: string;       // 图片路径，相对于 public/
  githubUrl: string;   // 绝对 URL
  tags?: string[];     // 可选标签（技术栈）
}
```

**3. 悬浮微交互方案**
纯 CSS transition + Tailwind `group-hover`：
- 卡片：`transition-all duration-300` + hover 时 `-translate-y-1` + `shadow-lg`
- 图片/边框：hover 时边框从 `border-gray-200 dark:border-gray-800` 过渡到 `border-purple-500/50`
- 标题：hover 时文字颜色变化作为视觉反馈

不使用 framer-motion 等动画库，控制依赖体积。

**4. 图片处理**
- 图片放 `public/images/projects/` 目录
- 使用占位图策略：初次开发用 `https://placehold.co/600x400` 占位
- `<img>` 标签使用 `loading="lazy"` + `alt` 属性

**5. 项目缩略图 aspect ratio**
固定 16:9（`aspect-video`），保证卡片高度一致。

## Risks / Trade-offs

- **图片加载延迟**：4 张项目截图首次加载可能影响 LCP → 使用 lazy loading + 占位背景色
- **暗色模式对比度**：暗色模式下卡片背景和文字对比需测试 → 使用 `dark:bg-gray-900` + `dark:text-gray-100`
- **静态数据维护**：项目数据硬编码在 TS 文件中 → 后续可迁移至 CMS/JSON，当前阶段成本最低
