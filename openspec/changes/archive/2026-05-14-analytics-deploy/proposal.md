## Why

StudyPal 当前使用 mock 数据展示仪表盘内容，且侧栏导航分类（总览/趋势/推荐/目标）不符合用户对学习数据分析的心理模型。用户需要一个以数据驱动的学习分析面板：一眼看到自己的学习日历、成就进度，并通过真实的后端 API 获取聚合统计数据。

## What Changes

- 新增 FastAPI `/api/analytics` 端点，从数据库聚合返回学习统计数据（学习时长、连续天数、课程完成数等）
- 新增学习日历组件（LearningCalendar），以热力图形式展示每日学习活跃度
- 新增成就系统（AchievementBadge / AchievementList），展示用户已解锁和未解锁的成就
- **BREAKING**: 重构 Dashboard 侧栏导航项，从现有的 总览/AI推荐/趋势/目标 改为 学习数据/AI 对话建议/学习目标
- Dashboard 统计卡片数据源从 mock 切换为后端 API
- 前端 API 客户端新增 analytics 服务模块

## Capabilities

### New Capabilities
- `analytics-api`: 后端学习统计聚合 API（学习时长、活跃天数、课程进度等数据库聚合查询）
- `learning-calendar`: 学习日历热力图组件，展示每日学习活跃度（类似 GitHub 贡献图）
- `achievement-system`: 成就系统，包含成就列表、解锁状态、进度展示

### Modified Capabilities
- `dashboard-layout`: 侧栏导航项 SHALL 从 总览/AI推荐/趋势/目标 改为 学习数据/AI 对话建议/学习目标（删除趋势页，将推荐改为 AI 对话建议入口，总览改为学习数据，目标保留）
- `stats-cards`: 统计卡片数据源 SHALL 从 mock 改为后端 API 实时数据

## Impact

- **前端**：Dashboard 侧栏结构（Sidebar.tsx/BottomNav.tsx/constants.ts 的 NAV_ITEMS）、新增 LearningCalendar/AchievementSystem 组件及其页面、stats-cards 数据获取方式
- **后端**：新增 `app/routers/analytics.py`、`app/services/analytics.py`、`app/schemas/analytics.py`，需修改 `app/main.py` 注册新 router
- **数据库**：新增 `learning_sessions` 表记录每日学习行为，新增 `achievements` 和 `user_achievements` 表
- **路由**：现有 trends 页面对应路由 `/trends` 将被移除，recommendations 路由保留但重命名标签

## Out of Scope / NOT Doing

- 不实现实时通知推送（WebSocket/SSE 通知）
- 不实现数据导出功能（CSV/PDF 导出）
- 不实现自定义成就规则（成就由系统预定义）
- 不实现学习日历的月份/年份切换（仅展示当前月份 + 近 12 周热力图）
- 不修改 AI 对话本身的功能逻辑
