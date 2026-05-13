## ADDED Requirements

### Requirement: Dashboard layout with sidebar navigation

系统 SHALL 提供一个 Dashboard 布局，包含左侧固定导航栏和右侧可滚动内容区。

导航栏 SHALL 包含以下入口：总览（/overview）、AI 推荐（/recommendations）、学习趋势（/trends）、每日目标（/goals）。

#### Scenario: Desktop layout renders sidebar and content

- **WHEN** 用户在桌面端（宽度 >= 768px）访问 Dashboard
- **THEN** 左侧显示固定宽度（w-56）的导航栏，右侧显示当前路由对应的内容区域

#### Scenario: Mobile layout collapses sidebar

- **WHEN** 用户在移动端（宽度 < 768px）访问 Dashboard
- **THEN** 侧栏隐藏，改为底部固定导航栏（Bottom Nav），内容区占满全宽

#### Scenario: Navigation link highlights active route

- **WHEN** 用户点击侧栏导航项 "AI 推荐"
- **THEN** 路由切换到 /recommendations，对应的导航项高亮显示（active 样式）

#### Scenario: Error - invalid route

- **WHEN** 用户访问不存在的 Dashboard 子路由（如 /dashboard/unknown）
- **THEN** 显示 404 提示信息，侧栏保持可见

### Requirement: Dashboard responsive behavior

系统 SHALL 在不同屏幕尺寸下自适应调整布局，确保内容可读性和操作便捷性。

#### Scenario: Sidebar fixed on desktop

- **WHEN** 用户在桌面端滚动右侧内容区
- **THEN** 左侧导航栏保持固定不随滚动

#### Scenario: Content area scrolls independently

- **WHEN** 右侧内容区内容超过视口高度
- **THEN** 仅内容区可滚动，侧栏和顶部导航栏保持固定

#### Scenario: Stats cards reflow on tablet

- **WHEN** 用户在平板端（768px - 1024px）查看统计卡片
- **THEN** 卡片从 4 列布局切换为 2 列布局
