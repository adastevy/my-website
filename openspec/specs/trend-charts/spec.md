## Purpose

学习趋势图表 — 使用 recharts 渲染周/月学习时长趋势，支持亮暗主题切换和响应式宽度。

## Requirements

### Requirement: Display weekly learning trend chart

系统 SHALL 在学习趋势页面（/trends）展示周学习时长趋势图，使用 recharts 渲染。

横轴 SHALL 显示周一至周日，纵轴 SHALL 显示学习时长（小时），图表 SHALL 支持亮色/暗色模式。

#### Scenario: Weekly chart renders with data

- **WHEN** 用户访问学习趋势页面
- **THEN** 系统展示折线图（LineChart），横轴为周一至周日，纵轴为学习时长（0-8h），数据点来自 mock 数据

#### Scenario: Chart theme adapts

- **WHEN** 用户切换亮色/暗色模式
- **THEN** 图表坐标轴颜色、网格线颜色、tooltip 样式随主题变化

#### Scenario: Monthly chart also renders

- **WHEN** 用户滚动至月度趋势区域
- **THEN** 系统展示柱状图（BarChart），横轴为第1周至第4周，纵轴为学习时长

#### Scenario: Chart is responsive

- **WHEN** 用户调整浏览器窗口大小
- **THEN** 图表宽度自适应容器宽度

#### Scenario: Error - undefined chart data

- **WHEN** mock 数据中趋势数据为 undefined
- **THEN** 趋势图区域显示 "数据加载失败，请刷新重试" 的错误提示
