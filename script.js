const words = ['Diogo Lourenço']
let wordIndex = 0
let displayedText = ''
let isDeleting = false
let typingTimer = null

const typedText = document.querySelector('.typed-text')
const cursor = document.querySelector('.cursor')
const navLinks = document.querySelectorAll('.nav a')
const topbar = document.querySelector('.topbar')
const scrollTopButton = document.querySelector('.scroll-top')

function updateHero() {
  const currentWord = words[wordIndex]

  typedText.textContent = displayedText
  typedText.classList.toggle('hidden', displayedText.length === 0)
  typedText.classList.toggle('revealed', displayedText.length === currentWord.length)

  const textWidth = typedText.scrollWidth || typedText.getBoundingClientRect().width || 0
  cursor.style.left = `${Math.max(textWidth + 10, 0)}px`
  cursor.classList.toggle('visible', true)
  cursor.classList.toggle('hidden', false)
}

function animateCurrentWord() {
  clearTimeout(typingTimer)

  const currentWord = words[wordIndex]

  if (isDeleting) {
    displayedText = currentWord.slice(0, Math.max(0, displayedText.length - 1))
    updateHero()

    if (displayedText.length > 0) {
      typingTimer = setTimeout(animateCurrentWord, 55)
      return
    }

    isDeleting = false
    wordIndex = (wordIndex + 1) % words.length
    typingTimer = setTimeout(animateCurrentWord, 220)
    return
  }

  displayedText = currentWord.slice(0, displayedText.length + 1)
  updateHero()

  if (displayedText.length < currentWord.length) {
    typingTimer = setTimeout(animateCurrentWord, 90)
    return
  }

  isDeleting = true
  typingTimer = setTimeout(animateCurrentWord, 1400)
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
