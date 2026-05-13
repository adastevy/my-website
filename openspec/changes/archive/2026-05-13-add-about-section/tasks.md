## 1. 资源准备

- [x] 1.1 创建 `src/components/AboutSection/` 目录，放置占位照片到 `public/images/about/photo.jpg`

## 2. AboutSection 组件

- [x] 2.1 创建 `src/components/AboutSection/AboutSection.tsx`，使用 CSS Grid 布局（`grid-cols-1 md:grid-cols-2`），左侧照片右侧简介
- [x] 2.2 实现圆形照片展示：`rounded-full` + `loading="lazy"` + `onError` 占位回退
- [x] 2.3 渲染 3 段个人简介文字，段落间距 `space-y-4`
- [x] 2.4 在简介下方渲染品牌标签（至少含「赋范空间」），使用 `flex flex-wrap gap-2`
- [x] 2.5 添加暗色模式样式：文字、背景、照片边框的 `dark:` 变体

## 3. App 集成

- [x] 3.1 在 `src/constants.ts` 中添加 `SECTION_IDS.about`
- [x] 3.2 修改 `src/App.tsx`：在 Hero 和 ProjectSection 之间插入 `<AboutSection />`，section 使用 `id="about"` 和 `scroll-mt-16`

## 4. 验证

- [x] 4.1 验证桌面端布局：左右双栏、照片圆形、3段文字、品牌标签
- [x] 4.2 验证移动端布局：上下堆叠、内容不溢出
- [x] 4.3 验证暗色模式：亮/暗切换后颜色即时更新
