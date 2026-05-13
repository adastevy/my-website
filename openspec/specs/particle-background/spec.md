## ADDED Requirements

### Requirement: Canvas renders floating particles with connecting lines

系统 SHALL 在 Canvas 上渲染粒子网络效果：浮动光点 + 近距离连线。

#### Scenario: Particles render on page load

- **GIVEN** 浏览器支持 Canvas 2D
- **WHEN** Hero Section 渲染完成
- **THEN** Canvas 上显示 80-200 个粒子（数量基于视口宽度）
- **AND** 每个粒子为 1-3px 的圆形光点
- **AND** 粒子在 Canvas 内持续浮动漂移

#### Scenario: Nearby particles are connected by lines

- **GIVEN** 两个粒子之间的距离小于预设连接阈值
- **WHEN** Canvas 每帧渲染
- **THEN** 两粒子之间绘制半透明连线
- **AND** 连线透明度与距离成反比（越近越清晰）

### Requirement: Particle colors follow theme

系统 SHALL 根据当前主题模式调整粒子颜色。

#### Scenario: Light mode

- **GIVEN** 主题为亮色模式
- **WHEN** Canvas 渲染粒子
- **THEN** 粒子颜色使用深色系（如深蓝、深紫）
- **AND** 连线和粒子在浅色背景下可辨识

#### Scenario: Dark mode

- **GIVEN** 主题为暗色模式
- **WHEN** Canvas 渲染粒子
- **THEN** 粒子颜色使用亮色系（如白、青、紫）
- **AND** 连线和粒子在深色背景下可辨识

#### Scenario: Theme switches while particles are running

- **GIVEN** Canvas 粒子正在运行
- **WHEN** 用户切换亮/暗模式
- **THEN** 粒子颜色在当前动画帧结束后更新为新主题配色
- **AND** 颜色过渡平滑（粒子在下一帧以新颜色渲染）

### Requirement: Particles respect reduced-motion preference

系统 SHALL 在用户启用 reduced-motion 时停止粒子动画。

#### Scenario: User prefers reduced motion

- **GIVEN** 用户在操作系统设置中启用了 `prefers-reduced-motion: reduce`
- **WHEN** Canvas 初始化
- **THEN** 粒子渲染为静止状态
- **AND** 粒子仍然可见（作为静态装饰）
- **AND** `requestAnimationFrame` 不持续调用

### Requirement: Particles pause when not visible

系统 SHALL 在 Hero Section 不在视口时暂停粒子动画以节省资源。

#### Scenario: User scrolls past hero section

- **GIVEN** Canvas 粒子正在运行动画
- **WHEN** 用户向下滚动使 Hero Section 完全离开视口
- **THEN** `requestAnimationFrame` 暂停
- **AND** 用户滚动回 Hero 时粒子恢复动画

### Requirement: Canvas fallback when browser does not support it

系统 SHALL 在 Canvas 不可用时提供降级显示。

#### Scenario: Browser does not support Canvas 2D

- **GIVEN** 浏览器不支持 Canvas 2D（如非常旧的浏览器）
- **WHEN** Hero Section 渲染
- **THEN** 不显示 Canvas 元素，不抛出错误
- **AND** CSS 渐变背景正常显示作为视觉降级
