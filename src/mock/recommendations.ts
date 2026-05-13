export type Priority = 'high' | 'medium' | 'low';

export interface Recommendation {
  id: string;
  title: string;
  tag: string;
  estimatedHours: number;
  priority: Priority;
}

export const mockRecommendations: Recommendation[] = [
  { id: '1', title: 'TypeScript 高级类型系统', tag: 'TypeScript', estimatedHours: 2, priority: 'high' },
  { id: '2', title: '系统设计面试精讲', tag: '系统设计', estimatedHours: 3, priority: 'high' },
  { id: '3', title: 'React 19 新特性实战', tag: 'React', estimatedHours: 1.5, priority: 'medium' },
  { id: '4', title: '算法与数据结构进阶', tag: '算法', estimatedHours: 4, priority: 'medium' },
  { id: '5', title: 'CSS 动画与性能优化', tag: 'CSS', estimatedHours: 1, priority: 'low' },
];
