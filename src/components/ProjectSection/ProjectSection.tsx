import ProjectCard from './ProjectCard'

const projects: Array<{ name: string; description: string; image: string; githubUrl: string; tags: string[] }> = [];

export default function ProjectSection() {
  return (
    <section id="projects" className="scroll-mt-16 py-20 px-4">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white">
          我的项目
        </h2>
        <p className="mt-3 text-center text-gray-600 dark:text-gray-400">
          近期完成的技术项目与开源作品
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
