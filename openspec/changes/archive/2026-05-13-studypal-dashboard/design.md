## Context

当前项目为单页面个人品牌站，通过锚点滚动导航。需改造为 StudyPal 学习 Dashboard，引入 React Router 实现多页面路由，采用左侧导航 + 右侧内容区的经典后台布局。本阶段纯前端实现，所有数据来源于 mock 层。

## Goals / Non-Goals

**Goals:**
- 建立 Dashboard 整体布局框架（侧栏 + 内容区）
- 实现数据统计卡片、每日目标、AI 建议面板、趋势图五类核心组件
- 引入 React Router 替代锚点滚动导航
- 建立 mock 数据层，便于后续替换为真实 API
- 保留并复用现有的主题系统、粒子背景、导航栏组件

**Non-Goals:**
- 后端 API（本阶段不做）
- AI 功能（纯 mock 展示）
- 用户认证
- 数据持久化
- SSR/SSG

## Decisions

### 1. 路由方案：React Router v7

**选型理由**：config.yaml 已指明 '即将引入 React Router 实现多页面路由'，且社区成熟度最高。使用 `react-router-dom` v7，采用 layout route 模式：`Dashboard` 作为父路由包裹侧栏，子路由渲染各功能面板。

**替代方案**：
- TanStack Router：TypeScript 支持更好但生态较小
- 保持锚点滚动：无法满足后续多页面需求

### 2. 图表库：recharts

**选型理由**：声明式 API，原生 React 组件，Tree-shaking 友好，包体积可控。Lightweight Charts 偏金融场景，Chart.js 需要额外 wrapper。

**替代方案**：
- Chart.js + react-chartjs-2：Canvas 渲染性能好但定制主题不如 recharts 方便
- visx：功能强大但学习曲线陡，对 mock 阶段过重

### 3. 状态管理：React Context + useReducer

**选型理由**：Dashboard 内组件需共享 mock 数据。Context 足够覆盖此阶段的全局状态（学习数据、目标列表、主题），不引入 Redux/Zustand 避免过早优化。

**替代方案**：
- Zustand：API 更简洁，但增加一个依赖
- Prop drilling：组件层级浅时可接受，但后续添加功能会增加复杂性

### 4. Mock 数据架构

所有 mock 数据置于 `src/mock/`，按域拆分文件（`stats.ts`、`goals.ts`、`recommendations.ts`、`trends.ts`）。每个文件 export TypeScript 类型和对应的 mock 数据。

Mock 数据通过 Context 注入组件，后续接入真实 API 时仅需替换 Context provider 的内部实现，组件层零修改。

### 5. 组件保留策略

| 组件 | 策略 | 原因 |
|------|------|------|
| `Navbar` | 改造：导航链接从 `sectionId` 改为 `to` 路由路径 | 保留毛玻璃效果和移动端汉堡菜单 |
| `ThemeToggle` | 不变 | 无状态依赖，纯 UI |
| `Hero` | 归档不删除 | 保留粒子背景能力，未来可能用于欢迎页 |
| `ParticleCanvas` | 在 Dashboard 中可选复用 | 作为 Dashboard 背景的装饰元素 |
| `AboutSection` | 归档 | 品牌站内容与学习助手无关 |
| `ProjectSection` | 归档 | 同上 |
| `HeroContent` | 归档 | 被 DashboardMain 替代 |

## Component Architecture

```
App (BrowserRouter)
├── ThemeProvider (Context)
│   ├── Navbar (改造：路由链接)
│   │   └── ThemeToggle (fixed, 不变)
│   └── Routes
│       ├── / → Dashboard (layout route)
│       │   ├── Sidebar (fixed left, nav links)
│       │   └── <Outlet>
│       │       ├── /overview → OverviewPage
│       │       │   ├── StatsCards
│       │       │   ├── DailyGoals
│       │       │   └── WeeklyTrendChart
│       │       ├── /recommendations → RecommendationsPage
│       │       │   └── StudyRecommendations
│       │       └── /trends → TrendsPage
│       │           ├── WeeklyTrendChart
│       │           └── MonthlyTrendChart
│       └── * → (未来路由占位)
│
├── src/mock/               ← Mock 数据层
│   ├── stats.ts
│   ├── goals.ts
│   ├── recommendations.ts
│   └── trends.ts
│
└── src/context/
    └── DashboardContext.tsx  ← 全局状态
```

### Dashboard 布局示意

```
┌──────────────────────────────────────────────────────┐
│  Navbar (fixed top, z-50)                             │
│  StudyPal  Logo    📊总览  💡推荐  📈趋势  🌙 Theme   │
├────────────┬─────────────────────────────────────────┤
│ Sidebar    │  Content Area (scrollable)               │
│ (fixed)    │                                          │
│            │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│ 📊 总览    │  │学习  │ │课程  │ │完成  │ │连续  │   │
│ 💡 AI推荐  │  │2.5h  │ │12门  │ │78%   │ │7天   │   │
│ 📈 学习趋势│  └──────┘ └──────┘ └──────┘ └──────┘   │
│ 📝 每日目标│                                          │
│            │  ┌──────────────────┐ ┌──────────────┐  │
│            │  │ 每日目标          │ │ 周学习趋势    │  │
│            │  │ ☑ 复习React Hooks │ │  ▁▃▅▇▆▄▇    │  │
│ w-56       │  │ ☐ 完成算法练习    │ │  Mon-Sun     │  │
│            │  │ ☐ 阅读架构设计    │ └──────────────┘  │
│            │  └──────────────────┘                    │
│            │  ┌──────────────────────────────────────┐│
│            │  │ AI 学习建议                           ││
│            │  │ 📚 TypeScript 高级类型 → 预计 2h      ││
│            │  │ 📚 系统设计面试 → 预计 3h             ││
│            │  └──────────────────────────────────────┘│
└────────────┴─────────────────────────────────────────┘
```

### 响应式：窄屏（<768px）

```
┌──────────────────────┐
│  Navbar (fixed top)   │
│  StudyPal  ☰  🌙      │
├──────────────────────┤
│  ┌──────┐ ┌──────┐   │
│  │学习  │ │课程  │   │
│  │2.5h  │ │12门  │   │
│  └──────┘ └──────┘   │
│  ┌──────┐ ┌──────┐   │
│  │完成  │ │连续  │   │
│  │78%   │ │7天   │   │
│  └──────┘ └──────┘   │
│                      │
│  每日目标              │
│  ☑ 复习React Hooks    │
│  ☐ 完成算法练习        │
│  ☐ 阅读架构设计        │
│  ...                  │
├──────────────────────┤
│  Bottom Nav (fixed)   │
│  📊  💡  📈  📝       │
└──────────────────────┘
```

## Risks / Trade-offs

- **recharts 包体积**：完整引入约 200KB gzipped。→ 按需引入所需图表类型（LineChart、BarChart、PieChart），控制增量在 ~50KB 以内
- **React Router 首次加载**：SPA 路由懒加载可能产生短暂白屏。→ Dashboard 子页面使用 `React.lazy()` + `Suspense` 懒加载
- **归档组件残留**：Hero、AboutSection 等归档组件保留在代码库中但被 Tree-shaking 排除。→ 不影响线上构建包体积
- **Mock 数据与真实 API 的切换成本**：Context 抽象层可平滑过渡，但真实 API 的 loading/error 状态需要在 Context 中补充。—— 后续接入时仅需修改 Context provider，改动可控

## Open Questions

- Dashboard 侧栏导航项的确切数量和顺序？（当前设计 4 项：总览、AI推荐、趋势、目标）
- 趋势图是否需要日期范围选择器？（当前设计展示默认最近 7 天/4 周，后续可扩展）
