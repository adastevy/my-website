## Requirements

### Requirement: Profile page display

前端 SHALL 在 `/profile` 页面展示用户个人信息，包括头像、用户名、连续学习天数、用户等级和学习统计。

Profile 页面 SHALL 套在 Dashboard 布局内（含 Navbar、Sidebar、BottomNav）。学习统计 SHALL 包含累计学习天数和总完成目标数。

#### Scenario: View profile with data

- **GIVEN** 用户 "alice" 已登录，连续学习 12 天，等级 5，累计学习 30 天，完成 45 个目标
- **WHEN** 用户访问 `/profile`
- **THEN** 页面显示用户头像、username "alice"、"Lv.5"、连续学习 12 天、累计学习 30 天、完成 45 个目标

#### Scenario: Profile with minimal data

- **GIVEN** 用户 "newuser" 刚注册，连续学习 1 天，等级 1，累计 1 天，完成 0 个目标
- **WHEN** 用户访问 `/profile`
- **THEN** 页面正常显示默认头像、等级 Lv.1、连续学习 1 天，统计数据不报错

#### Scenario: Profile requires authentication

- **GIVEN** 用户未登录
- **WHEN** 用户直接访问 `/profile`
- **THEN** 系统重定向至 `/login?redirect=/profile`

### Requirement: Logout

前端 SHALL 在 Profile 页面提供退出登录按钮。退出后 SHALL 清除 localStorage 中的 session 数据并跳转至 `/login`。

#### Scenario: Successful logout

- **GIVEN** 用户已登录，当前在 `/profile` 页面
- **WHEN** 用户点击 "退出登录" 按钮
- **THEN** 系统清除 `studypal_session`，设置 isAuthenticated 为 false，重定向至 `/login`

#### Scenario: Logout then access protected page

- **GIVEN** 用户退出登录后
- **WHEN** 用户尝试访问 `/overview`
- **THEN** 系统重定向至 `/login`

### Requirement: Navbar avatar entry

前端 SHALL 在 Navbar 右侧显示用户头像图标（已登录时），点击后导航至 `/profile`。

未登录时 SHALL 不渲染头像图标（该区域为空）。

#### Scenario: Avatar navigates to profile

- **GIVEN** 用户已登录
- **WHEN** 用户点击 Navbar 右侧头像图标
- **THEN** 系统导航至 `/profile`

#### Scenario: Avatar hidden when not authenticated

- **GIVEN** 用户未登录
- **WHEN** 渲染 Navbar
- **THEN** 右侧不显示头像图标

#### Scenario: Avatar displays in both color modes

- **GIVEN** 用户已登录，当前处于暗色模式
- **WHEN** 渲染 Navbar
- **THEN** 头像图标在暗色背景下可见，点击后正常导航至 `/profile`
