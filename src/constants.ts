export const SECTION_IDS = {
  home: 'home',
  about: 'about',
  projects: 'projects',
  contact: 'contact',
} as const

export const NAV_ITEMS = [
  { label: '首页', sectionId: SECTION_IDS.home },
  { label: '项目', sectionId: SECTION_IDS.projects },
  { label: '联系我', sectionId: SECTION_IDS.contact },
] as const
