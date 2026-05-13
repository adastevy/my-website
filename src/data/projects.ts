export interface Project {
  name: string
  description: string
  image: string
  githubUrl: string
  tags?: string[]
}

export const projects: Project[] = [
  {
    name: '智能日程管家',
    description: '基于 AI 的任务调度与日历管理应用，支持自然语言输入创建日程，自动识别冲突并推荐最优时间安排。',
    image: 'https://placehold.co/600x400/7c3aed/ffffff?text=Smart+Schedule',
    githubUrl: 'https://github.com/zhangsan/smart-schedule',
    tags: ['React', 'TypeScript', 'OpenAI API', 'PostgreSQL'],
  },
  {
    name: '粒子动画引擎',
    description: '轻量级 Canvas 粒子动画库，支持自定义粒子行为、连线规则和交互响应，可用于网页背景和可视化效果。',
    image: 'https://placehold.co/600x400/2563eb/ffffff?text=Particle+Engine',
    githubUrl: 'https://github.com/zhangsan/particle-engine',
    tags: ['TypeScript', 'Canvas API', 'WebGL'],
  },
  {
    name: '微服务网关',
    description: '高性能 API 网关，支持路由分发、限流熔断、JWT 鉴权和请求日志聚合，适用于微服务架构的流量入口。',
    image: 'https://placehold.co/600x400/059669/ffffff?text=API+Gateway',
    githubUrl: 'https://github.com/zhangsan/micro-gateway',
    tags: ['Go', 'gRPC', 'Redis', 'Docker'],
  },
  {
    name: 'Markdown 笔记应用',
    description: '离线优先的 Markdown 编辑器，支持实时预览、标签管理、全文搜索和跨设备同步，基于 CRDT 实现冲突解决。',
    image: 'https://placehold.co/600x400/dc2626/ffffff?text=Markdown+Notes',
    githubUrl: 'https://github.com/zhangsan/md-notes',
    tags: ['React', 'Electron', 'IndexedDB', 'CRDT'],
  },
]
