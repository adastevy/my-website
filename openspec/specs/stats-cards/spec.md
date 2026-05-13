## Purpose

数据统计卡片 — 展示学习时长、课程数、完成率、连续学习天数四项核心指标，响应式布局，暗色模式适配。

## Requirements

### Requirement: Display learning statistics cards

系统 SHALL 在 Dashboard 总览页展示四个统计卡片，分别显示：今日学习时长（小时）、进行中课程数（门）、课程完成率（百分比）、连续学习天数（天）。

所有数据 SHALL 来源于 mock 数据层，卡片 SHALL 包含图标、数值和标签。

#### Scenario: Stats cards render with mock data

- **WHEN** 用户访问 Dashboard 总览页（/overview）
- **THEN** 系统展示四个统计卡片，每个卡片显示图标、数值和对应的描述标签

#### Scenario: Stats cards adapt to theme

- **WHEN** 用户切换亮色/暗色模式
- **THEN** 统计卡片的背景色和文字颜色随主题变化，保持可读性

#### Scenario: Stats cards responsive layout

- **WHEN** 视口宽度变化
- **THEN** 卡片在桌面端展示为 4 列，平板端为 2 列，移动端为 2 列

#### Scenario: Error - missing data

- **WHEN** mock 数据中某个统计字段为 null 或 undefined
- **THEN** 对应卡片显示 "--" 占位符而非崩溃
