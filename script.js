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
const projectGrid = document.querySelector('#project-grid')
const projectSearch = document.querySelector('#project-search')
const projectSort = document.querySelector('#project-sort')
const projectDateFrom = document.querySelector('#project-date-from')
const projectDateTo = document.querySelector('#project-date-to')
const projectResults = document.querySelector('#project-results')
const projectEmpty = document.querySelector('#project-empty')
const projectDialog = document.querySelector('#project-dialog')
let projectReturnFocus = null

const projects = [
  {
    id: 'project-white',
    title: 'Project White',
    category: 'games',
    categoryLabel: 'Game',
    shortDescription: 'A single-player narrative FPS about a test subject trapped inside a secret corporation.',
    description:
      'Project White is a single-player narrative FPS set inside WHITE Corp, a secret corporation that tests experimental substances on human subjects. The player takes the role of Subject 53, whose test goes wrong, and must explore the facility and survive its guards to uncover what happened. WHITE substances also shape combat, granting temporary abilities such as immunity to enemy fire and increased damage. The game features a prologue, the first chapter, a tutorial, and a time-trial challenge.',
    technologies: ['Unity3D'],
    features: [
      'Exploration of WHITE Corp’s facilities as Subject 53.',
      'WHITE substances grant temporary abilities that support survival in combat.',
      'The game includes a prologue, the first chapter, a tutorial, and a time-trial challenge.',
      'The story unfolds as the player faces WHITE Corp’s guards.',
    ],
    date: null,
    cover: 'white',
    thumbnail: './public/projects/project-white-thumbnail.webp',
    logo: './public/projects/project-white-logo.png',
    details: [
      { label: 'Version', value: '1.0.0' },
      { label: 'Price', value: 'Free' },
      { label: 'Size', value: '477 MB' },
    ],
    media: {
      type: 'youtube',
      videoId: 'YVc5H6ly-HI',
    },
    screenshots: [
      './public/projects/project-white-screenshot-1.webp',
      './public/projects/project-white-screenshot-2.webp',
      './public/projects/project-white-screenshot-3.webp',
      './public/projects/project-white-screenshot-4.webp',
    ],
    links: [
      { label: 'Play on Game Jolt', url: 'https://gamejolt.com/games/project-white/631626' },
      { label: 'Watch the trailer on YouTube', url: 'https://www.youtube.com/watch?v=YVc5H6ly-HI' },
      { label: 'Official website', url: 'https://diogo-l.github.io/projectwhite/' },
    ],
  },
  {
    id: 'forklift-simulator',
    title: 'Forklift Simulator 2021: DL Edition',
    category: 'games',
    categoryLabel: 'Game · Simulation',
    shortDescription: 'A forklift simulation where players deliver color-coded crates and earn Forkcoins to customize their vehicles.',
    description:
      'Forklift Simulator 2021: DL Edition is a Unity simulation in which the player drives a forklift around a warehouse. Each six-minute round challenges the player to deliver crates to the correct zones: crate colors and rarities determine where each one belongs and how much XP and how many Forkcoins a correct delivery earns. Day and night maps offer different settings, while Forkcoins unlock forklift cosmetics.',
    technologies: ['Unity', 'Simulation'],
    features: [
      'The player delivers common crates to any zone and rare crates to their matching color-coded zones.',
      'Six-minute rounds take place on day or night maps.',
      'Correct deliveries earn the player XP and Forkcoins.',
      'Forkcoins unlock cosmetics that the player can equip on the forklift.',
    ],
    date: null,
    cover: 'forklift',
    thumbnail: './public/projects/forklift-simulator-thumbnail.webp',
    details: [
      { label: 'Version', value: '0.1.0' },
      { label: 'Price', value: 'Free' },
      { label: 'Size', value: '77 MB' },
    ],
    links: [
      { label: 'View and download on Game Jolt', url: 'https://gamejolt.com/games/forkliftsim21dl/608478' },
    ],
  },
  {
    id: 'ptours-app',
    title: 'PRtours App',
    category: 'apps',
    categoryLabel: 'App',
    shortDescription: 'A Google AppSheet app for managing transfer services and tracking driver assignments.',
    description:
      'PRtours App is a Google AppSheet application for managing transfer services, from their creation and driver assignment through to service tracking. Drivers can accept or decline assigned services, navigate to pickup and drop-off locations, and update each service’s status through to completion. A dashboard, calendar, and notifications help administrators monitor operations.',
    technologies: ['Google AppSheet'],
    features: [
      'Service, driver, and vehicle management in one app.',
      'Drivers update service statuses from acceptance through completion.',
      'Google Maps navigation to pickup and drop-off locations.',
      'An administrator dashboard with operational notifications and a calendar.',
    ],
    date: null,
    cover: 'ptours',
    galleryLayout: 'app',
    screenshots: [
      {
        src: './public/projects/prtours-desktop.jpg',
        alt: 'PRtours desktop app showing the admin dashboard and calendar',
        label: 'Desktop app',
        layout: 'desktop',
      },
      {
        src: './public/projects/prtours-mobile.jpg',
        alt: 'PRtours mobile app showing driver notifications',
        label: 'Mobile app',
        layout: 'mobile',
      },
    ],
  },
]

const categoryLabels = {
  videos: 'Videos',
  games: 'Games',
  apps: 'Apps',
}

function createProjectArt(project, large = false) {
  const art = document.createElement('div')
  art.className = `project-art project-art--${project.cover}${large ? ' project-art--large' : ''}`

  if (large && project.media?.type === 'youtube') {
    if (window.location.protocol === 'file:') {
      const thumbnail = document.createElement('img')
      thumbnail.className = 'project-media'
      thumbnail.src = project.thumbnail
      thumbnail.alt = `Cover image for ${project.title}; use the link below to watch the trailer on YouTube`
      art.append(thumbnail)
      return art
    }

    const player = document.createElement('iframe')
    player.className = 'project-media'
    player.src = `https://www.youtube.com/embed/${encodeURIComponent(project.media.videoId)}?rel=0&playsinline=1`
    player.title = `${project.title} trailer on YouTube`
    player.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
    player.allowFullscreen = true
    player.referrerPolicy = 'origin'
    art.append(player)
    return art
  }

  if (project.cover === 'ptours') {
    art.setAttribute('role', 'img')
    art.setAttribute('aria-label', 'PRtours app shown on desktop and mobile, alongside the PRtours logo')

    const devices = document.createElement('span')
    devices.className = 'prtours-devices'
    devices.setAttribute('aria-hidden', 'true')

    const desktopScreen = document.createElement('span')
    desktopScreen.className = 'prtours-screen prtours-screen--desktop'
    const desktopScreenshot = document.createElement('img')
    desktopScreenshot.src = './public/projects/prtours-desktop.jpg'
    desktopScreenshot.alt = ''
    desktopScreen.append(desktopScreenshot)

    const mobileScreen = document.createElement('span')
    mobileScreen.className = 'prtours-screen prtours-screen--mobile'
    const mobileScreenshot = document.createElement('img')
    mobileScreenshot.src = './public/projects/prtours-mobile.jpg'
    mobileScreenshot.alt = ''
    mobileScreen.append(mobileScreenshot)

    const deviceTemplate = document.createElement('img')
    deviceTemplate.className = 'prtours-device-template'
    deviceTemplate.src = './public/projects/prtours-device-template.png'
    deviceTemplate.alt = ''
    deviceTemplate.setAttribute('aria-hidden', 'true')

    devices.append(desktopScreen, mobileScreen, deviceTemplate)

    const logo = document.createElement('img')
    logo.className = 'prtours-showcase-logo'
    logo.src = './public/projects/prtours-logo.png'
    logo.alt = ''

    art.append(devices, logo)
    return art
  }

  if (project.thumbnail || project.media?.type === 'image') {
    const image = document.createElement('img')
    image.className = 'project-media'
    image.src = project.thumbnail || project.media.src
    image.alt = project.media?.alt || `Image of ${project.title}`
    art.append(image)
    return art
  }

  art.setAttribute('role', 'img')
  const artDescription = project.cover === 'forklift'
    ? 'Illustration of a forklift carrying crates'
    : project.logo
      ? `Cover image for ${project.title} featuring its official logo`
      : `Illustration for ${project.title}`
  art.setAttribute('aria-label', artDescription)

  if (project.cover === 'forklift') {
    const illustration = document.createElement('span')
    illustration.className = 'forklift-scene'
    illustration.setAttribute('aria-hidden', 'true')
    illustration.innerHTML = `
      <svg viewBox="0 0 520 230" role="presentation">
        <path class="forklift-crate" d="M321 50h58v58h-58zM382 50h58v58h-58zM352 111h58v58h-58z" />
        <path class="forklift-crate-mark" d="M350 50v58m61-58v58m-30 3v56m-30-30h58M321 79h58m3 0h58m-58 61h58" />
        <path class="forklift-frame" d="M105 41v142m-13-1h29m-27-10h35m-24-11h25m-25-11h25m-25-11h25m-25-11h25m-25-11h25m-25-11h25m-25-11h25m-25-11h25" />
        <path class="forklift-body" d="M123 166h89l26-58h74l34 58h45v25H123z" />
        <path class="forklift-cabin" d="m244 119-20 47h68v-47z" />
        <path class="forklift-fork" d="M89 184h236v8H89z" />
        <circle class="forklift-wheel" cx="178" cy="188" r="20" />
        <circle class="forklift-wheel" cx="337" cy="188" r="20" />
        <circle class="forklift-wheel-center" cx="178" cy="188" r="7" />
        <circle class="forklift-wheel-center" cx="337" cy="188" r="7" />
      </svg>
    `
    const label = document.createElement('span')
    label.className = 'forklift-scene-label'
    label.textContent = 'STACK · DRIVE · DELIVER'
    art.append(illustration, label)
    return art
  }

  if (project.logo) {
    const logo = document.createElement('img')
    logo.className = 'project-art-logo'
    logo.src = project.logo
    logo.alt = ''
    logo.setAttribute('aria-hidden', 'true')

    const caption = document.createElement('span')
    caption.className = 'project-art-caption'
    caption.textContent = 'Narrative game · Unity3D'
    art.append(logo, caption)
    return art
  }

  const mark = document.createElement('span')
  mark.className = 'project-art-mark'
  mark.textContent = project.cover === 'ptours' ? 'PT' : 'CMS'

  const caption = document.createElement('span')
  caption.className = 'project-art-caption'
  caption.textContent = project.title

  art.append(mark, caption)
  return art
}

function createProjectCard(project, index) {
  const card = document.createElement('button')
  card.type = 'button'
  card.className = 'project-card'
  card.dataset.projectId = project.id
  card.setAttribute('aria-haspopup', 'dialog')

  const art = createProjectArt(project)
  const content = document.createElement('span')
  content.className = 'project-card-content'

  const category = document.createElement('span')
  category.className = 'project-card-category'
  category.textContent = categoryLabels[project.category]

  const title = document.createElement('span')
  title.className = 'project-card-title'
  title.textContent = project.title

  const description = document.createElement('span')
  description.className = 'project-card-description'
  description.textContent = project.shortDescription

  const tags = document.createElement('span')
  tags.className = 'project-card-tags'
  project.technologies.forEach((technology) => {
    const tag = document.createElement('span')
    tag.className = 'project-tag'
    tag.textContent = technology
    tags.append(tag)
  })

  const indexLabel = document.createElement('span')
  indexLabel.className = 'project-card-index'
  indexLabel.textContent = String(index + 1).padStart(2, '0')
  indexLabel.setAttribute('aria-hidden', 'true')

  content.append(category, title, description, tags)
  card.append(art, content, indexLabel)
  card.addEventListener('click', () => openProject(project, card))
  return card
}

function getVisibleProjects() {
  const query = projectSearch.value.trim().toLocaleLowerCase('en')
  const selectedCategories = new Set(
    [...document.querySelectorAll('input[name="project-category"]:checked')].map((input) => input.value),
  )
  const fromDate = projectDateFrom.value
  const toDate = projectDateTo.value

  const visibleProjects = projects.filter((project) => {
    const matchesCategory = selectedCategories.has(project.category)
    const searchableText = [
      project.title,
      project.categoryLabel,
      project.shortDescription,
      project.description,
      ...project.technologies,
    ]
      .join(' ')
      .toLocaleLowerCase('en')
    const matchesQuery = searchableText.includes(query)
    const matchesFromDate = !fromDate || (project.date && project.date >= fromDate)
    const matchesToDate = !toDate || (project.date && project.date <= toDate)

    return matchesCategory && matchesQuery && matchesFromDate && matchesToDate
  })

  const featuredOrder = new Map(projects.map((project, index) => [project.id, index]))
  const sortBy = projectSort.value

  visibleProjects.sort((first, second) => {
    if (sortBy === 'az' || sortBy === 'za') {
      const direction = sortBy === 'az' ? 1 : -1
      return first.title.localeCompare(second.title, 'en') * direction
    }

    if (sortBy === 'newest' || sortBy === 'oldest') {
      const direction = sortBy === 'newest' ? -1 : 1
      if (first.date && second.date) {
        return first.date.localeCompare(second.date) * direction
      }
      if (first.date) return -1
      if (second.date) return 1
    }

    return featuredOrder.get(first.id) - featuredOrder.get(second.id)
  })

  return visibleProjects
}

function renderProjects() {
  const visibleProjects = getVisibleProjects()
  projectGrid.replaceChildren(...visibleProjects.map(createProjectCard))
  projectEmpty.hidden = visibleProjects.length > 0
  projectResults.textContent = `${visibleProjects.length} ${visibleProjects.length === 1 ? 'project found' : 'projects found'}`
}

function openProject(project, card) {
  const dialogArt = document.querySelector('#dialog-art')
  const dialogVideoFallback = document.querySelector('#dialog-video-fallback')
  const dialogCategory = document.querySelector('#dialog-category')
  const dialogTitle = document.querySelector('#dialog-title')
  const dialogTags = document.querySelector('#dialog-tags')
  const dialogDescription = document.querySelector('#dialog-description')
  const dialogFeatures = document.querySelector('#dialog-features')
  const dialogLogo = document.querySelector('#dialog-logo')
  const dialogDetailsSection = document.querySelector('#dialog-details-section')
  const dialogDetails = document.querySelector('#dialog-details')
  const dialogGallerySection = document.querySelector('#dialog-gallery-section')
  const dialogGallery = document.querySelector('#dialog-gallery')
  const dialogLinksSection = document.querySelector('#dialog-links-section')
  const dialogLinks = document.querySelector('#dialog-links')

  dialogArt.replaceChildren(createProjectArt(project, true))
  const youtubeVideoId = project.media?.type === 'youtube' ? project.media.videoId : null
  dialogVideoFallback.hidden = !youtubeVideoId
  if (youtubeVideoId) {
    dialogVideoFallback.href = `https://www.youtube.com/watch?v=${encodeURIComponent(youtubeVideoId)}`
    dialogVideoFallback.textContent = window.location.protocol === 'file:'
      ? 'Watch the trailer on YouTube ↗'
      : 'Having trouble playing it? Watch the trailer on YouTube ↗'
  } else {
    dialogVideoFallback.removeAttribute('href')
  }
  dialogLogo.hidden = !project.logo
  if (project.logo) {
    dialogLogo.src = project.logo
    dialogLogo.alt = `${project.title} logo`
  } else {
    dialogLogo.removeAttribute('src')
    dialogLogo.alt = ''
  }
  dialogCategory.textContent = project.categoryLabel
  dialogTitle.textContent = project.title
  dialogDescription.textContent = project.description
  dialogTags.replaceChildren(
    ...project.technologies.map((technology) => {
      const tag = document.createElement('span')
      tag.className = 'project-tag'
      tag.textContent = technology
      return tag
    }),
  )
  dialogFeatures.replaceChildren(
    ...project.features.map((feature) => {
      const item = document.createElement('li')
      item.textContent = feature
      return item
    }),
  )

  const details = project.details || []
  dialogDetailsSection.hidden = details.length === 0
  dialogDetails.replaceChildren(
    ...details.map((detail) => {
      const item = document.createElement('div')
      item.className = 'dialog-detail'
      const label = document.createElement('span')
      label.textContent = detail.label
      const value = document.createElement('strong')
      value.textContent = detail.value
      item.append(label, value)
      return item
    }),
  )

  const screenshots = project.screenshots || []
  dialogGallerySection.hidden = screenshots.length === 0
  dialogGallery.classList.toggle('dialog-gallery--app', project.galleryLayout === 'app')
  dialogGallery.replaceChildren(
    ...screenshots.map((screenshot, index) => {
      const source = typeof screenshot === 'string' ? screenshot : screenshot.src
      const alt = typeof screenshot === 'string'
        ? `Screenshot ${index + 1} of ${project.title}`
        : screenshot.alt

      const link = document.createElement('a')
      link.href = source
      link.target = '_blank'
      link.rel = 'noreferrer'
      link.setAttribute('aria-label', `Open ${alt}`)
      if (typeof screenshot !== 'string' && screenshot.layout) {
        link.classList.add(`dialog-gallery-image--${screenshot.layout}`)
      }

      const image = document.createElement('img')
      image.src = source
      image.alt = alt
      if (project.galleryLayout === 'app' && typeof screenshot !== 'string') {
        const frame = document.createElement('span')
        frame.className = 'dialog-gallery-frame'
        frame.append(image)

        const caption = document.createElement('span')
        caption.className = 'dialog-gallery-caption'
        caption.textContent = screenshot.label
        link.append(frame, caption)
      } else {
        link.append(image)
      }
      return link
    }),
  )

  const links = project.links || []
  dialogLinksSection.hidden = links.length === 0
  dialogLinks.replaceChildren(
    ...links.map((link) => {
      const anchor = document.createElement('a')
      anchor.href = link.url
      anchor.textContent = link.label
      anchor.target = '_blank'
      anchor.rel = 'noreferrer'
      return anchor
    }),
  )

  projectDialog.showModal()
  projectDialog.querySelector('.dialog-close').focus()
  projectReturnFocus = card
}

function closeProjectDialog() {
  projectDialog.close()
}

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
  projectSearch.addEventListener('input', renderProjects)
  projectSort.addEventListener('change', renderProjects)
  projectDateFrom.addEventListener('change', renderProjects)
  projectDateTo.addEventListener('change', renderProjects)
  document.querySelectorAll('input[name="project-category"]').forEach((input) => {
    input.addEventListener('change', renderProjects)
  })
  projectDialog.querySelector('.dialog-close').addEventListener('click', closeProjectDialog)
  projectDialog.addEventListener('click', (event) => {
    if (event.target === projectDialog) closeProjectDialog()
  })
  projectDialog.addEventListener('close', () => {
    projectReturnFocus?.focus()
    projectReturnFocus = null
  })
  projectDialog.addEventListener('cancel', (event) => {
    event.preventDefault()
    closeProjectDialog()
  })
  projectDialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeProjectDialog()
    }
  })
  renderProjects()
})
