## MODIFIED Requirements

### Requirement: Display learning statistics cards

系统 SHALL 在 Dashboard 学习数据页面展示四个统计卡片，分别显示：今日学习时长（小时）、进行中课程数（门）、课程完成率（百分比）、连续学习天数（天）。

所有数据 SHALL 来源于 `GET /api/analytics/overview` 端点。卡片 SHALL 包含图标、数值和标签。

#### Scenario: Stats cards render with API data

- **WHEN** 用户访问 Dashboard 学习数据页面（/overview）
- **THEN** 系统展示四个统计卡片，每个卡片显示图标、从 API 获取的数值和对应的描述标签

#### Scenario: Stats cards adapt to theme

- **WHEN** 用户切换亮色/暗色模式
- **THEN** 统计卡片的背景色和文字颜色随主题变化，保持可读性

#### Scenario: Stats cards responsive layout

- **WHEN** 视口宽度变化
- **THEN** 卡片在桌面端展示为 4 列，平板端为 2 列，移动端为 2 列

#### Scenario: Error - API request fails

- **WHEN** API 请求失败或返回错误状态码
- **THEN** 对应卡片显示 "--" 占位符而非崩溃

#### Scenario: Loading state

- **WHEN** API 请求进行中且数据尚未返回
- **THEN** 统计卡片显示骨架屏（skeleton）占位，而非 "--"
