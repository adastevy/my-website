## Purpose

AI 建议学习面板 — 展示模拟 AI 推荐的学习内容卡片，包含领域标签、预计时长和优先级。

## Requirements

### Requirement: Display AI study recommendations

系统 SHALL 在 AI 推荐页面（/recommendations）展示模拟 AI 推荐的学习内容卡片。

每张推荐卡片 SHALL 包含：推荐标题、知识领域标签、预计学习时长、优先级标识。

#### Scenario: Recommendations render as cards

- **WHEN** 用户访问 AI 推荐页面
- **THEN** 系统展示推荐学习内容卡片列表，每张卡片包含标题、标签、预计时长和优先级

#### Scenario: Priority badge colors

- **WHEN** 推荐卡片显示优先级
- **THEN** "高优先级" 显示为红色徽章，"中优先级" 显示为黄色徽章，"低优先级" 显示为绿色徽章

#### Scenario: Cards adapt to theme

- **WHEN** 用户切换主题
- **THEN** 推荐卡片样式随主题变化，卡片边框和文字颜色保持与当前主题一致

#### Scenario: Error - empty recommendations

- **WHEN** mock 数据中推荐列表为空
- **THEN** 系统显示 "暂无学习建议，请稍后再来" 的空状态提示

#### Scenario: Long title text truncation

- **WHEN** 推荐标题超过卡片宽度
- **THEN** 标题使用省略号截断（truncate），不破坏卡片布局
