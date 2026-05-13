## Why

StudyPal 当前所有数据（学习目标、统计数据、推荐内容）均来自前端 mock，没有持久化能力和用户身份体系。引入后端认证后，每个用户将拥有独立的账户和数据，这是从静态展示站向真实学习平台演进的第一步。

## What Changes

- 新增 FastAPI 后端服务，提供 RESTful API
- 新增用户注册接口（用户名 + 邮箱 + 密码）
- 新增用户登录接口，返回 JWT access token + refresh token
- 新增 JWT token 刷新接口
- 新增用户 Profile 接口（头像、连续学习天数、用户等级）
- 使用 SQLite 数据库 + Alembic 进行 schema 迁移管理
- **NOT doing**：后台管理功能、密码重置、邮箱验证、OAuth 第三方登录、前端集成（仅后端 API）

## Capabilities

### New Capabilities

- `auth`: 用户注册、登录、JWT 认证与 token 刷新机制
- `user-profile`: 用户个人信息（头像、连续学习天数、用户等级）的存储与查询

### Modified Capabilities

<!-- 现有 specs 无需修改 — 前端组件仍使用 mock 数据层，后端接入属于实现细节而非 spec 级别变更 -->

## Impact

- **新增依赖**：fastapi、uvicorn、sqlalchemy、alembic、pyjwt、passlib、pydantic
- **新增目录**：`backend/`（独立于前端构建流程）
- **数据库**：SQLite 文件存储于 backend 目录下，无需额外部署
- **前端**：无影响，保持纯静态可部署
- **部署**：后端作为独立服务运行，与前端解耦
