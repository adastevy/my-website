# Tasks: AI 聊天助手

## Phase 1: 后端基础设施（配置、模型、依赖）

- [x] 在 `backend/app/config.py` 新增 `DEEPSEEK_API_KEY` 和 `DEEPSEEK_BASE_URL` 配置项
- [x] 创建 `backend/app/models/chat.py`，定义 `ChatMessage` ORM 模型
- [x] 在 `backend/app/models/__init__.py` 中导出 `ChatMessage`
- [x] 更新 `backend/requirements.txt`，新增 `httpx`、`sse-starlette`
- [x] 更新 `backend/.env.example`，新增 `DEEPSEEK_API_KEY` 和 `DEEPSEEK_BASE_URL`
- [x] 更新 `backend/alembic/env.py` 注册 chat 模型
- [x] 生成并应用 Alembic 迁移 `5de674e8847f_add_chat_messages_table`

**验证**：✅ `from app.models.chat import ChatMessage` — 通过，迁移已应用

## Phase 2: 后端业务逻辑（Schema、Service）

- [x] 创建 `backend/app/schemas/chat.py`，定义 `ChatRequest`、`ChatHistoryResponse`、`ChatMessageItem`
- [x] 创建 `backend/app/services/chat.py`，实现：DeepSeek 流式调用、学习数据上下文构建、历史查询与持久化

**验证**：✅ schema 和 service 模块导入成功

## Phase 3: 后端路由注册

- [x] 创建 `backend/app/routers/chat.py`，实现 `POST /api/chat`（SSE 流式）和 `GET /api/chat/history`
- [x] 修改 `backend/app/main.py`，注册 chat router

**验证**：✅ `/api/chat` 和 `/api/chat/history` 路由已注册

## Phase 4: 前端依赖与常量

- [x] 安装 `react-markdown`、`remark-gfm`
- [x] 更新 `src/constants.ts`，新增 `/chat` 路由和 "AI 助手" 导航项

**验证**：✅ `npm run build` TypeScript 编译通过

## Phase 5: 前端聊天组件

- [x] 创建 `src/components/Chat/ChatBubble.tsx`
- [x] 创建 `src/components/Chat/ChatInput.tsx`
- [x] 创建 `src/components/Chat/MarkdownRenderer.tsx`
- [x] 创建 `src/components/Chat/ChatMessageList.tsx`
- [x] 更新 `src/index.css` 添加 `.markdown-content` 样式

**验证**：✅ `npm run build` 编译通过

## Phase 6: 前端页面与路由集成

- [x] 创建 `src/pages/ChatPage.tsx`
- [x] 更新 `src/components/Dashboard/Sidebar.tsx`，新增 "AI 助手" 图标和导航项
- [x] 更新 `src/components/Dashboard/BottomNav.tsx`，新增 "AI 助手" 移动端图标
- [x] 更新 `src/App.tsx`，新增 `/chat` 路由

**验证**：✅ `npm run build` 编译通过
