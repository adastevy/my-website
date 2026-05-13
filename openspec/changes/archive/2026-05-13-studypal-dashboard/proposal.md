## Why

当前网站是一个静态个人品牌展示页，内容固定、无交互性。需要将其改造为一个可交互的 StudyPal 学习 Dashboard，为用户提供学习数据总览、目标管理和趋势分析能力，作为 AI 学习平台的前端基石。这是从品牌站向 SaaS 工具转变的第一步。

## What Changes

- **BREAKING**：移除品牌站内容（HeroContent、AboutSection、ProjectSection 的品牌文案和 CTA），主页替换为 StudyPal Dashboard
- 新建 `Dashboard` 组件，采用左侧导航 + 右侧内容区的经典布局
- 新建数据统计卡片组件，展示学习时长、课程数、完成率、连续学习天数
- 新建每日目标清单组件，支持勾选完成（前端 mock 状态管理）
- 新建 AI 建议学习面板（mock 数据展示推荐课程和知识点）
- 新建周/月趋势图组件（使用 Chart.js 或 recharts，mock 数据驱动）
- 新建 mock 数据层 `src/mock/`，统一管理所有 mock 数据
- 引入 React Router，支持多页面路由（Dashboard、知识库等后续页面）
- 保留并复用：Navbar（更新导航链接）、ThemeToggle、ParticleCanvas、useTheme、useParticles
- **BREAKING**：移除 `SECTION_IDS` 和 `NAV_ITEMS` 中的品牌站锚点常量，替换为路由导航项

## Capabilities

### New Capabilities

- `dashboard-layout`: Dashboard 整体布局——左侧固定导航栏（含路由链接）+ 右侧可滚动内容区，响应式适配（窄屏侧栏折叠）
- `stats-cards`: 数据统计卡片——展示学习时长、课程数、完成率、连续学习天数四个核心指标，带数值动画效果
- `daily-goals`: 每日目标清单——展示用户自定义的每日学习目标，支持勾选/取消勾选，完成进度反馈
- `study-recommendations`: AI 建议学习面板——以卡片列表展示推荐课程和知识点，标注优先级和预计时长
- `trend-charts`: 周/月趋势图——使用 recharts 渲染，展示学习时长和完成课程数的周趋势和月趋势

### Modified Capabilities

（无——当前无已有 spec，所有能力均为新建）

## Impact

- **新增文件**：`src/components/Dashboard/`（布局 + 子组件约 6~8 个文件）、`src/mock/`（mock 数据文件）、`src/pages/`（路由页面）
- **修改文件**：`src/App.tsx`（引入 Router + Dashboard）、`src/constants.ts`（路由常量替换锚点常量）、`src/components/Navbar/Navbar.tsx`（链接改为路由跳转）
- **保留文件**：`src/components/Hero/`（归档不删除，未来可能用于欢迎页）、`src/components/AboutSection/`、`src/components/ProjectSection/`（归档）
- **新增依赖**：`react-router-dom`、`recharts`
- **弃用文件**：`src/data/projects.ts`（品牌站项目数据不再需要）

### 回滚方案

如 Dashboard 上线后出现问题，将 App.tsx 恢复为引入 Hero 的版本，移除 Dashboard 导入即可。品牌站组件未删除，可随时恢复。

## Out of Scope (NOT doing)

- 后端 API 接口开发
- AI 功能（真实 LLM 集成、智能推荐算法）
- 用户认证与鉴权
- 数据持久化（所有数据来源于 mock）
- 国际化（i18n）
- 自动化测试
- 后端部署配置
