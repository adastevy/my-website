## Context

StudyPal 后端已有 JWT 认证（`/api/auth/*`、`/api/users/*`），前端已有 Dashboard 布局（Sidebar + 4 个子页面）。此 change 新增 AI 聊天功能，需要前后端协同：前端新页面 + 后端新 API。

## Goals / Non-Goals

**Goals:**
- 前端聊天页面：消息气泡 UI、Markdown 渲染、自动滚动
- 后端流式 API（SSE）：调用 DeepSeek，逐 token 推送给前端
- 对话历史持久化到 `chat_messages` 表
- AI 基于用户学习数据（streak_days、level、stats）生成个性化回复
- 复用已有 JWT 认证保护聊天 API

**Non-Goals:**
- 语音输入、文件上传
- 模型切换 UI
- 多会话管理（只有一个默认会话）
- 会话标题自动生成

## Decisions

### 1. 流式方案：SSE

**选择**：Server-Sent Events（SSE），使用 `sse-starlette`  
**替代方案**：WebSocket、HTTP chunked

SSE 单向推送（服务端→客户端）、HTTP 原生支持、浏览器自动重连、比 WebSocket 更轻量。聊天场景不需要客户端主动推送，SSE 是最简方案。

### 2. AI 模型接入：DeepSeek Chat API (OpenAI 兼容格式)

**选择**：调用 `https://api.deepseek.com/v1/chat/completions`，`stream: true`
**替代方案**：Claude API、OpenAI API

后端以 OpenAI SDK 兼容方式调用 DeepSeek，使用 `httpx.AsyncClient` 流式读取响应。

**请求结构**：
```json
{
  "model": "deepseek-chat",
  "messages": [
    {"role": "system", "content": "<用户学习数据上下文>"},
    {"role": "user", "content": "<用户消息>"}
  ],
  "stream": true
}
```

**配置**：`DEEPSEEK_API_KEY` 环境变量，代码中不硬编码。`DEEPSEEK_BASE_URL=https://api.deepseek.com/v1`。

### 3. 个性化上下文注入

每次请求时，后端从数据库查询用户的 `streak_days`、`level`、学习统计数据，拼接为 system message 注入对话：

```
你叫 StudyPal，是学习助手。当前用户学习数据：
- 连续学习天数：7 天
- 用户等级：3 级
基于以上数据给用户提供个性化建议。回答简洁（200 字以内）。
```

### 4. 数据库设计

新增 `chat_messages` 表（扩展现有 SQLite 数据库）：

| Column | Type | Constraint |
|--------|------|------------|
| id | INTEGER | PK, AUTOINCREMENT |
| user_id | INTEGER | FK → users.id, NOT NULL |
| role | VARCHAR(10) | NOT NULL（"user" 或 "assistant"） |
| content | TEXT | NOT NULL |
| created_at | DATETIME | DEFAULT NOW |

已有 `users` 表不变，通过 `user_id` 外键关联。

### 5. 前端组件架构

```
ChatPage
├── ChatMessageList     ← 消息列表容器，自动滚动
│   └── ChatBubble[]    ← 单条消息气泡（用户/助手样式不同）
│       └── MarkdownRenderer  ← react-markdown + remark-gfm
└── ChatInput           ← 输入框 + 发送按钮
```

### 6. 流式消费实现

前端使用 `EventSource` 或 `fetch` + `ReadableStream` 消费 SSE 流。`fetch` 支持 POST（EventSource 仅 GET），所以用 `fetch` + `reader.read()` 逐块解析 SSE `data:` 行。

### 7. 组件复用

- 复用 `useTheme` hook 适配亮/暗模式的聊天气泡颜色
- Dashboard 侧栏（`Sidebar.tsx`）新增导航项 "AI 助手"，路由为 `/chat`
- 聊天页整体使用 Dashboard 布局（左侧边栏 + 右侧内容区）

## API 端点

### POST /api/chat

流式聊天（SSE）。需要认证。

**Headers:** `Authorization: Bearer <access_token>`

**Request:**
```json
{
  "message": "我最近学习效率很低，有什么建议吗？"
}
```

**Response:** `text/event-stream`
```
data: {"token": "你"}

data: {"token": "好"}

data: {"token": "！"}

data: [DONE]
```

**Errors:** 401（未认证）、422（消息为空）

### GET /api/chat/history

获取当前用户对话历史。需要认证。

**Response (200):**
```json
{
  "messages": [
    {"id": 1, "role": "user", "content": "你好", "created_at": "..."},
    {"id": 2, "role": "assistant", "content": "你好！有什么可以帮你的？", "created_at": "..."}
  ]
}
```

## 后端模块结构（扩展已有 backend）

```
backend/app/
├── models/
│   └── chat.py              ← ChatMessage ORM（新增）
├── schemas/
│   └── chat.py              ← ChatRequest, ChatHistoryResponse（新增）
├── routers/
│   └── chat.py              ← /api/chat, /api/chat/history（新增）
├── services/
│   └── chat.py              ← DeepSeek 调用、上下文构建、历史查询（新增）
├── main.py                  ← 注册 chat router（修改）
```

## 组件层级图

```
┌─────────────────────────────┐
│          App.tsx            │
│  BrowserRouter + Routes     │
└──────────┬──────────────────┘
           │
    ┌──────┴──────────────────────┐
    │     Dashboard Layout        │
    │  ┌─────────┬──────────────┐ │
    │  │ Sidebar │  Content     │ │
    │  │         │              │ │
    │  │ /overview │ Overview   │ │
    │  │ /rec...   │ Recommend  │ │
    │  │ /trends   │ Trends     │ │
    │  │ /goals    │ Goals      │ │
    │  │ /chat  ←NEW│ ChatPage │ │ ← NEW
    │  └─────────┴──────────────┘ │
    └─────────────────────────────┘

ChatPage Component:
┌──────────────────────────────┐
│      ChatMessageList         │
│  ┌────────────────────────┐  │
│  │ ChatBubble (assistant) │  │
│  │ ┌────────────────────┐ │  │
│  │ │ MarkdownRenderer   │ │  │
│  │ │ (react-markdown)   │ │  │
│  │ └────────────────────┘ │  │
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │ ChatBubble (user)      │  │
│  │ 纯文本                  │  │
│  └────────────────────────┘  │
├──────────────────────────────┤
│         ChatInput            │
│  [____________] [发送]       │
└──────────────────────────────┘
```

## Risks / Trade-offs

- **[Risk] DeepSeek API 调用失败** → 前端显示错误消息 "AI 暂时不可用"，不崩溃。后端返回非流式错误响应。
- **[Risk] SSE 连接中断** → 前端 `fetch` 流中断后已接收的 token 已渲染，不会丢失。完整响应在流结束后存入数据库，支持从历史恢复。
- **[Risk] API Key 泄漏** → Key 仅在后端环境变量中使用，不经过前端。`.env` 已在 `.gitignore` 中。
- **[Risk] 大量并发流式请求** → SQLite 并发写入限制。当前为单用户场景，无实际风险。

## Migration Plan

1. 生成 Alembic 迁移创建 `chat_messages` 表
2. 安装新依赖：`httpx`、`sse-starlette`（后端），`react-markdown`、`remark-gfm`（前端）
3. 无存量数据迁移
4. **回滚**：`alembic downgrade -1`，删除 chat 路由注册

## Open Questions

- 是否需要消息分页？（当前方案返回全量历史，后续可加分页参数）
- 是否需要 system prompt 的用户自定义？（当前固定模板）
