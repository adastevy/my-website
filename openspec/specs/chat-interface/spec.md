## ADDED Requirements

### Requirement: Chat page layout

系统 SHALL 在 Dashboard 中新增聊天页面（/chat），包含消息列表区和输入区。

侧栏导航 SHALL 新增 "AI 助手" 入口，路由到 /chat。

#### Scenario: Navigate to chat page

- **GIVEN** 用户在 Dashboard 中
- **WHEN** 用户点击侧栏 "AI 助手"
- **THEN** 路由切换到 /chat，显示聊天页面

#### Scenario: Chat page initial state

- **GIVEN** 用户首次访问 /chat，无历史消息
- **WHEN** 页面加载完成
- **THEN** 显示空消息区和输入框，输入框处于可用状态

### Requirement: Message bubbles

系统 SHALL 以气泡样式展示消息。用户消息气泡 SHALL 靠右显示（蓝色背景），AI 消息气泡 SHALL 靠左显示（灰色/暗色背景）。

#### Scenario: User message renders

- **GIVEN** 用户发送消息 "你好"
- **WHEN** 消息发送后
- **THEN** 右侧显示蓝色气泡，内容为 "你好"

#### Scenario: AI response renders

- **GIVEN** 用户发送消息后收到 AI 流式回复
- **WHEN** 流式回复完成
- **THEN** 左侧显示灰色气泡，内容为 AI 回复全文

### Requirement: Markdown rendering

系统 SHALL 使用 react-markdown 渲染 AI 回复中的 Markdown 内容（标题、列表、加粗、代码块、链接）。

用户消息 SHALL 以纯文本展示，不渲染 Markdown。

#### Scenario: AI message with Markdown

- **GIVEN** AI 回复包含 Markdown 格式文本 `**重点**\n- 第一点\n- 第二点`
- **WHEN** 消息渲染完成
- **THEN** 显示加粗的 "重点" 和项目符号列表

#### Scenario: Code block in AI message

- **GIVEN** AI 回复包含代码块 ` ```python\nprint("hello")\n``` `
- **WHEN** 消息渲染完成
- **THEN** 代码块以等宽字体高亮显示

### Requirement: Auto-scroll

系统 SHALL 在新消息到达或 AI 逐 token 流式返回时自动滚动到消息列表底部。

用户手动上滚查看历史时 SHALL NOT 强制跳回底部。

#### Scenario: Auto-scroll on new message

- **GIVEN** 用户已在消息列表底部
- **WHEN** 用户发送消息或 AI 返回新 token
- **THEN** 消息列表自动滚动到底部

#### Scenario: No auto-scroll when reading history

- **GIVEN** 用户上滚查看历史消息
- **WHEN** 新消息到达（非用户本人发送）
- **THEN** 消息列表不自动滚动

### Requirement: Streaming display

系统 SHALL 在 AI 流式返回过程中实时渲染已接收的 token，不等待完整响应。

系统 SHALL 在 AI 回复期间显示加载指示器（闪烁光标或三个点），完成后移除。

发送按钮 SHALL 在 AI 回复期间处于禁用状态。

#### Scenario: Real-time token rendering

- **GIVEN** 用户已发送消息
- **WHEN** AI 返回第一个 token
- **THEN** 消息列表中新增一个 AI 气泡，内容实时更新

#### Scenario: Loading indicator

- **GIVEN** 用户已发送消息，AI 尚未返回第一个 token
- **WHEN** 等待期间
- **THEN** 消息区底部显示加载指示器

#### Scenario: Send button disabled during response

- **GIVEN** AI 正在回复
- **WHEN** 用户在收到完整回复前尝试发送新消息
- **THEN** 发送按钮不可点击
