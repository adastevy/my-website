import StudyRecommendations from '../components/Dashboard/StudyRecommendations';

export default function RecommendationsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI 学习建议</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        基于你的学习历史和进度，为你推荐以下课程和知识点
      </p>
      <StudyRecommendations />
    </div>
  );
}
