## 1. 基础设施：依赖安装与 Mock 数据层

- [x] 1.1 安装新增依赖：`react-router-dom`、`recharts`
- [x] 1.2 创建 `src/mock/` 目录，建立 mock 数据文件：`stats.ts`、`goals.ts`、`recommendations.ts`、`trends.ts`，每个文件 export 类型定义和 mock 数据
- [x] 1.3 创建 `src/context/DashboardContext.tsx`，提供学习数据（stats、goals、recommendations、trends）的 Context 和 Provider，内部使用 mock 数据
- [x] 1.4 配置 React Router：创建 `src/pages/` 目录和空白页面占位文件（OverviewPage、RecommendationsPage、TrendsPage、GoalsPage），在 App.tsx 中引入 BrowserRouter 和 Routes

**验证**：`npm run build` 成功，`npm run dev` 启动后访问 `/overview` 等路由不报 404

## 2. Dashboard 布局框架

- [x] 2.1 创建 `src/components/Dashboard/Sidebar.tsx`：左侧固定导航，包含 StudyPal logo + 4 个导航项（总览、AI推荐、趋势、目标），使用 NavLink 高亮当前路由，支持暗色模式
- [x] 2.2 创建 `src/components/Dashboard/Dashboard.tsx`：Layout route 组件，左侧渲染 Sidebar，右侧渲染 `<Outlet />`，内容区可滚动（`overflow-y-auto`）
- [x] 2.3 创建 `src/components/Dashboard/BottomNav.tsx`：移动端底部固定导航，包含相同的 4 个导航项图标 + 文字，仅 `<768px` 显示
- [x] 2.4 改造 `src/components/Navbar/Navbar.tsx`：导航链接从 `sectionId` 锚点改为 `react-router-dom` 的 `<Link to="...">`，更新品牌名 "John Doe" → "StudyPal"，移除 `handleNavClick` 中的 `scrollIntoView` 逻辑
- [x] 2.5 更新 `src/App.tsx`：用 BrowserRouter + Dashboard layout route 替换原有 `<section>` 锚点结构，更新 `src/constants.ts`（路由常量替换旧的 `SECTION_IDS` 和 `NAV_ITEMS`）

**验证**：桌面端侧栏固定、右侧内容可滚动；移动端侧栏隐藏、底部导航显示；NavLink 高亮正确；`npm run build` 成功

## 3. 统计卡片与每日目标

- [x] 3.1 创建 `src/components/Dashboard/StatsCards.tsx`：4 个统计卡片（学习时长、课程数、完成率、连续天数），从 DashboardContext 读取数据，响应式 4/2/2 列布局，暗色模式适配，空值显示 "--"
- [x] 3.2 创建 `src/components/Dashboard/DailyGoals.tsx`：目标清单组件，checkbox + 标题 + 删除线样式，点击切换完成状态，顶部进度条 + 完成比例文字，空列表显示空状态提示
- [x] 3.3 实现 `src/pages/OverviewPage.tsx`：组合 StatsCards + DailyGoals + 底部本周趋势图（WeeklyTrendChart 预览），使用 mock 数据
- [x] 3.4 实现 `src/pages/GoalsPage.tsx`：独立展示 DailyGoals 全功能版本 + 完成进度大卡片

**验证**：总览页展示 4 张统计卡片，数值正确；目标可勾选/取消，进度实时更新；暗色模式样式正常

## 4. AI 推荐面板与趋势图表

- [x] 4.1 创建 `src/components/Dashboard/StudyRecommendations.tsx`：推荐卡片列表，每张卡片展示标题 + 领域标签 + 预计时长 + 优先级徽章（红/黄/绿），长标题 truncate，空列表显示空状态，暗色模式适配
- [x] 4.2 创建 `src/components/Dashboard/WeeklyTrendChart.tsx`：使用 recharts LineChart，横轴 = 周一~周日，纵轴 = 学习时长(h)，从 DashboardContext 读取数据，支持亮/暗模式坐标轴颜色，响应式宽度
- [x] 4.3 创建 `src/components/Dashboard/MonthlyTrendChart.tsx`：使用 recharts BarChart，横轴 = 第1~4周，纵轴 = 学习时长(h)，主题和响应式要求同 4.2
- [x] 4.4 实现 `src/pages/RecommendationsPage.tsx`：渲染 StudyRecommendations 全功能版本
- [x] 4.5 实现 `src/pages/TrendsPage.tsx`：渲染 WeeklyTrendChart + MonthlyTrendChart，页面包含标题和说明文字

**验证**：AI 推荐页卡片展示正确，优先级徽章颜色对；趋势页两个图表正常渲染，切换主题后图表颜色跟随变化；窗口缩放图表宽度自适应

## 5. 收尾：归档与全量验证

- [x] 5.1 归档品牌站组件：移除 App.tsx 中对 Hero、AboutSection、ProjectSection、HeroContent 的引用（文件保留不删除）
- [x] 5.2 清理 `src/constants.ts`：移除 `SECTION_IDS`（home/about/projects/contact）和 `NAV_ITEMS`，替换为 `ROUTES` 常量（包含路径和标签）
- [x] 5.3 删除 `src/data/projects.ts`（品牌站项目数据不再需要）
- [x] 5.4 全量验证：`npm run build` 零 error 零 warning + `npm run dev` 手动检查所有页面、主题切换、响应式布局、空状态和错误状态

**验证**：build 成功，所有路由功能正常，无 console 错误，页面无布局错乱
