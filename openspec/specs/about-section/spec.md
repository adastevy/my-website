## ADDED Requirements

### Requirement: About section renders below Hero and above Projects

系统 SHALL 将「关于我」区域放置在 Hero Section 下方、ProjectSection 上方，使用 `id="about"` 作为锚点标识。

#### Scenario: About section position in page flow

- **GIVEN** 用户访问网站首页
- **WHEN** 页面加载完成
- **THEN** Hero Section 下方显示「关于我」区域
- **AND** 「关于我」区域下方显示 ProjectSection
- **AND** section 元素具有 `id="about"` 属性

#### Scenario: About section has scroll margin

- **GIVEN** 导航栏固定在视口顶部（h-16）
- **WHEN** 通过锚点跳转到 `#about`
- **THEN** section 顶部不被导航栏遮挡
- **AND** 使用 `scroll-mt-16` 偏移与导航栏高度匹配

### Requirement: Photo and bio display in a two-column layout on desktop

系统 SHALL 在桌面端以左右双栏布局展示照片和个人简介，移动端上下堆叠。

#### Scenario: Desktop layout (>=768px)

- **GIVEN** 用户在桌面端访问
- **WHEN** About section 渲染
- **THEN** 左侧显示个人照片
- **AND** 右侧显示 3 段个人简介文字
- **AND** 照片和文字垂直居中对齐

#### Scenario: Mobile layout (<768px)

- **GIVEN** 用户在移动端访问
- **WHEN** About section 渲染
- **THEN** 照片在上方居中显示
- **AND** 简介文字在照片下方
- **AND** 内容不超出视口宽度

### Requirement: Photo is circular and has lazy loading

系统 SHALL 以圆形裁剪展示个人照片，并使用浏览器原生懒加载。

#### Scenario: Photo renders correctly

- **GIVEN** 照片文件存在于指定路径
- **WHEN** About section 渲染
- **THEN** 照片以圆形（`rounded-full`）展示
- **AND** 照片使用 `loading="lazy"` 属性
- **AND** 照片具有合适的 `alt` 描述（如「个人照片」）

#### Scenario: Photo fails to load

- **GIVEN** 照片文件不存在或加载失败
- **WHEN** About section 渲染
- **THEN** 照片区域显示占位圆形容器
- **AND** 占位区域显示用户姓名首字或通用头像占位符
- **AND** 不显示浏览器默认的损坏图标

### Requirement: Bio displays three paragraphs of text

系统 SHALL 在右侧展示 3 段个人简介文字，段落间距清晰。

#### Scenario: Bio paragraphs render

- **GIVEN** About section 已渲染
- **WHEN** 用户查看右侧简介区域
- **THEN** 显示 3 段简介文字
- **AND** 段落之间有视觉间距（`space-y-4`）
- **AND** 文字颜色适配当前主题模式

#### Scenario: Long text wrapping

- **GIVEN** 某段简介文字超过一行
- **WHEN** 在窄屏或移动端渲染
- **THEN** 文字自动换行，不溢出容器
- **AND** 不出现横向滚动条

### Requirement: Brand tags display below the bio

系统 SHALL 在简介下方展示品牌标签，至少包含「赋范空间」。

#### Scenario: Brand tags render

- **GIVEN** About section 已渲染
- **WHEN** 用户滚动到简介区域底部
- **THEN** 显示品牌标签列表
- **AND** 至少包含「赋范空间」标签
- **AND** 标签之间有小间距（`gap-2`）
- **AND** 标签使用与项目卡片标签一致的视觉风格

#### Scenario: Brand tags wrap on narrow screen

- **GIVEN** 标签数量较多或屏幕宽度较小
- **WHEN** 标签行超出容器宽度
- **THEN** 标签自动换行（`flex-wrap`）
- **AND** 不出现横向滚动条

### Requirement: About section supports dark mode

系统 SHALL 根据当前主题模式调整 About section 的颜色方案。

#### Scenario: Light mode

- **GIVEN** 当前主题为亮色模式
- **WHEN** About section 渲染
- **THEN** 文字为深色系
- **AND** 背景为浅色系
- **AND** 照片边框为淡紫色

#### Scenario: Dark mode

- **GIVEN** 当前主题为暗色模式
- **WHEN** About section 渲染
- **THEN** 文字为浅色系
- **AND** 背景为深色系
- **AND** 照片边框为紫色
- **AND** 所有内容有足够对比度可清晰阅读
