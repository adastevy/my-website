import { useState } from 'react'

const ABOUT_PARAGRAPHS = [
  '我是一名全栈开发工程师，拥有 5 年 Web 开发经验，专注于 React、TypeScript 和 Go 技术栈。热衷于构建高性能、可维护的软件系统，追求代码质量与用户体验的平衡。',
  '在职业生涯中，我参与过从零到一的创业项目，也在大型团队中主导过核心模块的架构设计。擅长前端性能优化、微服务架构设计和 API 网关开发。',
  '工作之外，我是开源社区的积极贡献者，维护多个个人项目。我相信技术的价值在于解决实际问题，持续学习和分享是我的职业信条。',
]

const BRAND_TAGS = ['lesscode']

export default function AboutSection() {
  const [imgError, setImgError] = useState(false)

  return (
    <section id="about" className="scroll-mt-16 py-20 px-4">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white">
          关于我
        </h2>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Photo */}
          <div className="flex justify-center">
            {!imgError ? (
              <img
                src="/images/about/photo.jpg"
                alt="个人照片"
                loading="lazy"
                onError={() => setImgError(true)}
                className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover border-2 border-purple-500/30 dark:border-purple-500/50"
              />
            ) : (
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-gray-200 dark:bg-gray-800 border-2 border-purple-500/30 dark:border-purple-500/50 flex items-center justify-center text-gray-400 dark:text-gray-600 text-5xl font-bold">
                张
              </div>
            )}
          </div>

          {/* Bio */}
          <div>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              {ABOUT_PARAGRAPHS.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Brand tags */}
            <div className="mt-6 flex flex-wrap gap-2">
              {BRAND_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
