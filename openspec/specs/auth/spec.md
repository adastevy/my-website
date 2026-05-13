## ADDED Requirements

### Requirement: User registration

系统 SHALL 允许用户通过提供用户名、邮箱和密码创建账户。

用户名 SHALL 为 3-50 字符的字母数字字符串，邮箱 SHALL 为有效格式且不超过 120 字符，密码 SHALL 至少 8 字符。密码 SHALL 使用 bcrypt 哈希存储，系统 SHALL NOT 以明文形式存储或返回密码。

#### Scenario: Successful registration

- **GIVEN** 用户名和邮箱在系统中不存在
- **WHEN** 客户端发送 POST /api/auth/register，body 包含 `{"username": "alice", "email": "alice@example.com", "password": "secret123"}`
- **THEN** 系统创建用户并返回 201，响应包含 `id`、`username`、`email`、`created_at`

#### Scenario: Duplicate username

- **GIVEN** 系统中已存在用户名为 "alice" 的用户
- **WHEN** 客户端尝试注册相同的 username
- **THEN** 系统返回 409，消息提示 "Username already taken"

#### Scenario: Duplicate email

- **GIVEN** 系统中已存在邮箱为 "alice@example.com" 的用户
- **WHEN** 客户端尝试注册相同的 email
- **THEN** 系统返回 409，消息提示 "Email already registered"

#### Scenario: Validation failure

- **GIVEN** 无前置条件
- **WHEN** 客户端发送 `{"username": "ab", "email": "not-an-email", "password": "123"}`
- **THEN** 系统返回 422，包含字段级错误详情

### Requirement: User login

系统 SHALL 允许用户通过用户名和密码登录，成功后返回 JWT access token 和 refresh token。

Access token SHALL 有效期为 30 分钟，refresh token SHALL 有效期为 7 天。Refresh token SHALL 持久化在数据库中。

#### Scenario: Successful login

- **GIVEN** 用户 "alice" 已注册，密码为 "secret123"
- **WHEN** 客户端发送 POST /api/auth/login，body 包含 `{"username": "alice", "password": "secret123"}`
- **THEN** 系统返回 200，响应包含 `access_token`、`refresh_token`、`token_type: "bearer"`、`expires_in: 1800`

#### Scenario: Invalid credentials

- **GIVEN** 用户 "alice" 已注册
- **WHEN** 客户端发送错误的用户名或密码
- **THEN** 系统返回 401，消息提示 "Invalid username or password"

#### Scenario: Login with email as username

- **GIVEN** 用户 "alice" 已注册，邮箱为 "alice@example.com"
- **WHEN** 客户端发送 POST /api/auth/login，使用邮箱 "alice@example.com" 作为 username 字段值
- **THEN** 系统 SHALL 同时匹配 username 和 email 字段，允许凭邮箱登录

### Requirement: JWT token refresh

系统 SHALL 允许用户使用有效的 refresh token 换取新的 access token。

系统 SHALL 验证 refresh token 存在于数据库且未被撤销。

#### Scenario: Successful token refresh

- **GIVEN** 用户已登录，持有有效的 refresh token（未过期、未撤销）
- **WHEN** 客户端发送 POST /api/auth/refresh，body 包含 `{"refresh_token": "<valid_token>"}`
- **THEN** 系统返回 200，响应包含新的 `access_token`、`token_type`、`expires_in`

#### Scenario: Expired or invalid refresh token

- **GIVEN** 用户的 refresh token 已过期或不存在
- **WHEN** 客户端发送 POST /api/auth/refresh 携带该 token
- **THEN** 系统返回 401，消息提示 "Invalid or expired refresh token"

#### Scenario: Revoked refresh token

- **GIVEN** 用户的 refresh token 已被标记为 revoked
- **WHEN** 客户端发送 POST /api/auth/refresh 携带该 token
- **THEN** 系统返回 401，消息提示 "Refresh token has been revoked"

### Requirement: Protected route authentication

系统 SHALL 对需要认证的端点验证请求头中的 Bearer token。

有效 token SHALL 解析出 user_id 并注入请求上下文，无效或缺失 token SHALL 返回 401。

#### Scenario: Valid access token

- **GIVEN** 用户已登录，持有有效的 access token
- **WHEN** 客户端发送 GET /api/users/me，Header 包含 `Authorization: Bearer <valid_token>`
- **THEN** 系统解析 user_id，继续处理请求

#### Scenario: Missing authorization header

- **GIVEN** 用户未提供认证信息
- **WHEN** 客户端发送 GET /api/users/me 不携带 Authorization header
- **THEN** 系统返回 401，消息提示 "Not authenticated"

#### Scenario: Expired access token

- **GIVEN** 用户的 access token 已过期
- **WHEN** 客户端使用该过期 token 访问受保护端点
- **THEN** 系统返回 401，消息提示 "Token has expired"
