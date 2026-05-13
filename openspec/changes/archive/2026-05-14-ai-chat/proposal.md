## Why

StudyPal 当前只有静态数据展示，用户无法与平台进行交互式学习对话。引入 AI 学习助手，让用户能在聊天中获取基于自身学习数据的个性化建议，是从"看板"到"伴侣"的关键一步。

## What Changes

- 新增 AI 聊天页面，消息气泡式 ChatUI（用户消息靠右、AI 回复靠左）
- 新增后端流式聊天 API（SSE），接入 DeepSeek 模型
- 对话历史持久化到 SQLite 数据库（按用户 + 会话组织）
- AI 回复时自动注入用户学习数据（连续天数、等级、课程进度等）作为上下文，生成个性化建议
- 前端支持 Markdown 渲染 AI 回复、消息自动滚动到最新
- 用户认证通过后访问聊天（复用已有 JWT auth）
- **NOT doing**：语音输入、文件上传、模型切换、多会话管理、会话标题自动生成

## Capabilities

### New Capabilities

- `ai-chat-backend`: 流式聊天 API（SSE）、DeepSeek 接入、对话历史持久化、用户学习数据上下文注入
- `chat-interface`: 前端聊天页面（消息气泡、Markdown 渲染、自动滚动、发送/接收状态）

### Modified Capabilities

<!-- 无需修改现有 spec — 聊天页面作为 Dashboard 新增子页面，不影响已有功能 -->

## Impact

- **后端新增依赖**：httpx（调用 DeepSeek API）、sse-starlette（流式响应）
- **前端新增依赖**：react-markdown、remark-gfm（Markdown 渲染）
- **新增数据库表**：chat_messages（id、user_id、role、content、created_at）
- **前端新增文件**：`src/pages/ChatPage.tsx`、`src/components/Chat/ChatBubble.tsx`、`src/components/Chat/ChatInput.tsx`
- **路由变更**：Dashboard 侧栏新增 "AI 助手" 入口（/chat）
- **API 新增端点**：POST /api/chat（流式）、GET /api/chat/history
- **安全**：DeepSeek API Key 仅存于后端环境变量，不暴露给前端
