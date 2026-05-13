## Why

当前网站只有 Hero Section 和主题切换，缺少页面导航能力。用户访问后无法快速了解网站有哪些内容区域，也无法便捷跳转到目标板块。需要添加一个固定在顶部的导航栏，让访问者一目了然地看到网站结构并平滑跳转。

## What Changes

- 新增固定在页面顶部的导航栏组件（Navbar），始终可见
- 左侧展示个人 Logo 或名字（文字形式，暂不引入图片 logo）
- 右侧展示三个导航链接：首页、项目、联系我
- 点击导航链接时平滑滚动到对应 section（通过 section 的 `id` 锚点定位）
- 滚动时导航栏添加背景模糊效果（backdrop-blur），滚动回顶部时恢复透明
- 移动端适配：窄屏时将右侧链接收起为汉堡菜单

## Capabilities

### New Capabilities

- `navigation-bar`: 顶部固定导航栏，包含品牌标识和页面内导航链接，支持滚动时背景模糊、移动端汉堡菜单、平滑锚点跳转

### Modified Capabilities

<!-- 无需修改现有 spec -->

## Impact

- 新增 `src/components/Navbar/Navbar.tsx` 组件（含移动端菜单子组件）
- 修改 `src/App.tsx`，在布局中引入 Navbar，确保各 section 有对应 `id` 属性
- 不影响现有 Hero、ParticleBackground、ThemeToggle 组件的行为
- 不引入新的第三方依赖，使用浏览器原生 `scrollIntoView` API

## Out of Scope

- 不做搜索功能
- 不做多级下拉菜单
- 不做用户登录和注册
- 不引入图片 logo（左侧使用纯文本名字）
- 不做导航高亮跟随滚动位置（active section 检测）
