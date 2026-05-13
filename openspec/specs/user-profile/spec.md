## ADDED Requirements

### Requirement: Get current user profile

系统 SHALL 允许已认证用户获取自己的 Profile 信息。

Profile SHALL 包含：id、username、email、avatar_url、streak_days（连续学习天数）、level（用户等级）、created_at。

#### Scenario: Fetch profile with valid token

- **GIVEN** 用户已认证，持有有效 access token
- **WHEN** 客户端发送 GET /api/users/me
- **THEN** 系统返回 200，响应包含 `id`、`username`、`email`、`avatar_url`、`streak_days`、`level`、`created_at`

#### Scenario: Fetch profile without authentication

- **GIVEN** 用户未认证
- **WHEN** 客户端发送 GET /api/users/me 不携带 Authorization header
- **THEN** 系统返回 401

### Requirement: Update user profile

系统 SHALL 允许已认证用户更新自己的 Profile 字段。

可更新字段 SHALL 包含：avatar_url、streak_days、level。username 和 email SHALL NOT 通过此次请求修改。

#### Scenario: Update avatar URL

- **GIVEN** 用户已认证
- **WHEN** 客户端发送 PATCH /api/users/me，body 包含 `{"avatar_url": "https://example.com/avatar.png"}`
- **THEN** 系统更新 avatar_url 并返回更新后的完整 Profile

#### Scenario: Update learning streak

- **GIVEN** 用户已认证
- **WHEN** 客户端发送 PATCH /api/users/me，body 包含 `{"streak_days": 15}`
- **THEN** 系统更新 streak_days 并返回更新后的完整 Profile

#### Scenario: Update multiple fields

- **GIVEN** 用户已认证
- **WHEN** 客户端发送 PATCH /api/users/me，body 包含 `{"streak_days": 10, "level": 5}`
- **THEN** 系统同时更新 streak_days 和 level

#### Scenario: Validation failure on fields

- **GIVEN** 用户已认证
- **WHEN** 客户端发送 PATCH /api/users/me，body 包含 `{"streak_days": -1}` 或 `{"level": 0}`
- **THEN** 系统返回 422，包含字段级错误详情

### Requirement: Profile defaults for new users

系统 SHALL 在用户注册时为 Profile 字段设置默认值。streak_days SHALL 默认为 0，level SHALL 默认为 1，avatar_url SHALL 默认为 null。

#### Scenario: New user has default profile values

- **GIVEN** 用户刚完成注册
- **WHEN** 用户查询自己的 Profile
- **THEN** streak_days 为 0，level 为 1，avatar_url 为 null
