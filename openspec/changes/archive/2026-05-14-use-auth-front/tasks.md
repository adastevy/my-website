## Phase 1: 基础层（mock 数据 + 服务层 + Context）

### Task 1.1: 创建 mock 用户数据模块

- [x] 创建 `src/mock/auth.ts`，定义 `MockUser`、`MockSession` 类型，提供 localStorage 读写工具函数

**验证**: `tsc -b --noEmit` 通过

### Task 1.2: 创建 authService 服务层

- [x] 创建 `src/services/authService.ts`，实现 `register`、`login`、`refresh`、`getMe` 方法，mock 模式下操作 localStorage，接口对齐 backend auth spec

**验证**: `tsc -b --noEmit` 通过

### Task 1.3: 创建 AuthContext

- [x] 创建 `src/context/AuthContext.tsx`，实现 `AuthProvider`（useReducer + localStorage 持久化），导出 `useAuth` hook

**验证**: `tsc -b --noEmit` 通过

---

## Phase 2: 认证组件（守卫 + 表单）

### Task 2.1: 创建 ProtectedRoute 守卫

- [x] 创建 `src/components/auth/ProtectedRoute.tsx`，未登录重定向到 `/login?redirect=<原路径>`，登录后根据 redirect 参数跳回

**验证**: `tsc -b --noEmit` 通过

### Task 2.2: 创建 LoginForm 组件

- [x] 创建 `src/components/auth/LoginForm.tsx`，包含 username/password 字段、客户端验证、错误提示、loading 状态

**验证**: `tsc -b --noEmit` 通过

### Task 2.3: 创建 RegisterForm 组件

- [x] 创建 `src/components/auth/RegisterForm.tsx`，包含 username/email/password 字段、客户端验证、错误提示、loading 状态

**验证**: `tsc -b --noEmit` 通过

---

## Phase 3: 认证页面

### Task 3.1: 创建 LoginPage

- [x] 创建 `src/pages/LoginPage.tsx`，独立全屏布局（居中卡片，含粒子背景），已登录自动重定向 `/overview`

**验证**: `tsc -b --noEmit` 通过

### Task 3.2: 创建 RegisterPage

- [x] 创建 `src/pages/RegisterPage.tsx`，独立全屏布局，已登录自动重定向 `/overview`

**验证**: `tsc -b --noEmit` 通过

---

## Phase 4: 个人中心（Profile 组件 + 页面）

### Task 4.1: 创建 ProfileCard 组件

- [x] 创建 `src/components/profile/ProfileCard.tsx`，展示头像、用户名、等级、连续学习天数、累计学习天数、完成目标数

**验证**: `tsc -b --noEmit` 通过

### Task 4.2: 创建 LogoutButton 组件

- [x] 创建 `src/components/profile/LogoutButton.tsx`，点击调用 logout，清除 session 并跳转 `/login`

**验证**: `tsc -b --noEmit` 通过

### Task 4.3: 创建 ProfilePage

- [x] 创建 `src/pages/ProfilePage.tsx`，组装 ProfileCard + LogoutButton，通过 ProtectedRoute 保护

**验证**: `tsc -b --noEmit` 通过

---

## Phase 5: 集成（路由重构 + Navbar 更新 + 常量）

### Task 5.1: 更新路由常量

- [x] 修改 `src/constants.ts`，新增 `ROUTES.login`、`ROUTES.register`、`ROUTES.profile` 常量

**验证**: `tsc -b --noEmit` 通过

### Task 5.2: Navbar 添加头像入口

- [x] 修改 `src/components/Navbar/Navbar.tsx`，已登录时右侧显示头像图标，点击跳转 `/profile`；未登录时不渲染

**验证**: `tsc -b --noEmit` 通过

### Task 5.3: 路由重构

- [x] 修改 `src/App.tsx`，拆分公开路由（`/login`、`/register` 用全屏布局）和受保护路由（套 Dashboard + ProtectedRoute），新增 `/profile` 路由

**验证**: `npm run build` 成功，所有路由可访问
