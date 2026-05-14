## MODIFIED Requirements

### Requirement: Dashboard layout with sidebar navigation

系统 SHALL 提供一个 Dashboard 布局，包含左侧固定导航栏和右侧可滚动内容区。

导航栏 SHALL 包含以下入口：学习数据（/overview）、AI 对话建议（/chat）、学习目标（/goals）。

#### Scenario: Desktop layout renders sidebar and content

- **WHEN** 用户在桌面端（宽度 >= 768px）访问 Dashboard
- **THEN** 左侧显示固定宽度（w-56）的导航栏，右侧显示当前路由对应的内容区域

#### Scenario: Mobile layout collapses sidebar

- **WHEN** 用户在移动端（宽度 < 768px）访问 Dashboard
- **THEN** 侧栏隐藏，改为底部固定导航栏（Bottom Nav），内容区占满全宽

#### Scenario: Navigation link highlights active route

- **WHEN** 用户点击侧栏导航项 "AI 对话建议"
- **THEN** 路由切换到 /chat，对应的导航项高亮显示（active 样式）

#### Scenario: Error - invalid route

- **WHEN** 用户访问不存在的 Dashboard 子路由（如 /dashboard/unknown）
- **THEN** 显示 404 提示信息，侧栏保持可见

## REMOVED Requirements

### Requirement: Dashboard responsive behavior

**Reason**: 响应式行为已合并到 `Dashboard layout with sidebar navigation` requirement 中，且现有 BottomNav 组件已涵盖移动端适配。

**Migration**: 无需迁移，StatsCards 的响应式 layout 由 stats-cards spec 独立定义。
