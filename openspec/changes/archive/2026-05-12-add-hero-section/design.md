## Context

项目当前是 Vite 默认模板（计数器 demo）。需要替换为个人品牌站的 Hero Section。无现有 spec 或组件需要兼容。

约束：
- React 19 + Vite 8 + TypeScript + Tailwind CSS v4
- 不引入第三方依赖（性能约束：首屏 < 2s）
- GitHub Pages base path: `/my-website/`
- Tailwind v4 使用 CSS-based config，darkMode 通过 CSS 变量控制

## Goals / Non-Goals

**Goals:**
- Hero Section 占据全屏高度，居中展示姓名/职业/简介/CTA
- Canvas 粒子背景 + CSS 渐变底色叠加
- 暗色/亮色模式手动切换，localStorage 持久化，无闪烁
- 响应式适配（移动端、超宽屏）
- 尊重 `prefers-reduced-motion`

**Non-Goals:**
- 不做粒子交互（鼠标跟随、点击）
- 不做文本入场/滚动动画
- 不做导航栏
- 不做 Projects 区域

## Decisions

### 1. 暗色模式：Tailwind `class` 策略 + `<head>` 阻塞脚本

**选择**: 在 `<html>` 上切换 `class="dark"`，Tailwind 的 `dark:` 前缀响应 class 存在与否。

**防闪烁方案**: 在 `index.html` `<head>` 中插入一段阻塞 `<script>`，同步读取 `localStorage` 的 `theme` 值并立即设置 `document.documentElement.classList`，确保首帧渲染前 class 已就绪。

**替代方案**: `prefers-color-scheme` 媒体查询（Tailwind 默认）— 无法手动切换，不采用。

**useTheme hook 逻辑**:
```
初始化: localStorage.getItem('theme') ?? (系统 dark → 'dark' : 'light')
切换:   newTheme = current === 'dark' ? 'light' : 'dark'
        localStorage.setItem('theme', newTheme)
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
```

### 2. Canvas 粒子：自定义轻量实现

**选择**: 手写 Canvas 2D + `requestAnimationFrame`，约 100-200 个粒子。

**粒子行为**:
- 粒子有随机初始位置、大小（1-3px）、透明度、移动速度
- 粒子从底部向上缓慢漂移，到达顶部后循环回底部
- 两粒子距离 < 阈值时画半透明连线（"网络"感）
- 暗色模式下粒子偏亮（白/青/紫），亮色模式下粒子偏暗（深蓝/紫）

**为什么不引入 tsparticles**:
- 首屏加载 < 2s 约束，tsparticles gzip ~30KB 对首屏负担过大
- Hero 场景需求固定，不需要库的灵活性
- 自定义实现 ~5KB，且可精确控制主题联动

### 3. 组件分层架构

```
<Hero>  ← 容器，负责 100dvh、布局、配色
  <ParticleCanvas>  ← Canvas 粒子，z-0，absolute 覆盖
  <div className="absolute inset-0 bg-gradient...">  ← CSS 渐变底色，z-0
  <HeroContent>  ← 文本 + CTA，z-10，flex居中
```

- `ParticleCanvas` 接收 `theme` prop，切换时重绘颜色
- 两者都是 Hero 的内部实现，不暴露给 App.tsx

### 4. 性能策略

| 策略 | 实现 |
|------|------|
| Canvas 暂停 | IntersectionObserver 监听 Hero，离开视口 cancelAnimationFrame |
| 粒子密度 | 根据 `window.innerWidth` 调整粒子数（mobile ~80, desktop ~150） |
| 首屏优先 | 文字立即可见，粒子延迟 ~100ms 启动（不阻塞 FCP） |
| reduced-motion | 读取 `matchMedia('(prefers-reduced-motion: reduce)')`，匹配时粒子静止 |
| Resize 处理 | 防抖 200ms 后重建 Canvas 尺寸和粒子数组 |

### 5. CTA 锚点跳转

- 使用 `document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })`
- 不使用 `<a href="#projects">`，避免 URL hash 污染
- 若 `#projects` 不存在则静默失败

## Risks / Trade-offs

- [风险] Canvas 在某些旧浏览器不可用 → **缓解**: `useParticles` hook 中做 `!!canvas.getContext('2d')` 检测，失败时仅显示 CSS 渐变
- [风险] 100dvh 在旧 iOS Safari (<15.4) 不支持 → **缓解**: CSS 中提供 `100vh` fallback
- [风险] 粒子重绘消耗电量 → **缓解**: IntersectionObserver + reduced-motion 两块策略已经覆盖
- [Trade-off] Canvas 渲染依赖 JS 主线程，低端设备可能有卡顿 → 粒子数量已做自适应降级
