## Why

当前网站展示了首屏 Hero 和项目作品，但缺少个人背景介绍。访问者无法快速了解作者的专业经历、技能领域和个人风格。「关于我」区域填补这一空白，让品牌形象更立体。

## What Changes

- 新增 `AboutSection` 组件，渲染在 Hero Section 下方、ProjectSection 上方，使用 `id="about"`
- 左右双栏布局（桌面端）：左侧放置个人照片，右侧展示 3 段个人简介文字
- 移动端上下布局：照片在上方居中，简介文字在下方
- 照片使用 `loading="lazy"` + 圆形裁剪（`rounded-full`）展示
- 简介下方展示「赋范空间」品牌标签组

## Capabilities

### New Capabilities

- `about-section`: 关于我展示区，包含左右双栏布局（照片 + 简介）、品牌标签展示

### Modified Capabilities

<!-- 无 -->

## Impact

- 新增 `src/components/AboutSection/AboutSection.tsx`
- 修改 `src/App.tsx`：在 Hero 和 ProjectSection 之间插入 `<AboutSection />`
- 修改 `src/constants.ts`：新增 `SECTION_IDS.about`
- 照片放置于 `public/images/about/` 目录
- 不影响 Hero、ProjectSection、Navbar、ThemeToggle 现有行为

## Out of Scope

- 不做联系我表单
- 不做 Navbar 导航链接变更（暂不添加「关于我」链接）
- 不做照片轮播或多图切换
- 不做简介文字的动画/打字效果
- 不做社交媒体链接
