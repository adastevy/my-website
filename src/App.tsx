import { useTheme } from './hooks/useTheme'
import Navbar from './components/Navbar/Navbar'
import ThemeToggle from './components/ThemeToggle/ThemeToggle'
import Hero from './components/Hero/Hero'
import ProjectSection from './components/ProjectSection/ProjectSection'
import { SECTION_IDS } from './constants'

function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <section id={SECTION_IDS.home} className="scroll-mt-16">
          <Hero theme={theme} />
        </section>
        <ProjectSection />
        <section id={SECTION_IDS.contact} className="scroll-mt-16 min-h-screen" />
      </main>
    </>
  )
}

export default App
