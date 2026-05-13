export interface Goal {
  id: string;
  title: string;
  completed: boolean;
}

export const mockGoals: Goal[] = [
  { id: '1', title: '复习 React Hooks 原理', completed: true },
  { id: '2', title: '完成算法练习 3 题', completed: false },
  { id: '3', title: '阅读《系统设计导论》第 5 章', completed: false },
  { id: '4', title: '回顾 TypeScript 高级类型', completed: true },
  { id: '5', title: '整理本周学习笔记', completed: false },
];
