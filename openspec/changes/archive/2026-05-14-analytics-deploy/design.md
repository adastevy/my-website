## Context

StudyPal 当前状态：
- Dashboard 侧栏含 5 项导航（总览、AI推荐、趋势、目标、AI 助手），覆盖了推荐和趋势页
- 统计卡片、图表、推荐列表均来源于前端 mock 数据（`src/mock/`）
- 后端仅有 auth、users、chat 三个 router，无学习数据统计 API
- 数据库仅含 users、refresh_tokens、chat_messages 三张表，无学习行为记录
- 前端使用 React Router BrowserRouter，Dashboard 内嵌子路由

本次变更将 Dashboard 重心从"展示型仪表盘"转向"数据分析面板"，新增学习日历和成就系统，并为后续 AI 驱动建议提供数据基础。

## Goals / Non-Goals

**Goals:**
- 后端新增学习统计聚合 API，从数据库返回用户真实学习数据
- 前端新增学习日历热力图组件（近 12 周每日活跃度可视化）
- 前端新增成就系统组件（已解锁/未解锁徽章 + 进度条）
- 重构侧栏导航为三项：学习数据、AI 对话建议、学习目标
- 统计卡片连接后端 API 而非 mock 数据
- 新增 `learning_sessions` 表记录每日学习行为

**Non-Goals:**
- 不引入新的图表或可视化库
- 不删除现有 mock 数据文件（保留用于开发和测试）
- 不修改 ChatPage 和 GoalsPage 的核心功能逻辑
- 不实现 Docker 容器化部署

## Decisions

### 1. 学习日历: 自定义 SVG 热力图

**方案**: 自定义 React 组件，使用 SVG 渲染 12 周 × 7 天热力图矩阵。

**理由**:
- 不引入额外依赖（react-calendar-heatmap 等库维护不活跃且类型定义缺失）
- SVG 天然支持响应式缩放、暗色模式颜色切换
- Tailwind 的颜色系统可直接映射到热力图色阶

**色阶**（4 级透明度 + empty）:
```
empty   → bg-gray-100 dark:bg-gray-800
level-1 → bg-green-200 dark:bg-green-900
level-2 → bg-green-400 dark:bg-green-700
level-3 → bg-green-600 dark:bg-green-500
level-4 → bg-green-800 dark:bg-green-300
```

**替代方案**: recharts 的 BarChart（已有依赖，但热力图不是 recharts 内置类型，需大量自定义）

### 2. 成就系统: 后端规则引擎 + 前端徽章展示

**方案**: 后端预定义成就规则（Python 函数评估），前端仅负责展示。

**预定义成就** (MVP 6 项):
| key | 名称 | 条件 |
|-----|------|------|
| `first_session` | 初次学习 | 完成第 1 次学习会话 |
| `streak_3` | 三日坚持 | 连续学习 3 天 |
| `streak_7` | 一周战士 | 连续学习 7 天 |
| `streak_30` | 月度学霸 | 连续学习 30 天 |
| `hours_10` | 十小时俱乐部 | 累计学习 10 小时 |
| `hours_50` | 五十小时达人 | 累计学习 50 小时 |

**理由**: 成就规则在后端计算可保证数据一致性，避免前端从多个 API 聚合后重复计算。

**替代方案**: 前端根据 API 返回的原始数据计算成就进度 → 逻辑分散、难以保证一致性

### 3. 侧栏导航重构

**方案**: 将 5 项导航精简为 3 项，重新命名。

**对照表**:
| 旧标签 | 旧路由 | 新标签 | 新路由 | 变更 |
|--------|--------|--------|--------|------|
| 总览 | /overview | 学习数据 | /overview | 页面内容增强（+日历+成就） |
| AI推荐 | /recommendations | — | — | 删除 |
| 趋势 | /trends | — | — | 删除 |
| 目标 | /goals | 学习目标 | /goals | 仅改标签 |
| AI 助手 | /chat | AI 对话建议 | /chat | 仅改标签 |

**理由**: 用户反馈 5 项分类过细，学习数据的核心价值在于"看到自己的学习情况"、"获得 AI 建议"、"管理目标"三项。推荐和趋势属于"学习数据"的子视图。

### 4. 数据库表设计

**`learning_sessions`**:
```sql
CREATE TABLE learning_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    session_date DATE NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 0,
    course_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_ls_user_date ON learning_sessions(user_id, session_date);
```

**`achievements`**:
```sql
CREATE TABLE achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    criteria_json TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**`user_achievements`**:
```sql
CREATE TABLE user_achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    achievement_id INTEGER NOT NULL REFERENCES achievements(id),
    progress INTEGER NOT NULL DEFAULT 0,
    target INTEGER NOT NULL DEFAULT 1,
    unlocked_at TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);
```

### 5. 统计 API 数据流

```
[学习会话记录] → DB aggregation (SQL) → analytics service → JSON response → 前端渲染
```

统计查询使用 SQL 聚合（`SUM`, `COUNT`, `GROUP BY`），不引入 Redis 缓存（MVP 阶段数据量小）。

## Component Hierarchy

```
App
└── Dashboard
    ├── Navbar (不变)
    ├── Sidebar (修改: NAV_ITEMS 改为 3 项)
    ├── BottomNav (修改: 同步 Sidebar 的 3 项)
    └── <Outlet>
        ├── OverviewPage (增强)
        │   ├── StatsCards (修改: 从 API 获取数据)
        │   ├── LearningCalendar (新增)
        │   └── AchievementList (新增)
        ├── ChatPage (不变)
        └── GoalsPage (不变)
```

## API Endpoints

| Method | Path | Auth | Description | Error Codes |
|--------|------|------|-------------|-------------|
| GET | `/api/analytics/overview` | Bearer | 聚合统计总览 | 401 |
| GET | `/api/analytics/calendar?year=2026&month=5` | Bearer | 月度学习日历数据 | 401, 422 |
| GET | `/api/analytics/achievements` | Bearer | 用户成就列表 | 401 |

### GET /api/analytics/overview

Response:
```json
{
  "today_hours": 2.5,
  "active_courses": 12,
  "completion_rate": 78.0,
  "streak_days": 7,
  "total_hours": 45.5,
  "total_sessions": 89
}
```

### GET /api/analytics/calendar

Query: `year` (int, required), `month` (int, required)

Response:
```json
{
  "year": 2026,
  "month": 5,
  "days": [
    {"date": "2026-05-01", "duration_minutes": 45, "level": 2},
    {"date": "2026-05-02", "duration_minutes": 0, "level": 0}
  ]
}
```
Level 计算: 0=0min, 1=1-30min, 2=31-60min, 3=61-120min, 4=120+min

### GET /api/analytics/achievements

Response:
```json
{
  "achievements": [
    {
      "key": "first_session",
      "name": "初次学习",
      "description": "完成第 1 次学习会话",
      "icon": "book-open",
      "unlocked": true,
      "progress": 1,
      "target": 1,
      "unlocked_at": "2026-05-10T08:30:00Z"
    },
    {
      "key": "streak_7",
      "name": "一周战士",
      "description": "连续学习 7 天",
      "icon": "flame",
      "unlocked": false,
      "progress": 3,
      "target": 7,
      "unlocked_at": null
    }
  ]
}
```

## Risks / Trade-offs

- **学习会话数据来源**: 当前无自动记录学习行为的前端逻辑 → 初期由 AI 对话完成后自动记录一条 session（每次对话 = 一次学习会话），后续可扩展为手动打卡。数据可能低估真实学习时长。
- **日历热力图首次渲染**: 12 周 × 7 天 = 84 个 SVG cell，外加 tooltip → 渲染量小，无性能风险。
- **侧栏导航变更**: 删除 /recommendations 和 /trends 页面入口 → 旧路由需处理重定向（redirect to /overview），避免用户书签 404。
- **成就种子数据**: achievements 表需在数据库初始化时插入 6 条预定义成就 → 使用 Alembic migration 的 `op.bulk_insert` 或 Python seeder 脚本。

## Open Questions

- 学习日历是否需要在移动端调整展示形式？（当前设计为 7 列热力图，移动端可能需要横向滚动）
- 成就系统图标的渲染方式：使用 SVG inline 还是 emoji？（推荐 SVG inline，与侧栏图标风格统一）
