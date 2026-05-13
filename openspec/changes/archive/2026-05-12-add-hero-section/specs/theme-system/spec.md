## ADDED Requirements

### Requirement: System detects and applies initial theme

系统 SHALL 在首次访问时根据用户系统偏好设置初始主题，并在后续访问时读取存储的偏好。

#### Scenario: First visit with system dark preference

- **GIVEN** 用户首次访问网站（localStorage 中无 theme 值）
- **AND** 操作系统设置为暗色模式
- **WHEN** 页面加载
- **THEN** 页面以暗色模式渲染
- **AND** `<html>` 元素包含 `class="dark"`
- **AND** 首帧渲染即为暗色模式（无闪烁）

#### Scenario: First visit with system light preference

- **GIVEN** 用户首次访问网站
- **AND** 操作系统设置为亮色模式
- **WHEN** 页面加载
- **THEN** 页面以亮色模式渲染
- **AND** `<html>` 元素不包含 `class="dark"`

#### Scenario: Returning user with stored preference

- **GIVEN** 用户之前手动选择了暗色模式
- **AND** localStorage 中 `theme` 值为 `"dark"`
- **WHEN** 用户再次访问页面
- **THEN** 页面以暗色模式渲染
- **AND** 忽略系统当前偏好

### Requirement: User can manually toggle theme

系统 SHALL 提供一个可交互的按钮，允许用户手动在亮/暗模式之间切换。

#### Scenario: User switches from light to dark

- **GIVEN** 当前页面为亮色模式
- **WHEN** 用户点击主题切换按钮
- **THEN** 页面切换为暗色模式
- **AND** `localStorage` 中 `theme` 值更新为 `"dark"`
- **AND** `<html>` 元素添加 `class="dark"`

#### Scenario: User switches from dark to light

- **GIVEN** 当前页面为暗色模式
- **WHEN** 用户点击主题切换按钮
- **THEN** 页面切换为亮色模式
- **AND** `localStorage` 中 `theme` 值更新为 `"light"`
- **AND** `<html>` 元素移除 `class="dark"`

#### Scenario: Rapid toggling

- **GIVEN** 用户快速连续点击切换按钮
- **WHEN** 每次点击触发切换
- **THEN** 主题正确交替切换，无状态错乱
- **AND** 最终主题与最后一次点击一致

### Requirement: Theme toggle button has accessible label

系统 SHALL 为主题切换按钮提供无障碍标签。

#### Scenario: Screen reader accesses the toggle

- **GIVEN** 用户使用屏幕阅读器
- **WHEN** 聚焦到主题切换按钮
- **THEN** 按钮有 `aria-label` 属性，值为 "切换到亮色模式" 或 "切换到暗色模式"
- **AND** 按钮可通过键盘 Enter/Space 激活

### Requirement: Theme system supports system preference change

系统 SHALL 在用户未手动设置主题时，响应操作系统主题变化。

#### Scenario: User has not manually set a preference

- **GIVEN** 用户从未手动切换过主题（localStorage 中无 theme 值）
- **WHEN** 操作系统主题从亮色切换到暗色
- **THEN** 页面跟随切换为暗色模式

#### Scenario: User has manually set a preference

- **GIVEN** 用户手动选择了暗色模式
- **WHEN** 操作系统主题变化
- **THEN** 页面保持暗色模式，不跟随系统变化
