## Why

StudyPal 当前所有页面无需登录即可访问，没有用户身份体系。引入前端认证功能后，用户拥有独立账户，学习数据可关联到个人身份，为后续数据持久化和个性化功能奠定基础。

## What Changes

- 新增登录页面（`/login`），独立全屏页面，不套 Dashboard 布局壳
- 新增注册页面（`/register`），独立全屏页面，字段：username + email + password
- 新增认证状态管理（`AuthContext`），管理 user、token、登录/注册/退出操作
- 新增鉴权守卫组件（`ProtectedRoute`），未登录访问受保护页面时重定向到 `/login`
- 新增 Profile 页面（`/profile`），展示头像、连续学习天数、用户等级、学习统计、退出登录按钮
- Navbar 右侧新增用户头像入口（已登录时显示），点击跳转 `/profile`
- 新增 `authService` 服务层，接口对齐后端 auth spec（`POST /api/auth/register`、`POST /api/auth/login` 等），初期使用 localStorage mock 实现
- 现有路由（`/overview`、`/recommendations`、`/trends`、`/goals`、`/chat`）全部纳入受保护路由
- **NOT doing**：后台管理功能、密码重置、邮箱验证、OAuth 第三方登录、密码修改

## Capabilities

### New Capabilities

- `auth-frontend`: 前端用户注册、登录、JWT token 管理、鉴权路由守卫
- `user-profile-frontend`: 用户个人信息展示（头像、连续学习天数、用户等级、学习统计）与退出登录

### Modified Capabilities

<!-- 现有前端 specs 无需修改 — 页面组件行为不变，仅增加鉴权包裹；后端 auth spec 无需修改，前端 service 层对齐已有接口定义 -->

## Impact

- **路由结构**：`App.tsx` 路由层次重构，拆分为公开路由（login/register）和受保护路由（Dashboard 包裹的页面）
- **Navbar 组件**：新增右侧头像区域，需要读取 AuthContext
- **新增依赖**：无外部 npm 依赖，全部使用已有技术栈（React Context + React Router + Tailwind CSS）
- **mock 数据层**：新增 `src/mock/auth.ts` 和 `src/services/authService.ts`，与已有 mock 目录模式一致
- **后端**：无影响，auth service 层在 mock 模式下完全离线运行；联调时仅需切换 `authService` 实现
- **部署**：前端保持纯静态可部署，无需额外配置
