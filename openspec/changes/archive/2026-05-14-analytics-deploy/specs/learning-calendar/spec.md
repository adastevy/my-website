## ADDED Requirements

### Requirement: Display learning calendar heatmap

系统 SHALL 在 Dashboard 学习数据页面展示学习日历热力图，以 12 列（week） × 7 行（day of week）矩阵形式渲染近 12 周每日学习活跃度。

热力图 SHALL 使用 5 级色阶表示学习时长：0 分钟（空白）、1-30 分钟（浅绿）、31-60 分钟（中绿）、61-120 分钟（深绿）、120+ 分钟（最深绿）。暗色模式下 SHALL 使用对应的暗色调色板。

数据 SHALL 来源于 `GET /api/analytics/calendar` 端点。

#### Scenario: Calendar renders with learning data

- **WHEN** 用户访问学习数据页面且 API 返回日历数据
- **THEN** 系统渲染 12×7 热力图矩阵，每个 cell 颜色映射自当日 level 值

#### Scenario: Empty data renders grid skeleton

- **WHEN** API 返回的 days 数组全为 level 0
- **THEN** 热力图 grid 完整渲染但所有 cell 显示为空状态色（灰色），不显示错误提示

#### Scenario: Calendar adapts to dark mode

- **WHEN** 用户切换亮色/暗色模式
- **THEN** 热力图 cell 颜色切换为对应主题的色阶

#### Scenario: API error displays fallback

- **WHEN** API 请求失败（网络错误或 500）
- **THEN** 热力图区域显示"数据加载失败，请稍后重试"的错误提示

### Requirement: Calendar cell shows tooltip on hover

系统 SHALL 在用户 hover 热力图 cell 时展示 tooltip，包含日期和当日学习时长。

#### Scenario: Hover on cell with data

- **WHEN** 用户鼠标悬停在 level > 0 的 cell 上
- **THEN** tooltip 显示日期（如 "5月12日 周一"）和学习时长（如 "学习 45 分钟"）

#### Scenario: Hover on empty cell

- **WHEN** 用户鼠标悬停在 level = 0 的 cell 上
- **THEN** tooltip 显示日期和"无学习记录"
