## Requirements

### Requirement: User registration

前端 SHALL 提供注册页面（`/register`），允许用户通过填写 username、email、password 创建账户。

注册页面 SHALL 为独立全屏布局，不包含 Dashboard 的 Sidebar 和 BottomNav。注册成功后 SHALL 自动登录并跳转至 `/overview`。

#### Scenario: Successful registration

- **GIVEN** username 和 email 在 mock 存储中不存在
- **WHEN** 用户在 `/register` 页面填写有效的 username、email、password 并提交
- **THEN** 系统创建用户，存储至 localStorage 的 `studypal_mock_users`，自动设置登录态，跳转至 `/overview`

#### Scenario: Duplicate username

- **GIVEN** mock 存储中已存在 username 为 "alice" 的用户
- **WHEN** 用户以相同 username 提交注册
- **THEN** 系统在表单中显示错误提示 "用户名已被使用"

#### Scenario: Duplicate email

- **GIVEN** mock 存储中已存在 email 为 "alice@example.com" 的用户
- **WHEN** 用户以相同 email 提交注册
- **THEN** 系统在表单中显示错误提示 "邮箱已注册"

#### Scenario: Validation failure

- **GIVEN** 无前置条件
- **WHEN** 用户提交空的 username、无效的 email 格式、或不足 8 字符的 password
- **THEN** 系统在对应字段下方显示验证错误提示，不提交请求

#### Scenario: Toggle to login page

- **GIVEN** 用户在 `/register` 页面
- **WHEN** 用户点击 "已有账户？登录" 链接
- **THEN** 系统导航至 `/login`

### Requirement: User login

前端 SHALL 提供登录页面（`/login`），允许用户通过 username 和 password 登录。

登录页面 SHALL 为独立全屏布局，不包含 Dashboard 的 Sidebar 和 BottomNav。登录成功后 SHALL 存储 token 至 localStorage 并跳转至 `/overview`。已登录用户访问 `/login` SHALL 重定向至 `/overview`。

#### Scenario: Successful login

- **GIVEN** 用户 "alice" 已注册，password 为 "secret123"
- **WHEN** 用户在 `/login` 页面输入正确的 username 和 password 并提交
- **THEN** 系统存储 `access_token` 和 `refresh_token` 至 localStorage 的 `studypal_session`，设置 isAuthenticated 为 true，跳转至 `/overview`

#### Scenario: Invalid credentials

- **GIVEN** 用户 "alice" 已注册
- **WHEN** 用户输入错误的 password 提交登录
- **THEN** 系统在表单中显示错误提示 "用户名或密码错误"

#### Scenario: Redirect if already authenticated

- **GIVEN** 用户已登录
- **WHEN** 用户手动访问 `/login`
- **THEN** 系统重定向至 `/overview`

#### Scenario: Toggle to register page

- **GIVEN** 用户在 `/login` 页面
- **WHEN** 用户点击 "没有账户？注册" 链接
- **THEN** 系统导航至 `/register`

### Requirement: JWT token management

前端 SHALL 在每次 API 请求中自动附带 access token，并在 access token 过期时使用 refresh token 换取新 token。

Mock 模式下 SHALL 使用 `expires_in` 字段（默认 1800 秒）模拟 token 过期逻辑。

#### Scenario: Auto-refresh on token expiry

- **GIVEN** 用户已登录，access token 距签发已超过 1800 秒
- **WHEN** 前端发起受保护请求
- **THEN** 系统先调用 refresh 接口获取新 access token，再继续原请求

#### Scenario: Refresh token also expired

- **GIVEN** 用户已登录，refresh token 距签发已超过 7 天（mock 模式：`studypal_session` 中 `refresh_token` 标记为无效）
- **WHEN** 前端尝试刷新 token
- **THEN** 系统清除 localStorage 中 `studypal_session`，设置 isAuthenticated 为 false，重定向至 `/login`

#### Scenario: Session recovery from localStorage

- **GIVEN** 用户之前登录过，localStorage 中存在有效的 `studypal_session`
- **WHEN** 用户打开新标签页访问应用
- **THEN** AuthContext 初始化时读取 localStorage，恢复 user 状态和 token，用户无需重新登录

### Requirement: Protected route guard

前端 SHALL 通过 `ProtectedRoute` 组件拦截未登录用户访问受保护页面，重定向至 `/login`。

受保护路由包括：`/overview`、`/recommendations`、`/trends`、`/goals`、`/chat`、`/profile` 及任何未知路径。

#### Scenario: Unauthenticated access redirected

- **GIVEN** 用户未登录
- **WHEN** 用户直接访问 `/overview`
- **THEN** 系统重定向至 `/login`，URL 保留 `?redirect=/overview` 参数

#### Scenario: Post-login redirect

- **GIVEN** 用户未登录，被重定向至 `/login?redirect=/goals`
- **WHEN** 用户完成登录
- **THEN** 系统跳转至 `/goals` 而非默认的 `/overview`

#### Scenario: Authenticated access allowed

- **GIVEN** 用户已登录
- **WHEN** 用户访问 `/overview`
- **THEN** 系统正常渲染 Dashboard 布局及对应页面内容
