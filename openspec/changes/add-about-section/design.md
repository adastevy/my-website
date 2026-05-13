## Context

当前网站页面结构为：Hero → ProjectSection → Contact 占位。需要插入 AboutSection，放置在 Hero 和 ProjectSection 之间。该 section 承担「个人介绍」职能，让访问者了解作者背景。

约束：React 19 + TypeScript + Tailwind CSS v4，项目风格偏科技感粒子风，照片 lazy loading。

## Goals / Non-Goals

**Goals:**
- 左右双栏布局：左侧照片（圆形），右侧 3 段简介文字
- 移动端自动切换为上下堆叠
- 简介下方展示品牌标签「赋范空间」
- 照片使用 `loading="lazy"` + 圆形裁剪

**Non-Goals:**
- 不做联系我表单
- 不做 Navbar 导航链接变更
- 不做动画/打字特效

## Decisions

**1. 布局：CSS Grid vs Flexbox**
选 Grid，`grid-cols-1 md:grid-cols-2`。与 ProjectSection 保持一致的技术选择，左右栏比例通过 `grid-template-columns` 隐式等分即可。

**2. 照片形状**
圆形（`rounded-full`），尺寸 `w-48 md:w-56`，给照片一个固定宽度保持视觉稳定。底部品牌标签使用 flex-wrap 排列。

**3. 简介数据结构**
使用字符串数组存储 3 段简介：
```ts
const ABOUT_PARAGRAPHS = [
  '第一段...',
  '第二段...',
  '第三段...',
]
```
不抽到独立 data 文件——简介是纯展示内容，不需要复用类型，直接放在组件内更简单。

**4. 照片路径**
照片放置于 `public/images/about/photo.jpg`，使用 Vite 的 public 目录直接引用。提供 `onError` 回退占位。

**5. 品牌标签**
标签列表硬编码在组件内，使用 `flex gap-2 flex-wrap` 排列。标签样式参考 ProjectCard tech tags。

## Risks / Trade-offs

- **大照片加载**：照片文件可能较大影响 LCP → 使用 `loading="lazy"` + 固定宽高防止 layout shift
- **暗色模式照片**：圆形照片在暗色背景下可能需要边框以区分 → 使用 `border-2 border-purple-500/30` 增���可见度
