## 1. Theme System Foundation

- [x] 1.1 在 `index.html` `<head>` 中添加防闪烁阻塞脚本（同步读取 localStorage 设置 dark class）
- [x] 1.2 在 `src/index.css` 中配置 Tailwind darkMode 为 class 策略
- [x] 1.3 创建 `src/hooks/useTheme.ts`（读取/写入 localStorage，暴露 theme 和 toggleTheme）
- [x] 1.4 创建 `src/components/ThemeToggle/ThemeToggle.tsx`（按钮 + aria-label，调用 toggleTheme）
- [x] 1.5 在 `src/App.tsx` 中引入 useTheme 和 ThemeToggle，验证亮/暗切换正常

## 2. Particle Background

- [x] 2.1 创建 `src/hooks/useParticles.ts`（Canvas 初始化、粒子数组生成、requestAnimationFrame 循环、resize 处理）
- [x] 2.2 创建 `src/components/Hero/ParticleCanvas.tsx`（接收 theme 参数，挂载 canvas，调用 useParticles）
- [x] 2.3 在 useParticles 中添加 `prefers-reduced-motion` 检测，匹配时粒子静止
- [x] 2.4 在 useParticles 中添加 IntersectionObserver，Hero 离开视口时暂停 rAF
- [x] 2.5 根据 theme prop 切换粒子/连线颜色（亮色深色系，暗色亮色系）

## 3. Hero Section Assembly

- [x] 3.1 创建 `src/components/Hero/HeroContent.tsx`（姓名/职业/简介 + CTA 按钮，响应式文字大小）
- [x] 3.2 创建 `src/components/Hero/Hero.tsx`（100dvh 容器，CSS 渐变背景 + ParticleCanvas + HeroContent 叠层）
- [x] 3.3 添加 CSS 渐变底色样式（animated gradient blobs，`bg-gradient-to-br` 等 Tailwind class）
- [x] 3.4 在 `src/App.tsx` 中替换默认模板为 Hero 组件 + `#projects` 占位 div
- [x] 3.5 验证移动端（375px）、平板（768px）、桌面（1440px）、超宽屏（2560px）响应式表现

## 4. CTA & Polish

- [x] 4.1 CTA 按钮实现 `scrollIntoView({ behavior: 'smooth' })` 锚点跳转
- [x] 4.2 在 App.tsx 中添加 `<div id="projects" />` 占位锚点
- [x] 4.3 处理 `#projects` 不存在时的静默失败
- [x] 4.4 最终验证：暗色/亮色切换 + 粒子效果 + CTA 跳转全流程
