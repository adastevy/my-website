## ADDED Requirements

### Requirement: Display achievement list with unlock status

系统 SHALL 在 Dashboard 学习数据页面展示成就列表，包含全部 6 项预定义成就，每项成就显示图标、名称、描述、进度和目标值。

已解锁成就 SHALL 显示实心图标和完成时间，未解锁成就 SHALL 显示灰色图标和进度条（progress / target）。

数据 SHALL 来源于 `GET /api/analytics/achievements` 端点。

#### Scenario: Render mixed achievements

- **WHEN** 用户访问学习数据页面且有部分成就已解锁
- **THEN** 已解锁成就显示彩色图标 + 解锁时间，未解锁成就显示灰色图标 + 进度条（如 "3/7 天"）

#### Scenario: New user sees all locked

- **WHEN** 新用户（无学习记录）查看成就列表
- **THEN** 全部 6 项成就显示为锁定状态，每项 progress 为 0

#### Scenario: Achievement list adapts to dark mode

- **WHEN** 用户切换亮色/暗色模式
- **THEN** 成就卡片的背景色和文字颜色随主题变化

#### Scenario: API error displays fallback

- **WHEN** API 请求失败（网络错误或 500）
- **THEN** 成就区域显示"成就加载失败，请稍后重试"的错误提示

### Requirement: Achievement progress updates on data refresh

成就进度 SHALL 在用户刷新页面或重新进入学习数据页面时从后端重新获取并更新。

#### Scenario: Progress reflects latest learning activity

- **WHEN** 用户完成一次学习会话后刷新页面
- **THEN** 成就进度（如连续天数）反映最新数据
