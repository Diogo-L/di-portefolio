const words = ['Diogo Lourenço', 'Dí']
let wordIndex = 0
let isRevealed = false
let isCursorVisible = false
let isErasing = false

const typedText = document.querySelector('.typed-text')
const cursor = document.querySelector('.cursor')
const navLinks = document.querySelectorAll('.nav a')
const topbar = document.querySelector('.topbar')
const scrollTopButton = document.querySelector('.scroll-top')

function updateHero() {
  const currentWord = words[wordIndex]
  const isScriptWord = currentWord === 'Dí'

  typedText.textContent = currentWord
  typedText.classList.toggle('script-word', isScriptWord)
  typedText.classList.toggle('revealed', isRevealed)
  typedText.classList.toggle('erasing', isErasing)
  typedText.style.setProperty('--reveal', isRevealed ? '100%' : '0%')

  const shouldCursorBeVisible = isCursorVisible && !isScriptWord
  cursor.classList.toggle('visible', shouldCursorBeVisible)
  cursor.classList.toggle('hidden', !shouldCursorBeVisible)
  cursor.classList.toggle('revealed', isRevealed)
  cursor.classList.toggle('erasing', isErasing)
  cursor.classList.toggle('script-word', isScriptWord)
  cursor.style.setProperty('--reveal', isRevealed ? '100%' : '0%')
}

function animateCurrentWord() {
  const currentWord = words[wordIndex]
  const isScriptWord = currentWord === 'Dí'

  isRevealed = false
  isCursorVisible = false
  isErasing = false
  updateHero()

  if (isScriptWord) {
    setTimeout(() => {
      isRevealed = true
      updateHero()
    }, 40)

    setTimeout(() => {
      isErasing = true
      updateHero()
    }, 1100)

    setTimeout(() => {
      isErasing = false
      isRevealed = false
      isCursorVisible = false
      updateHero()
    }, 2050)

    setTimeout(() => {
      wordIndex = (wordIndex + 1) % words.length
      animateCurrentWord()
    }, 2600)

    return
  }

  setTimeout(() => {
    isRevealed = true
    isCursorVisible = true
    updateHero()
  }, 80)

  setTimeout(() => {
    isErasing = true
    updateHero()
  }, 1800)

  setTimeout(() => {
    isErasing = false
    isRevealed = false
    isCursorVisible = false
    updateHero()
  }, 2550)

  setTimeout(() => {
    wordIndex = (wordIndex + 1) % words.length
    animateCurrentWord()
  }, 3100)
}

function updateActiveSection() {
  const heroSection = document.getElementById('home')
  const heroBottom = heroSection.offsetTop + heroSection.offsetHeight
  const shouldShowNav = window.scrollY > heroBottom * 0.3

  topbar.classList.toggle('visible', shouldShowNav)
  topbar.classList.toggle('hidden', !shouldShowNav)
  scrollTopButton.classList.toggle('visible', shouldShowNav)

  const sections = [...document.querySelectorAll('section[id]')]
  let activeSection = 'about'

  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= window.innerHeight * 0.4) {
      activeSection = section.id
    }
  })

  navLinks.forEach((link) => {
    const targetId = link.getAttribute('href').replace('#', '')
    const isActive = targetId === activeSection
    link.classList.toggle('active', isActive)

    if (isActive) {
      link.setAttribute('aria-current', 'page')
    } else {
      link.removeAttribute('aria-current')
    }
  })
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

document.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.replace('#', '')
  const validHashes = ['about', 'projects', 'contact']

  if (validHashes.includes(hash)) {
    const section = document.getElementById(hash)
    if (section) {
      section.scrollIntoView({ behavior: 'auto' })
    }
  }

  updateHero()
  animateCurrentWord()
  updateActiveSection()

  window.addEventListener('scroll', updateActiveSection)
  window.addEventListener('hashchange', updateActiveSection)

  scrollTopButton.addEventListener('click', scrollToTop)
})
