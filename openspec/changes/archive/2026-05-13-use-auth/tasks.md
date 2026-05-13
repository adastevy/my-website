## 1. 项目脚手架

- [x] 1.1 创建 `backend/` 目录结构（app/models、app/schemas、app/routers、app/services、app/utils）
- [x] 1.2 编写 `backend/requirements.txt`（fastapi、uvicorn、sqlalchemy、alembic、pyjwt、passlib[bcrypt]、pydantic、python-dotenv）
- [x] 1.3 编写 `backend/app/config.py`：JWT_SECRET、DATABASE_URL、ACCESS_TOKEN_EXPIRE_MINUTES、REFRESH_TOKEN_EXPIRE_DAYS
- [x] 1.4 验证：`pip install -r requirements.txt` 成功，`python -c "from app.config import Settings"` 无报错

## 2. 数据库与 ORM 模型

- [x] 2.1 编写 `backend/app/database.py`：SQLAlchemy engine + SessionLocal + Base
- [x] 2.2 编写 `backend/app/models/user.py`：User ORM 模型（id、username、email、password_hash、avatar_url、streak_days、level、created_at、updated_at）
- [x] 2.3 初始化 Alembic（`alembic init`），配置 alembic.ini 和 env.py 指向 SQLite
- [x] 2.4 生成并执行初始迁移脚本，创建 users 表
- [x] 2.5 验证：`alembic upgrade head` 成功，sqlite3 查看表结构正确

## 3. 认证核心逻辑

- [x] 3.1 编写 `backend/app/utils/security.py`：密码哈希（passlib bcrypt）和验证函数
- [x] 3.2 编写 `backend/app/utils/security.py`：JWT access token 和 refresh token 生成/解码函数
- [x] 3.3 编写 `backend/app/schemas/user.py`：UserCreate、UserLogin、TokenResponse、RefreshRequest 等 Pydantic schema
- [x] 3.4 编写 `backend/app/services/auth.py`：注册逻辑（校验唯一性 → 哈希密码 → 创建用户）
- [x] 3.5 编写 `backend/app/services/auth.py`：登录逻辑（匹配 username 或 email → 验证密码 → 生成 token pair）
- [x] 3.6 扩展 `backend/app/models/user.py`：RefreshToken ORM 模型（id、user_id、token、expires_at、revoked）
- [x] 3.7 编写 `backend/app/services/auth.py`：refresh token 逻辑（验证 → 解析 → 检查未撤销 → 返回新 access token）
- [x] 3.8 编写依赖注入 `backend/app/utils/deps.py`：get_current_user（从 Bearer token 解析 user_id → 查库）
- [x] 3.9 验证：手动用 Python 脚本测试注册、登录、refresh 函数调用

## 4. API 路由层

- [x] 4.1 编写 `backend/app/routers/auth.py`：POST /api/auth/register、POST /api/auth/login、POST /api/auth/refresh
- [x] 4.2 编写 `backend/app/main.py`：FastAPI app 实例、CORS 中间件、注册 auth router
- [x] 4.3 验证：`uvicorn app.main:app` 启动，用 curl 测试 register → login → refresh 完整流程

## 5. 用户 Profile

- [x] 5.1 编写 `backend/app/schemas/user.py` 补充：UserProfileResponse、ProfileUpdate
- [x] 5.2 编写 `backend/app/services/user.py`：获取当前用户 Profile、更新 Profile 字段
- [x] 5.3 编写 `backend/app/routers/users.py`：GET /api/users/me、PATCH /api/users/me
- [x] 5.4 在 `backend/app/main.py` 注册 users router
- [x] 5.5 验证：curl 测试 GET /me 返回完整 Profile、PATCH /me 更新 streak_days/level/avatar_url

## 6. 集成验证与收尾

- [x] 6.1 验证所有 spec scenario：注册重复用户名/邮箱返回 409、错误密码返回 401、过期 token 返回 401、refresh token 撤销返回 401、PATCH 非法字段返回 422
- [x] 6.2 检查数据库中密码以 bcrypt 哈希存储、refresh token 持久化
- [x] 6.3 确认 `backend/` 目录不影响前端 `npm run build`
- [x] 6.4 编写 `backend/.env.example` 和 `.gitignore`（排除 .env、studypal.db、__pycache__）
