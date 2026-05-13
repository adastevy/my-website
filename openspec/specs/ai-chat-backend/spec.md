## ADDED Requirements

### Requirement: Streaming chat with AI

系统 SHALL 提供流式聊天 API，接收用户消息后调用 DeepSeek 模型并以 SSE 格式逐 token 返回响应。

系统 SHALL 在请求中注入用户学习数据（streak_days、level）作为上下文，生成个性化回复。API Key SHALL 仅从后端环境变量读取，不返回给前端。

#### Scenario: Successful streaming response

- **GIVEN** 用户已认证，持有有效 access token
- **WHEN** 客户端发送 POST /api/chat，body 包含 `{"message": "如何提高学习效率？"}`
- **THEN** 系统以 `text/event-stream` 格式逐 token 返回 AI 回复，最后发送 `[DONE]`

#### Scenario: Unauthenticated request

- **GIVEN** 用户未认证
- **WHEN** 客户端发送 POST /api/chat 不携带 Authorization header
- **THEN** 系统返回 401

#### Scenario: Empty message

- **GIVEN** 用户已认证
- **WHEN** 客户端发送 POST /api/chat，body 包含 `{"message": ""}`
- **THEN** 系统返回 422

#### Scenario: DeepSeek API unavailable

- **GIVEN** 用户已认证，DeepSeek API 返回错误
- **WHEN** 客户端发送 POST /api/chat
- **THEN** 系统返回 502，消息提示 "AI service unavailable"

### Requirement: Chat history persistence

系统 SHALL 在每次对话完成后将用户消息和 AI 回复完整存储到 chat_messages 表。

系统 SHALL 记录消息角色（user / assistant）和时间戳。

#### Scenario: Messages stored after streaming completes

- **GIVEN** 用户发送消息并收到完整 AI 流式回复
- **WHEN** SSE 流以 `[DONE]` 结束
- **THEN** chat_messages 表中新增 2 条记录：role=user 和 role=assistant

#### Scenario: Failed request not stored

- **GIVEN** 用户已认证，DeepSeek API 调用失败
- **WHEN** 系统返回 502
- **THEN** chat_messages 表中仅保存用户消息，不保存 assistant 消息

### Requirement: Chat history retrieval

系统 SHALL 允许已认证用户获取自己的对话历史，按时间升序排列。

#### Scenario: Fetch chat history

- **GIVEN** 用户已认证且有历史消息
- **WHEN** 客户端发送 GET /api/chat/history
- **THEN** 系统返回 200，`messages` 数组按 created_at 升序排列

#### Scenario: Empty history

- **GIVEN** 用户已认证但无历史消息
- **WHEN** 客户端发送 GET /api/chat/history
- **THEN** 系统返回 200，`messages` 为空数组

### Requirement: Personalized learning context

系统 SHALL 在每次调用 DeepSeek API 时构建包含用户当前学习数据的 system prompt。

系统 SHALL 从数据库查询用户的 streak_days 和 level 注入 system message。

#### Scenario: Context injected into AI request

- **GIVEN** 用户 streak_days=7、level=3
- **WHEN** 用户发送任意聊天消息
- **THEN** 发送给 DeepSeek 的 messages[0] 为 role=system，内容包含 streak_days=7 和 level=3
