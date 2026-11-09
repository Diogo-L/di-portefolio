const navLinks = document.querySelectorAll('.nav a')
const heroTitle = document.querySelector('.hero-title')
const topbar = document.querySelector('.topbar')
const scrollTopButton = document.querySelector('.scroll-top')
const projectGrid = document.querySelector('#project-grid')
const projectSearch = document.querySelector('#project-search')
const projectResults = document.querySelector('#project-results')
const projectEmpty = document.querySelector('#project-empty')
const projectDialog = document.querySelector('#project-dialog')
const heroTitleSlot = document.querySelector('.hero-title-slot')
const aboutSection = document.querySelector('#about')
let projectReturnFocus = null
let revealObserver = null
let heroScrollSequenceEnabled = false
let heroTitleStartY = 0
let heroTitleSlotHeight = 0

const youtubeVideos = [
  { title: 'LPS | Valorant Edit (Blueberry Faygo)', videoId: '-5LDWf3BiEQ', format: 'Long-form video' },
  { title: 'KILLER | Assetto Corsa Cinematic', videoId: 'y7WqDCad2dM', format: 'Long-form video' },
  { title: 'SAD HOURS | Assetto Corsa Cinematic', videoId: 'PA9iLiOIDzk', format: 'Long-form video' },
  {
    title: 'Initial D-Inspired Drift',
    videoId: 'SYDuI7KCmms',
    format: 'YouTube Short',
    thumbnail: './public/projects/initial-d-drift.png',
  },
  {
    title: 'English or Spanish? | Assetto Corsa Drift',
    videoId: 'vB22K4LngU8',
    format: 'YouTube Short',
    thumbnail: './public/projects/english-or-spanish-drift.png',
    thumbnailPosition: 'center 80%',
  },
  {
    title: 'Nissan GT-R R34: High-Speed Traffic Run',
    videoId: 'YODfqGlojLs',
    format: 'YouTube Short',
    thumbnail: './public/projects/nissan-gtr-r34.png',
  },
  {
    title: 'Nissan S14 Drift | 1,000 HP POV',
    videoId: 'MobX6BsAg8k',
    format: 'YouTube Short',
    thumbnail: './public/projects/nissan-s14-drift.png',
  },
]

const instagramVideos = [
  {
    postId: 'DXha-uvjFsx',
    title: 'Harmony Within | Video Edit for @elkia.d.a',
    url: 'https://www.instagram.com/p/DXha-uvjFsx/',
    thumbnailImages: [
      './public/projects/harmony-within-2.png',
      './public/projects/harmony-within-3.png',
    ],
    thumbnailLayout: 'featured',
  },
  {
    postId: 'DXhfEKPDJfL',
    title: 'R&B Beef | Video Edit for @elkia.d.a',
    url: 'https://www.instagram.com/p/DXhfEKPDJfL/',
    thumbnailImages: [
      './public/projects/rnb-beef-award.jpg',
      './public/projects/rnb-beef-food.jpg',
    ],
  },
  {
    postId: 'DXmU00qDBgC',
    title: 'Wonderbeauty | Video Edit for @elkia.d.a',
    url: 'https://www.instagram.com/p/DXmU00qDBgC/',
    thumbnailImages: ['./public/projects/wonderbeauty.png'],
  },
]

function createYoutubeProject({ title, videoId, format, thumbnail, thumbnailPosition }) {
  const isShort = format === 'YouTube Short'

  return {
    id: `youtube-${videoId}`,
    title,
    category: 'videos',
    categoryLabel: 'Video',
    shortDescription: isShort ? 'Assetto Corsa · YouTube Short' : `${format} · DaVinci Resolve`,
    description: isShort
      ? 'An Assetto Corsa short edited in DaVinci Resolve.'
      : `${format} published on YouTube. Edited in DaVinci Resolve, with the thumbnail created in Photoshop.`,
    technologies: isShort ? ['DaVinci Resolve'] : ['DaVinci Resolve', 'Photoshop'],
    features: [
      'Video edited in DaVinci Resolve.',
      ...(isShort ? [] : ['YouTube thumbnail created in Photoshop.']),
      'More videos are available on my YouTube channel.',
    ],
    cover: 'youtube',
    thumbnail: thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    thumbnailFallback: thumbnail ? null : `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    largeThumbnail: isShort ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null,
    thumbnailPosition,
    media: { type: 'youtube', videoId },
    links: [
      { label: 'Watch on YouTube', icon: 'video', url: `https://www.youtube.com/watch?v=${videoId}` },
      { label: 'More videos on my channel', icon: 'video', url: 'https://www.youtube.com/@imDIEGOOyt' },
    ],
  }
}

function createInstagramProject({ postId, title, url, thumbnailImages = [], thumbnailLayout }) {
  const isRnbBeef = postId === 'DXhfEKPDJfL'

  return {
    id: `instagram-${postId}`,
    title,
    category: 'videos',
    categoryLabel: 'Video',
    shortDescription: 'A black-and-white edit showcasing the photographer/videographer’s signature style.',
    description: isRnbBeef
      ? 'Edited in DaVinci Resolve for photographer/videographer @elkia.d.a, showcasing selected shots captured at R&B Beef in her signature black-and-white style. This portfolio piece highlights her work and is not a paid promotion for the venue.'
      : 'Edited in DaVinci Resolve to showcase the photographer/videographer’s strongest shots and promote her work. The black-and-white look reinforces the visual identity she wants to convey across her videos.',
    technologies: ['DaVinci Resolve'],
    features: [
      'Black-and-white tones reinforce the photographer/videographer’s visual identity.',
      'Selected shots showcase her work and promote her services.',
      ...(postId === 'DXmU00qDBgC' ? ['Promotional video for Wonderbeauty.'] : []),
    ],
    cover: 'instagram',
    thumbnailImages,
    thumbnailLayout,
    links: [
      { label: 'Watch on Instagram', icon: 'video', url },
    ],
  }
}

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
    cover: 'white',
    thumbnail: './public/projects/project-white-thumbnail.webp',
    logo: './public/projects/project-white-logo.png',
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
      { label: 'Get it on GameJolt', icon: 'download', url: 'https://gamejolt.com/games/project-white/631626' },
      { label: 'Trailer', icon: 'video', url: 'https://www.youtube.com/watch?v=YVc5H6ly-HI' },
      { label: 'Website', icon: 'website', url: 'https://diogo-l.github.io/projectwhite/' },
    ],
  },
  {
    id: 'forklift-simulator',
    title: 'Forklift Simulator 2021: DL Edition',
    category: 'games',
    categoryLabel: 'Game',
    shortDescription: 'A forklift simulation where players deliver color-coded crates and earn Forkcoins to customize their vehicles.',
    description:
      'Forklift Simulator 2021: DL Edition is a Unity simulation in which the player drives a forklift around a warehouse. Each six-minute round challenges the player to deliver crates to the correct zones: crate colors and rarities determine where each one belongs and how much XP and how many Forkcoins a correct delivery earns. Day and night maps offer different settings, while Forkcoins unlock forklift cosmetics.',
    technologies: ['Unity3D'],
    features: [
      'The player delivers common crates to any zone and rare crates to their matching color-coded zones.',
      'Six-minute rounds take place on day or night maps.',
      'Correct deliveries earn the player XP and Forkcoins.',
      'Forkcoins unlock cosmetics that the player can equip on the forklift.',
    ],
    cover: 'forklift',
    thumbnail: './public/projects/forklift-simulator-thumbnail.webp',
    links: [
      { label: 'Get it on GameJolt', icon: 'download', url: 'https://gamejolt.com/games/forkliftsim21dl/608478' },
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
  ...youtubeVideos.map(createYoutubeProject),
  ...instagramVideos.map(createInstagramProject),
]

const categoryLabels = {
  videos: 'Videos',
  games: 'Games',
  apps: 'Apps',
}

function createProjectLinkIcon(iconName) {
  const iconPaths = {
    play: 'm8 5 11 7-11 7z',
    video: 'M15 10l5-3v10l-5-3M4 5h11v14H4z',
    website: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-8 9h16M12 3a14 14 0 0 1 0 18m0-18a14 14 0 0 0 0 18',
    download: 'M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4',
  }
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')

  icon.setAttribute('viewBox', '0 0 24 24')
  icon.setAttribute('aria-hidden', 'true')
  icon.classList.add('project-link-icon')
  path.setAttribute('d', iconPaths[iconName])
  icon.append(path)

  return icon
}

function createProjectArt(project, large = false) {
  const art = document.createElement('div')
  art.className = `project-art project-art--${project.cover}${large ? ' project-art--large' : ''}`

  if (large && project.media?.type === 'youtube') {
    if (window.location.protocol === 'file:') {
      const thumbnail = document.createElement('img')
      thumbnail.className = 'project-media'
      thumbnail.src = project.largeThumbnail || project.thumbnail
      thumbnail.alt = `Cover image for ${project.title}; use the link below to watch it on YouTube`
      if (project.largeThumbnail) {
        thumbnail.addEventListener('error', () => {
          thumbnail.src = project.thumbnail
        }, { once: true })
      } else if (project.thumbnailPosition) {
        thumbnail.style.objectPosition = project.thumbnailPosition
      }
      art.append(thumbnail)
      return art
    }

    const player = document.createElement('iframe')
    player.className = 'project-media'
    player.src = `https://www.youtube.com/embed/${encodeURIComponent(project.media.videoId)}?rel=0&playsinline=1`
    player.title = `${project.title} on YouTube`
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
    if (project.thumbnailPosition) image.style.objectPosition = project.thumbnailPosition
    if (project.thumbnailFallback) {
      image.addEventListener('error', () => {
        image.removeAttribute('srcset')
        image.src = project.thumbnailFallback
      }, { once: true })
    }
    art.append(image)
    return art
  }

  if (project.thumbnailImages?.length) {
    art.classList.add('project-art--photo-showcase')
    if (project.thumbnailLayout) art.classList.add(`project-art--photo-showcase-${project.thumbnailLayout}`)
    art.setAttribute('role', 'img')
    art.setAttribute('aria-label', `Black-and-white photos from ${project.title}`)

    project.thumbnailImages.forEach((source) => {
      const image = document.createElement('img')
      image.className = 'project-photo-showcase-image'
      image.src = source
      image.alt = ''
      image.setAttribute('aria-hidden', 'true')
      art.append(image)
    })
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
  mark.textContent = project.cover === 'ptours' ? 'PT' : project.cover === 'instagram' ? 'IG' : 'CMS'

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
  card.dataset.reveal = ''
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

    return matchesCategory && matchesQuery
  })

  return visibleProjects
}

function renderProjects() {
  const visibleProjects = getVisibleProjects()
  projectGrid.replaceChildren(...visibleProjects.map(createProjectCard))
  observeRevealElements(projectGrid)
  projectEmpty.hidden = visibleProjects.length > 0
  projectResults.textContent = `${visibleProjects.length} ${visibleProjects.length === 1 ? 'project found' : 'projects found'}`
}

function observeRevealElements(root) {
  if (!revealObserver) return

  if (root.matches?.('[data-reveal]')) {
    revealObserver.observe(root)
  }

  root.querySelectorAll('[data-reveal]').forEach((element) => revealObserver.observe(element))
}

function initializeScrollReveals() {
  if (
    !('IntersectionObserver' in window) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return
  }

  revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -32px 0px' },
  )

  document.body.classList.add('reveal-ready')
  observeRevealElements(document)
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
      ? 'Watch on YouTube ↗'
      : 'Having trouble playing it? Watch on YouTube ↗'
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
      anchor.append(createProjectLinkIcon(link.icon), document.createTextNode(link.label))
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

function updateActiveSection() {
  const heroSection = document.getElementById('home')
  const heroProgress = updateHeroScrollSequence()
  const shouldShowNav = heroScrollSequenceEnabled
    ? heroProgress >= 0.72
    : window.scrollY > heroSection.offsetTop + heroSection.offsetHeight * 0.3

  topbar.classList.toggle('visible', shouldShowNav)
  topbar.classList.toggle('hidden', !shouldShowNav)
  scrollTopButton.classList.toggle('visible', shouldShowNav)

  const sections = [...document.querySelectorAll('main > section[id]')]
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

function updateHeroScrollSequence() {
  if (!heroScrollSequenceEnabled) return 0

  const heroSection = document.getElementById('home')
  const scrollDistance = Math.max(1, heroSection.offsetHeight - window.innerHeight)
  const progress = Math.min(1, Math.max(0, (window.scrollY - heroSection.offsetTop) / scrollDistance))
  const maxScale = 3.4
  const aboutBackgroundY = aboutSection.offsetHeight * 0.32

  if (progress === 0 && heroTitle.parentElement === heroTitleSlot) {
    captureHeroTitlePosition()
  }

  if (window.scrollY > 0 && document.body.classList.contains('hero-intro-ready')) {
    finishHeroEntrance()
  }

  heroTitle.style.setProperty('--hero-scale', 1 + (maxScale - 1) * progress)
  heroTitle.style.setProperty('--hero-title-opacity', 1 - progress * 0.95)
  heroSection.style.setProperty('--hero-progress', progress)
  heroTitle.style.setProperty('--hero-progress', progress)
  heroTitle.style.setProperty('--hero-title-x', `${document.documentElement.clientWidth / 2}px`)
  heroTitle.style.setProperty('--hero-title-y', `${heroTitleStartY}px`)
  heroTitle.style.setProperty(
    '--hero-rise',
    `${(heroTitleStartY - aboutSection.getBoundingClientRect().top - aboutBackgroundY) * progress}px`,
  )

  if (progress === 1) {
    heroTitle.classList.remove('hero-title--pinned')
    heroTitle.classList.add('hero-title--background')
  } else {
    heroTitle.classList.remove('hero-title--background')
    heroTitle.classList.toggle('hero-title--pinned', progress > 0)
    heroTitleSlot.style.minHeight = progress > 0 ? `${heroTitleSlotHeight}px` : ''
  }

  if (progress > 0) {
    heroTitle.classList.remove('hero-title--nickname', 'hero-title--drawing')
  }

  return progress
}

function initializeHeroScrollSequence() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  heroScrollSequenceEnabled = true
  document.body.classList.add('scroll-sequence-ready')
  captureHeroTitlePosition()
}

function initializeHeroEntrance() {
  if (
    window.scrollY > 0 ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    document.body.classList.add('hero-intro-complete')
    return
  }

  document.body.classList.add('hero-intro-ready')
  document.querySelector('.cta-row').addEventListener('animationend', (event) => {
    if (event.target === event.currentTarget && event.animationName === 'hero-copy-enter') {
      finishHeroEntrance()
    }
  })
}

function finishHeroEntrance() {
  document.body.classList.remove('hero-intro-ready')
  document.body.classList.add('hero-intro-complete')
}

function captureHeroTitlePosition() {
  const slot = heroTitleSlot.getBoundingClientRect()
  const titleStyles = getComputedStyle(heroTitle)
  heroTitleStartY = slot.top + slot.height / 2
  heroTitleSlotHeight = slot.height
  heroTitle.style.setProperty('--hero-title-x', `${document.documentElement.clientWidth / 2}px`)
  heroTitle.style.setProperty('--hero-title-y', `${heroTitleStartY}px`)
  heroTitle.style.setProperty('--hero-rise', '0px')
  heroTitle.style.setProperty(
    '--hero-slot-height',
    `${heroTitle.offsetHeight + parseFloat(titleStyles.marginTop) + parseFloat(titleStyles.marginBottom)}px`,
  )
}

function showHeroName() {
  heroTitle.classList.remove('hero-title--nickname', 'hero-title--drawing')
  setTimeout(showHeroNickname, 4800)
}

function showHeroNickname() {
  if (heroScrollSequenceEnabled && window.scrollY > 0) {
    setTimeout(showHeroNickname, 3000)
    return
  }

  heroTitle.classList.add('hero-title--nickname', 'hero-title--drawing')

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroTitle.classList.remove('hero-title--drawing')
    setTimeout(showHeroName, 3000)
    return
  }

  setTimeout(() => {
    heroTitle.classList.remove('hero-title--drawing')
    setTimeout(showHeroName, 3000)
  }, 1950)
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

document.addEventListener('DOMContentLoaded', () => {
  initializeHeroScrollSequence()
  initializeScrollReveals()

  const hash = window.location.hash.replace('#', '')
  const validHashes = ['about', 'projects', 'contact']

  if (validHashes.includes(hash)) {
    const section = document.getElementById(hash)
    if (section) {
      section.scrollIntoView({ behavior: 'auto' })
    }
  }

  initializeHeroEntrance()
  updateActiveSection()
  setTimeout(showHeroNickname, 4800)

  window.addEventListener('scroll', updateActiveSection)
  window.addEventListener('resize', updateActiveSection)
  window.addEventListener('hashchange', updateActiveSection)

  scrollTopButton.addEventListener('click', scrollToTop)
  projectSearch.addEventListener('input', renderProjects)
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
