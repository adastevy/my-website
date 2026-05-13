## ADDED Requirements

### Requirement: Project section renders below the Hero section

系统 SHALL 在 Hero Section 下方渲染项目展示区，使用 `id="projects"` 作为锚点标识。

#### Scenario: Project section appears on page load

- **GIVEN** 用户访问网站首页
- **WHEN** 页面加载完成
- **THEN** Hero Section 下方显示项目展示区
- **AND** 项目展示区具有 `id="projects"` 属性，支持锚点跳转

#### Scenario: CTA click scrolls to project section

- **GIVEN** 用户在 Hero Section 中
- **WHEN** 用户点击「查看我的项目」CTA 按钮
- **THEN** 页面平滑滚动到项目展示区顶部
- **AND** 导航栏不遮挡 section 标题（通过 `scroll-mt-16` 实现）

#### Scenario: Navbar "项目" link scrolls to project section

- **GIVEN** 导航栏已渲染
- **WHEN** 用户点击导航栏中的「项目」链接
- **THEN** 页面平滑滚动到项目展示区顶部
- **AND** 项目链接和 CTA 按钮指向相同的 `#projects` 锚点

### Requirement: Project cards display in a responsive grid

系统 SHALL 以卡片网格布局展示项目，桌面端至少 2 列，移动端 1 列。

#### Scenario: Desktop layout (>=768px)

- **GIVEN** 用户在桌面端访问
- **WHEN** 项目展示区渲染
- **THEN** 项目卡片以 2 列网格排列
- **AND** 卡片水平间距均匀（CSS Grid gap）

#### Scenario: Mobile layout (<768px)

- **GIVEN** 用户在移动端访问
- **WHEN** 项目展示区渲染
- **THEN** 项目卡片以单列排列
- **AND** 卡片占满内容区宽度

#### Scenario: Odd number of projects

- **GIVEN** 项目数量为奇数（如 5 个）
- **WHEN** 在桌面端 2 列布局下渲染
- **THEN** 最后一行的单个项目卡片靠左对齐，不居中拉伸
- **AND** 网格布局不使用 `place-content: center`

### Requirement: Project card includes screenshot, name, description, and GitHub link

系统 SHALL 为每张项目卡片展示：项目截图（缩略图）、项目名称、项目简介、GitHub 链接。

#### Scenario: Card renders all content elements

- **GIVEN** 项目数据中有 name、description、image、githubUrl
- **WHEN** 卡片渲染
- **THEN** 顶部显示项目截图（16:9 比例）
- **AND** 截图下方显示项目名称
- **AND** 名称下方显示项目简介
- **AND** 底部显示 GitHub 链接按钮
- **AND** GitHub 链接使用 `target="_blank"` + `rel="noopener noreferrer"` 在新标签打开

#### Scenario: Card with missing image

- **GIVEN** 项目的 image 字段为空或图片加载失败
- **WHEN** 卡片渲染
- **THEN** 图片区域显示占位背景色（如 `bg-gray-200 dark:bg-gray-800`）
- **AND** 不显示损坏图标

#### Scenario: Minimum project count

- **GIVEN** 项目数据数组
- **WHEN** 项目展示区渲染
- **THEN** 至少展示 4 个项目卡片

### Requirement: Hover micro-interaction on project cards

系统 SHALL 在鼠标悬浮卡片时触发微交互特效：卡片上浮、阴影增强、边框颜色变化。

#### Scenario: Mouse hovers over card

- **GIVEN** 项目卡片处于默认状态
- **WHEN** 用户鼠标悬浮到卡片上
- **THEN** 卡片向上平移 4px（`-translate-y-1`）
- **AND** 卡片阴影加深
- **AND** 卡片边框颜色从中性色过渡为主题色（purple）
- **AND** 过渡动画在 300ms 内完成（`transition-all duration-300`）

#### Scenario: Mouse leaves card

- **GIVEN** 项目卡片处于悬浮状态
- **WHEN** 用户鼠标移出卡片
- **THEN** 卡片恢复原位、原始阴影、原始边框颜色
- **AND** 过渡动画同样在 300ms 内完成

#### Scenario: Touch device tap

- **GIVEN** 用户在触摸屏设备上访问
- **WHEN** 用户轻触卡片
- **THEN** 卡片不卡在悬浮状态
- **AND** 使用 `hover:` 伪类（由浏览器自动处理 touch/mouse 区分）

### Requirement: Project section supports dark mode

系统 SHALL 根据当前主题模式调整项目展示区的颜色方案。

#### Scenario: Light mode

- **GIVEN** 当前主题为亮色模式
- **WHEN** 项目展示区渲染
- **THEN** 卡片背景为白色
- **AND** 文字颜色为深色（`text-gray-900`）
- **AND** 卡片边框为浅灰色

#### Scenario: Dark mode

- **GIVEN** 当前主题为暗色模式
- **WHEN** 项目展示区渲染
- **THEN** 卡片背景为深色（`bg-gray-900`）
- **AND** 文字颜色为浅色（`text-gray-100`）
- **AND** 卡片边框为深灰色（`border-gray-800`）
- **AND** GitHub 链接按钮在暗色下有足够的对比度

#### Scenario: Theme switches while project section is visible

- **GIVEN** 项目展示区在视口中可见
- **WHEN** 用户通过 ThemeToggle 切换主题
- **THEN** 所有卡片颜色立即跟随主题更新，无延迟

### Requirement: Project images use lazy loading

系统 SHALL 对项目截图使用浏览器原生懒加载，不阻塞首屏渲染。

#### Scenario: Projects below fold

- **GIVEN** 项目展示区在视口之外（折叠线以下）
- **WHEN** 页面首次加载
- **THEN** 项目截图不立即加载
- **AND** 用户滚动到项目区域时开始加载图片

#### Scenario: Image loads successfully

- **GIVEN** 用户滚动触发图片加载
- **WHEN** 图片加载完成
- **THEN** 图片平滑显示（`opacity` 过渡或浏览器默认渲染）
