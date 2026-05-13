## ADDED Requirements

### Requirement: Navbar is fixed at the top of the viewport

系统 SHALL 在视口顶部渲染一个固定导航栏，始终可见且不随页面滚动移动。

#### Scenario: Page loads with navbar visible

- **GIVEN** 用户访问网站任意页面
- **WHEN** 页面首次渲染完成
- **THEN** 导航栏固定在视口最顶部
- **AND** 导航栏宽度占满视口 100%
- **AND** 导航栏 z-index 高于页面内容

#### Scenario: Page is scrolled down

- **GIVEN** 导航栏已渲染
- **WHEN** 用户向下滚动页面
- **THEN** 导航栏保持固定在视口顶部，不随内容滚动

### Requirement: Navbar displays brand name on the left

系统 SHALL 在导航栏左侧显示个人品牌名称（纯文本），作为网站标识。

#### Scenario: Brand name renders

- **GIVEN** 导航栏已渲染
- **WHEN** 页面加载完成
- **THEN** 导航栏左侧显示品牌名称文本
- **AND** 品牌名称使用可配置的文本（如 "John Doe" 或用户姓名）

#### Scenario: Brand name on narrow screen

- **GIVEN** 用户在窄屏设备（<768px）上访问
- **WHEN** 导航栏渲染
- **THEN** 品牌名称仍可见，字体大小自适应缩小

### Requirement: Navbar displays navigation links on the right

系统 SHALL 在导航栏右侧展示三个导航链接：首页、项目、联系我。

#### Scenario: Desktop navigation links

- **GIVEN** 用户在桌面端（≥768px）访问
- **WHEN** 导航栏渲染
- **THEN** 右侧显示三个链接：「首页」「项目」「联系我」
- **AND** 链接水平排列，间距合理

#### Scenario: Mobile navigation links collapsed

- **GIVEN** 用户在移动端（<768px）访问
- **WHEN** 导航栏渲染
- **THEN** 右侧链接隐藏，改为显示汉堡菜单按钮（三横线图标）
- **AND** 点击汉堡按钮后展开垂直排列的链接菜单

### Requirement: Clicking a nav link smoothly scrolls to the target section

系统 SHALL 在用户点击导航链接后，平滑滚动到页面中对应的 section 区域。

#### Scenario: Click "项目" link

- **GIVEN** 页面上存在 `id="projects"` 的 section 元素
- **WHEN** 用户点击导航栏中的「项目」链接
- **THEN** 页面平滑滚动到该 section 的顶部
- **AND** URL hash 不发生变化（使用 `scrollIntoView`，不修改 `location.hash`）

#### Scenario: Click "首页" link

- **GIVEN** 页面上存在 `id="home"` 的 section 元素（Hero Section）
- **WHEN** 用户点击导航栏中的「首页」链接
- **THEN** 页面平滑滚动回页面顶部

#### Scenario: Target section does not exist

- **GIVEN** 页面上不存在对应 id 的 section 元素
- **WHEN** 用户点击导航链接
- **THEN** 页面不滚动，静默失败
- **AND** 不抛出异常或显示错误

#### Scenario: Click link with mobile menu open

- **GIVEN** 移动端汉堡菜单已展开
- **WHEN** 用户点击菜单中的导航链接
- **THEN** 菜单自动关闭
- **AND** 页面平滑滚动到目标 section

### Requirement: Navbar shows background blur when scrolled

系统 SHALL 在用户滚动离开页面顶部后，为导航栏添加背景模糊效果；回到顶部后恢复透明背景。

#### Scenario: User scrolls away from top

- **GIVEN** 页面处于顶部（scrollY = 0）
- **AND** 导航栏背景为透明
- **WHEN** 用户向下滚动超过 10px
- **THEN** 导航栏背景变为半透明 + 背景模糊（backdrop-blur）
- **AND** 过渡效果在 300ms 内完成（CSS transition）

#### Scenario: User scrolls back to top

- **GIVEN** 导航栏处于模糊状态（scrollY > 10px）
- **WHEN** 用户滚动回页面顶部（scrollY < 10px）
- **THEN** 导航栏背景恢复为透明
- **AND** 过渡效果平滑（无突然跳变）

#### Scenario: Rapid scroll up and down

- **GIVEN** 导航栏在透明和模糊状态之间快速切换
- **WHEN** 用户快速反复滚动上下
- **THEN** 背景状态正确跟随滚动位置，无状态残留
- **AND** 不产生视觉闪烁

### Requirement: Navbar supports dark mode

系统 SHALL 根据当前主题模式调整导航栏的颜色方案。

#### Scenario: Light mode

- **GIVEN** 当前主题为亮色模式
- **WHEN** 导航栏渲染
- **THEN** 文字颜色为深色系（如 gray-900）
- **AND** 模糊背景使用浅色半透明（如 `bg-white/80`）
- **AND** 汉堡菜单使用深色图标

#### Scenario: Dark mode

- **GIVEN** 当前主题为暗色模式
- **WHEN** 导航栏渲染
- **THEN** 文字颜色为浅色系（如 white）
- **AND** 模糊背景使用深色半透明（如 `bg-gray-950/80`）
- **AND** 汉堡菜单使用浅色图标

#### Scenario: Theme switches while navbar is visible

- **GIVEN** 导航栏可见且处于模糊状态（scrollY > 10）
- **WHEN** 用户通过 ThemeToggle 切换主题
- **THEN** 导航栏背景和文字颜色立即跟随主题更新，无延迟

### Requirement: Hamburger menu is keyboard accessible

系统 SHALL 确保移动端汉堡菜单可通过键盘操作，符合基本无障碍访问标准。

#### Scenario: Keyboard navigation on hamburger button

- **GIVEN** 用户在移动端布局（<768px）
- **WHEN** 用户使用 Tab 键聚焦到汉堡菜单按钮
- **THEN** 按钮具有可见的 focus 样式（ring）
- **AND** 按 Enter 或 Space 键可展开/收起菜单

#### Scenario: Keyboard navigation on menu links

- **GIVEN** 移动端菜单已展开
- **WHEN** 用户按 Tab 键在菜单链接之间导航
- **THEN** 每个链接有 visible focus 样式
- **AND** 按 Enter 触发链接滚动行为

### Requirement: Navbar does not overlap page content

系统 SHALL 确保导航栏不遮挡 Hero Section 或其他页面内容的顶部。

#### Scenario: Hero section with navbar

- **GIVEN** 导航栏固定高度为 h-16（约 64px）
- **WHEN** 页面渲染
- **THEN** Hero Section 或其他首个内容区域的顶部不被导航栏遮挡
- **AND** 页面内容在导航栏下方正常显示（通过 padding-top 或布局间距）
