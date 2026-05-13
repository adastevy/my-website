## ADDED Requirements

### Requirement: Hero section displays personal information

系统 SHALL 在首屏全屏高度区域内居中展示用户姓名、职业和一句话介绍。

#### Scenario: User visits the website for the first time

- **GIVEN** 用户首次访问网站
- **WHEN** 页面加载完成
- **THEN** Hero Section 占据视口 100% 高度（100dvh）
- **AND** 姓名、职业、一句话介绍在 Hero 区域内水平和垂直居中显示
- **AND** 姓名使用 `<h1>` 标签

#### Scenario: Viewport height changes (mobile address bar)

- **GIVEN** 用户在移动端浏览器访问网站
- **WHEN** 浏览器地址栏折叠或展开导致视口高度变化
- **THEN** Hero Section 高度跟随视口自适应，不使用固定 px 高度
- **AND** 内容始终保持垂直居中

#### Scenario: Very long name or title

- **GIVEN** 用户的姓名或职业文本较长
- **WHEN** 文本宽度超出屏幕宽度
- **THEN** 文本自动换行而非溢出截断
- **AND** 保持居中布局不变

### Requirement: CTA button scrolls to projects section

系统 SHALL 在 Hero 区域提供一个 CTA 按钮，点击后平滑滚动到项目区域。

#### Scenario: User clicks CTA button

- **GIVEN** 页面上存在 `id="projects"` 的 Project 区域元素
- **WHEN** 用户点击 Hero 中的 CTA 按钮
- **THEN** 页面平滑滚动至 Project 区域顶部
- **AND** URL 不添加 hash 片段

#### Scenario: Projects section does not exist

- **GIVEN** 页面上不存在 `id="projects"` 的元素
- **WHEN** 用户点击 CTA 按钮
- **THEN** 页面不滚动，静默失败
- **AND** 不抛出异常或显示错误

### Requirement: Hero section is responsive

系统 SHALL 适配不同屏幕尺寸，从 320px 宽度手机到 2560px 超宽屏。

#### Scenario: Mobile screen (320px - 768px)

- **GIVEN** 用户在窄屏设备上访问
- **WHEN** 页面渲染 Hero Section
- **THEN** 文字大小使用响应式断点自适应缩小
- **AND** 所有内容不超出视口边界
- **AND** CTA 按钮可正常点击

#### Scenario: Ultra-wide screen (2560px+)

- **GIVEN** 用户在超宽屏上访问
- **WHEN** 页面渲染 Hero Section
- **THEN** 内容居中但宽度不无限拉伸
- **AND** 背景渐变和粒子覆盖整个视口宽度
