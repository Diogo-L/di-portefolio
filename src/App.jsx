import { useEffect, useState } from 'react'
import './App.css'

const navItems = [
  { label: 'About me', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

const projectCards = [
  {
    title: 'Project White',
    description:
      'Developed a story-driven first-person shooter (FPS) game using Unity3D as my secondary school final project.',
  },
  {
    title: 'PTours App',
    description:
      'Developed a Google AppSheet low-code application for transfer management, featuring driver assignments, a shared calendar, real-time status tracking, and notifications.',
  },
  {
    title: 'Tech Consultant',
    description:
      'Designed and implemented a CMS using Contentful, defining content types based on Figma designs and supporting mobile app integration.',
  },
]

function App() {
  const words = ['Diogo Lourenço', 'Dí']
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  const [isNavVisible, setIsNavVisible] = useState(false)
  const [activeSection, setActiveSection] = useState(() => {
    const hash = window.location.hash.replace('#', '')
    return navItems.some((item) => item.href === `#${hash}`) ? hash : 'about'
  })

  useEffect(() => {
    const currentWord = words[wordIndex]

    const timer = setTimeout(() => {
      if (!isDeleting && text === currentWord) {
        setIsDeleting(true)
        return
      }

      if (isDeleting && text === '') {
        setIsDeleting(false)
        setWordIndex((prevIndex) => (prevIndex + 1) % words.length)
        return
      }

      setText((previousText) => {
        if (isDeleting) {
          return previousText.slice(0, -1)
        }

        return currentWord.slice(0, previousText.length + 1)
      })
    }, isDeleting ? 80 : 130)

    return () => clearTimeout(timer)
  }, [text, isDeleting, wordIndex])

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('home')
      if (!heroSection) {
        return
      }

      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight
      setIsNavVisible(window.scrollY > heroBottom * 0.3)

      const sections = navItems
        .map((item) => document.getElementById(item.href.replace('#', '')))
        .filter(Boolean)

      let currentSection = 'about'

      for (const section of sections) {
        const rect = section.getBoundingClientRect()
        if (rect.top <= window.innerHeight * 0.4) {
          currentSection = section.id
        }
      }

      setActiveSection(currentSection)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('hashchange', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('hashchange', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="portfolio-shell">
      <header className={`topbar ${isNavVisible ? 'visible' : 'hidden'}`}>
        <div className="topbar-inner">
          <nav className="nav" aria-label="Main navigation">
            {navItems.map((item) => {
              const sectionId = item.href.replace('#', '')
              const isActive = activeSection === sectionId

              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={isActive ? 'active' : ''}
                  onClick={() => setActiveSection(sectionId)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </a>
              )
            })}
          </nav>
        </div>
      </header>

      <main>
        <section id="home" className="section hero-section">
          <div className="hero-copy">
            <p className="eyebrow">Hi, I&apos;m</p>
            <h1 className="typed-line" aria-live="polite">
              <span className="typed-text">{text}</span>
              <span className="cursor" aria-hidden="true" />
            </h1>

            <div className="hero-summary">
              <p>I like to create stuff.</p>
            </div>

            <div className="cta-row">
              <a className="primary-button" href="#projects">
                View projects
              </a>
              <a className="secondary-button" href="#contact">
                Contact me
              </a>
            </div>
          </div>
        </section>

        <section id="about" className="section content-section">
          <div className="section-heading">
            <span className="mini-tag">About me</span>
            <h2>Building thoughtful interfaces with a strong sense of story.</h2>
          </div>

          <div className="about-grid">
            <p>
              I&apos;m a technology professional with experience in consulting environments and a
              strong interest in technology, problem-solving, and continuous learning. I&apos;m
              looking for opportunities to deepen my technical skills and contribute directly
              to the development and improvement of technology solutions.
            </p>

            <div className="stats-grid">
              <div className="stat-card">
                <strong>5+</strong>
                <span>Years in technology and consulting</span>
              </div>
              <div className="stat-card">
                <strong>12</strong>
                <span>Projects across software, data and automation</span>
              </div>
              <div className="stat-card">
                <strong>100%</strong>
                <span>Focused on continuous technical growth</span>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="section content-section">
          <div className="section-heading">
            <span className="mini-tag">Projects</span>
            <h2>Selected work and practical experience in technology.</h2>
          </div>

          <div className="project-grid">
            {projectCards.map((project) => (
              <article className="project-card" key={project.title}>
                <div className="project-preview">
                  <span className="project-index">01</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="section content-section contact-section">
          <div className="section-heading">
            <span className="mini-tag">Contact</span>
            <h2>Let&apos;s bring an idea to life.</h2>
          </div>

          <div className="contact-panel">
            <a href="mailto:diogolourenco2003@gmail.com">diogolourenco2003@gmail.com</a>
            <a
              href="https://www.linkedin.com/in/diogolourenco"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </section>
      </main>

      <button type="button" className={`scroll-top ${isNavVisible ? 'visible' : ''}`} onClick={scrollToTop} aria-label="Back to top">
        ↑
      </button>
    </div>
  )
}

export default App
