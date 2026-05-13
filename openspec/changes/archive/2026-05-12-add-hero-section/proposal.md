## Why

当前网站是 Vite 默认模板，用户访问时无法了解我是谁、做什么。首屏是访客第一印象，需要一个 Hero Section 来展示个人身份和引导行动，同时建立"科技粒子风"的视觉基调。

## What Changes

- 新增 Hero Section 组件，占据全屏高度，居中展示姓名、职业、一句话介绍
- 新增 Canvas 粒子背景（浮动光点 + 连线网络），叠加在 CSS 渐变底色之上
- 新增暗色/亮色模式切换系统（ThemeProvider + useTheme hook + localStorage 持久化）
- 新增 CTA 按钮，锚点跳转到项目区域（`#projects`）
- 替换 `App.tsx` 中的默认模板内容为 Hero + 占位布局
- 配置 Tailwind 为 `class` 模式以支持手动主题切换

## Capabilities

### New Capabilities

- `hero-section`: 全屏高度 Hero 区域，居中展示个人信息（姓名、职业、简介）及 CTA 按钮，响应式适配移动端，支持亮/暗色模式
- `particle-background`: Canvas 驱动的粒子背景效果，浮动光点 + 近距离连线，跟随主题色切换，尊重 reduced-motion 偏好
- `theme-system`: 亮/暗色模式切换能力，支持手动切换 + 跟随系统偏好，localStorage 持久化，无页面加载闪烁

### Modified Capabilities

（无现有 spec 需要修改）

## Impact

- **新增文件**: `src/components/Hero/`, `src/components/ThemeToggle/`, `src/hooks/useTheme.ts`, `src/hooks/useParticles.ts`
- **修改文件**: `src/App.tsx`（替换默认模板）、`src/index.css`（添加主题相关 CSS 变量）、`index.html`（添加防闪烁 script）
- **依赖**: 不引入任何第三方包，Canvas 使用浏览器原生 API

---

## Out of Scope（严禁实现）

- 不做任何文本入场/滚动触发/视差等装饰性动画效果
- 不做导航栏（Navigation Bar）
- 不做后端 API 或数据请求
- 不做 Projects 区域本身的开发（仅预留 `#projects` 锚点）
- 不做粒子交互效果（如鼠标跟随、点击爆炸）
