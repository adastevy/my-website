## Context

StudyPal 前端已具备 Dashboard 布局、统计卡片、学习目标等功能，但数据全部硬编码于 mock 层。当前无后端服务，无用户身份体系。需要在不动摇前端构建的前提下，新增独立后端服务。

## Goals / Non-Goals

**Goals:**
- 提供独立的 FastAPI 后端服务，与前端解耦
- 实现用户名/邮箱 + 密码注册与登录
- JWT access/refresh token 双 token 认证机制
- 用户 Profile 的存储与查询
- SQLite 持久化 + Alembic 数据库迁移

**Non-Goals:**
- 后台管理界面
- 密码重置 / 邮箱验证
- OAuth / 第三方登录
- 前端集成（仅提供 API）
- HTTPS / 生产环境部署配置

## Decisions

### 1. 后端目录结构

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app 入口，CORS，路由注册
│   ├── config.py            # 配置（JWT secret, DB URL 等）
│   ├── database.py          # SQLAlchemy engine + session
│   ├── models/
│   │   ├── __init__.py
│   │   └── user.py          # User ORM model
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── user.py          # Pydantic request/response models
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py           # /api/auth/* 路由
│   │   └── users.py          # /api/users/* 路由
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth.py           # 注册/登录/token 业务逻辑
│   │   └── user.py           # Profile 业务逻辑
│   └── utils/
│       ├── __init__.py
│       └── security.py       # JWT 生成/验证，密码哈希
├── alembic/
│   └── versions/             # 迁移脚本
├── alembic.ini
├── requirements.txt
└── studypal.db               # SQLite 数据库文件（gitignore）
```

**Why**: 分层架构（router → service → model）保持关注点分离，与 FastAPI 社区最佳实践一致。`backend/` 独立于前端 `src/`，互不干扰构建。

### 2. 数据库选型：SQLite

**选择**：SQLite 3  
**替代方案**：PostgreSQL

SQLite 零配置、无需独立进程、文件即数据库，适合单机开发和小规模部署。并发写入是已知瓶颈，但 StudyPal 当前为用户个人工具，单用户并发可忽略。后续如需扩展，SQLAlchemy 抽象层切换 PostgreSQL 仅需改连接字符串。

### 3. 认证方案：JWT 双 token

**选择**：Access Token（30 min）+ Refresh Token（7 days）

- **Access Token**：承载用户身份，短有效期降低泄露风险
- **Refresh Token**：存储于数据库，可撤销，用于换取新 access token
- **Token 载荷**：`{ sub: user_id, exp: timestamp }`
- **签名算法**：HS256，secret 来自环境变量/配置文件

**替代方案**：Session + Cookie — 更传统但要求服务端状态，API 跨域部署不友好。JWT 无状态验证更适合前后端分离。

### 4. 密码存储：bcrypt

**选择**：passlib[bcrypt]，cost factor = 12  
**替代方案**：argon2 — 更现代但 Python 生态中 bcrypt 更成熟，依赖更轻。

### 5. 数据库迁移：Alembic

**选择**：Alembic 自动生成迁移脚本  
**Why**：版本化管理 schema 变更，可回滚，可追踪，团队协作必备。

### 6. 数据模型

单表 `users`，Profile 字段合并入 users 表（避免不必要的一对一关系）：

| Column | Type | Constraint |
|--------|------|------------|
| id | INTEGER | PK, AUTOINCREMENT |
| username | VARCHAR(50) | UNIQUE, NOT NULL |
| email | VARCHAR(120) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(128) | NOT NULL |
| avatar_url | VARCHAR(255) | NULLABLE |
| streak_days | INTEGER | DEFAULT 0 |
| level | INTEGER | DEFAULT 1 |
| created_at | DATETIME | DEFAULT NOW |
| updated_at | DATETIME | DEFAULT NOW, ON UPDATE |

## API 端点

### POST /api/auth/register

注册新用户。

**Request:**
```json
{
  "username": "string (3-50 chars, alphanumeric)",
  "email": "string (valid email, max 120 chars)",
  "password": "string (min 8 chars)"
}
```

**Response (201):**
```json
{
  "id": 1,
  "username": "alice",
  "email": "alice@example.com",
  "created_at": "2026-05-13T10:00:00Z"
}
```

**Errors:** 400（字段校验失败）、409（用户名或邮箱已存在）

### POST /api/auth/login

用户登录，返回 token pair。

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

**Errors:** 401（凭证无效）

### POST /api/auth/refresh

使用 refresh token 换取新的 access token。

**Request:**
```json
{
  "refresh_token": "eyJ..."
}
```

**Response (200):**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

**Errors:** 401（refresh token 无效或已撤销）

### GET /api/users/me

获取当前登录用户的 Profile。

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "id": 1,
  "username": "alice",
  "email": "alice@example.com",
  "avatar_url": null,
  "streak_days": 7,
  "level": 3,
  "created_at": "2026-05-01T00:00:00Z"
}
```

**Errors:** 401（未认证）

### PATCH /api/users/me

更新当前用户的 Profile 字段。

**Headers:** `Authorization: Bearer <access_token>`

**Request (all optional):**
```json
{
  "avatar_url": "https://example.com/avatar.png",
  "streak_days": 8,
  "level": 4
}
```

**Response (200):** 同 GET /api/users/me

**Errors:** 401（未认证）、422（字段校验失败）

## 模块层级图

```
┌─────────────────────────────┐
│         main.py             │
│  FastAPI app, CORS, routes  │
└──────────┬──────────────────┘
           │
    ┌──────┴──────┐
    │   Routers   │
    ├─────────────┤
    │ auth.py     │  /api/auth/*
    │ users.py    │  /api/users/*
    └──────┬──────┘
           │
    ┌──────┴──────┐
    │  Services   │
    ├─────────────┤
    │ auth.py     │  注册/登录/token 逻辑
    │ user.py     │  Profile CRUD
    └──┬──────┬───┘
       │      │
  ┌────┴──┐ ┌─┴──────────┐
  │Models │ │ Utils       │
  │user.py│ │ security.py │
  │  ORM  │ │ JWT + hash  │
  └───────┘ └────────────┘
```

## Risks / Trade-offs

- **[Risk] SQLite 并发写入瓶颈** → 单用户场景下当前无实际影响。后续迁移至 PostgreSQL 仅需改 database.py 连接字符串和 alembic 配置。
- **[Risk] JWT 无法主动失效** → refresh token 存储于数据库，可通过删除 refresh token 记录实现撤销。access token 有效期仅 30 分钟，风险窗口可控。
- **[Risk] Secret key 硬编码或泄漏** → 使用环境变量 `JWT_SECRET`，开发环境提供默认值并通过 .gitignore 排除 .env 文件。
- **[Risk] 密码强度不足** → Pydantic 校验最小长度 8，前端未来可加强度指示器，当前 scope 内仅服务端校验。

## Migration Plan

1. `pip install -r requirements.txt` 安装依赖
2. `alembic upgrade head` 运行迁移创建表
3. `uvicorn app.main:app --reload` 启动开发服务器
4. 无需数据迁移（新项目，无存量数据）
5. **回滚**：`alembic downgrade -1` 撤销上一迁移

## Open Questions

- 前端何时接入后端 API？（当前 proposal 标记为 out-of-scope，需后续 change 跟进）
- 是否需要 refresh token 的自动轮换机制（refresh rotation）？（当前方案每 refresh 一次返回同一 token，后续可增强）
