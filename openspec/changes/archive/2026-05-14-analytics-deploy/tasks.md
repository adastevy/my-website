## 1. 数据库迁移

- [ ] 1.1 创建 alembic migration：新增 `learning_sessions` 表（id, user_id, session_date, duration_minutes, course_name）
- [ ] 1.2 创建 alembic migration：新增 `achievements` 和 `user_achievements` 表，并插入 6 条预定义成就种子数据
- [ ] 1.3 运行 migration 并验证表结构正确

**验证**: `sqlite3` 查看三张新表是否存在，achievements 表是否有 6 条种子数据

## 2. 后端 Analytics API

- [ ] 2.1 创建 `app/schemas/analytics.py`：定义 OverviewResponse、CalendarResponse、AchievementResponse Pydantic 模型
- [ ] 2.2 创建 `app/services/analytics.py`：实现 get_overview()、get_calendar_data()、get_achievements() 三个聚合查询函数
- [ ] 2.3 创建 `app/routers/analytics.py`：实现 GET /api/analytics/overview、GET /api/analytics/calendar、GET /api/analytics/achievements 三个端点
- [ ] 2.4 在 `app/main.py` 中注册 analytics router
- [ ] 2.5 在 AI 对话服务 `chat.py` 的 `save_messages()` 调用后自动创建 learning_session 记录（每次对话 = 一次学习会话）

**验证**: `curl -H "Authorization: Bearer <token>" http://localhost:8000/api/analytics/overview` 返回 200 和 JSON 数据

## 3. 前端 API 客户端

- [ ] 3.1 创建 `src/services/analytics.ts`：封装 fetchOverview()、fetchCalendar(year, month)、fetchAchievements() 三个请求函数，复用现有 apiClient 的认证逻辑
- [ ] 3.2 检查已有 `src/services/api.ts` 或 `src/services/apiClient.ts` 是否可复用（若有则基于其扩展，不重复创建 HTTP 客户端）

**验证**: 在浏览器 console 中调用 analytics 服务函数，确认网络请求成功

## 4. 学习日历组件

- [ ] 4.1 创建 `src/components/Dashboard/LearningCalendar.tsx`：SVG 热力图矩阵组件（12 列 × 7 行），使用 Tailbox 色阶 class 映射 level 值
- [ ] 4.2 实现 cell hover tooltip（显示日期 + 学习时长文案）
- [ ] 4.3 适配暗色模式（dark: 前缀色阶替换）
- [ ] 4.4 添加 loading 骨架屏和 error 错误提示状态

**验证**: 在 OverviewPage 中临时引入组件，确认热力图渲染、tooltip 弹出、暗色模式切换正常

## 5. 成就系统组件

- [ ] 5.1 创建 `src/components/Dashboard/AchievementList.tsx`：成就列表容器组件，调用 fetchAchievements API
- [ ] 5.2 创建 `src/components/Dashboard/AchievementBadge.tsx`：单个成就徽章组件（图标 + 名称 + 描述 + 进度条/解锁时间）
- [ ] 5.3 适配暗色模式（已解锁/未解锁徽章在亮暗主题下的颜色差异）
- [ ] 5.4 添加 loading 骨架屏和 error 错误提示状态

**验证**: 在 OverviewPage 中临时引入组件，确认成就列表渲染、锁定/解锁徽章区分、暗色模式切换正常

## 6. 侧栏导航重构

- [ ] 6.1 更新 `src/constants.ts` 中 NAV_ITEMS 为三项：学习数据（/overview）、AI 对话建议（/chat）、学习目标（/goals）
- [ ] 6.2 更新 `src/components/Dashboard/Sidebar.tsx`：同步 ICONS 图标映射，更新三项图标的 SVG（学习数据用 chart-bar、AI 对话建议沿用 chat、学习目标沿用 checklist）
- [ ] 6.3 更新 `src/components/Dashboard/BottomNav.tsx`：同步三项导航项，适配移动端显示
- [ ] 6.4 在 `src/App.tsx` 中移除 /recommendations 和 /trends 路由的页面组件引用，添加旧路由到 /overview 的重定向

**验证**: 启动前端，确认侧栏仅显示三个导航项，点击可正常跳转；访问 /recommendations 和 /trends 自动重定向到 /overview

## 7. 统计卡片 API 集成

- [ ] 7.1 修改 `src/components/Dashboard/StatsCards.tsx`：数据源从 mock 改为调用 fetchOverview() API
- [ ] 7.2 添加 loading 骨架屏（Skeleton 脉冲占位）和 error 回退（显示 "--"）状态
- [ ] 7.3 保留 mock 数据作为开发环境 fallback（API 不可用时自动降级）

**验证**: 确认统计卡片展示的是后端返回的真实数据，切换亮暗色主题后 UI 正常

## 8. 学习数据页面整合

- [ ] 8.1 更新 `src/pages/OverviewPage.tsx`：整合 StatsCards（顶部）、LearningCalendar（左侧面板）、AchievementList（右侧面板）三部分
- [ ] 8.2 确保页面 responsive 布局：桌面端日历和成就并排，平板/移动端上下堆叠
- [ ] 8.3 删除不再使用的旧组件引用（RecommendationsPage.tsx、TrendsPage.tsx、WeeklyTrendChart.tsx、MonthlyTrendChart.tsx、StudyRecommendations.tsx）或标记为 deprecated

**验证**: 访问 /overview，确认统计卡片、学习日历、成就列表三部分正常渲染，调整窗口大小确认响应式布局

## 9. 构建验证与清理

- [ ] 9.1 前端 `npm run build` 确保无 TypeScript 错误和构建警告
- [ ] 9.2 后端 `python -c "from app.main import app"` 确保所有模块正常导入
- [ ] 9.3 端到端手动测试：注册/登录 → 进入学习数据页面 → 查看日历和成就 → AI 对话后刷新验证数据更新

**验证**: 前端 build 成功，后端启动无报错，完整用户流程走通
