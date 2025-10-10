// ===========================================
// EMAILJS CONFIGURATION
// ===========================================

const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_eauxtoj',
    TEMPLATE_ID: 'template_z4293yq',
    PUBLIC_KEY: 'n77pXLtp9kbv-fCwm'
}

// EmailJS Initialization
document.addEventListener('DOMContentLoaded', function () {
    // Check if EmailJS is loaded
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY)
        console.log('EmailJS initialized successfully')
    } else {
        console.error('EmailJS not loaded')
    }
})

// ===========================================
// EMAIL SENDING FUNCTION
// ===========================================

async function sendEmail(formData) {
    try {
        // Prepare template data
        const templateParams = {
            from_name: formData.get('name'),
            from_email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            to_name: 'Rahim ALI',
            reply_to: formData.get('email')
        }

        console.log('Sending email with parameters:', templateParams)

        // Send email via EmailJS
        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams
        )

        console.log('Email sent successfully:', response)
        return response

    } catch (error) {
        console.error('Error sending email:', error)
        throw error
    }
}

// ===========================================
// THEME MANAGEMENT (Existing Code)
// ===========================================

let theme = localStorage.getItem('theme')
if (theme == null) {
    setTheme('light')
} else {
    setTheme(theme)
}

let themeDots = document.getElementsByClassName('theme-dot')

for (var i = 0; themeDots.length > i; i++) {
    themeDots[i].addEventListener('click', function () {
        let mode = this.dataset.mode
        console.log("Option clicked: ", mode)
        setTheme(mode)
    })

    // Keyboard navigation for themes
    themeDots[i].addEventListener('keypress', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            let mode = this.dataset.mode
            console.log("Option selected via keyboard: ", mode)
            setTheme(mode)
        }
    })
}

function setTheme(mode) {
    if (mode == 'light') {
        document.getElementById('theme-style').href = ''
    }
    if (mode == 'blue') {
        document.getElementById('theme-style').href = './css/blue.css'
    }
    if (mode == 'green') {
        document.getElementById('theme-style').href = './css/green.css'
    }
    if (mode == 'purple') {
        document.getElementById('theme-style').href = './css/purple.css'
    }

    localStorage.setItem('theme', mode)

    // Update social image based on theme
    updateSocialImage(mode)
}

function updateSocialImage(mode) {
    const socialImage = document.getElementById('social-image')
    if (!socialImage) return

    let imagePath = './images/portfolio-enhanced-normal.png' // default fallback

    switch (mode) {
        case 'light':
            imagePath = './images/portfolio.png'
            break
        case 'blue':
            imagePath = './images/portfolio-blue.png'
            break
        case 'green':
            imagePath = './images/portfolio-green.png'
            break
        case 'purple':
            imagePath = './images/portfolio-purple.png'
            break
        default:
            imagePath = './images/portfolio.png'
    }

    socialImage.src = imagePath
}

// ===========================================
// SCROLL ANIMATIONS
// ===========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible')
        }
    })
}, observerOptions)

// Apply observer to all elements with fade-in class
document.addEventListener('DOMContentLoaded', function () {
    const fadeElements = document.querySelectorAll('.fade-in')
    fadeElements.forEach(el => {
        observer.observe(el)
    })
})

// ===========================================
// BACK TO TOP BUTTON
// ===========================================

const backToTopBtn = document.getElementById('backToTop')

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible')
    } else {
        backToTopBtn.classList.remove('visible')
    }
})

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

// ===========================================
// FORM VALIDATION AND SUBMISSION (UNIFIED VERSION)
// ===========================================

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contact-form')
    const submitBtn = document.getElementById('submit-btn')
    const btnText = document.getElementById('btn-text')
    const btnLoader = document.getElementById('btn-loader')
    const successMessage = document.getElementById('success-message')

    // Single event handler for form
    form.addEventListener('submit', async function (e) {
        e.preventDefault()

        if (validateForm()) {
            // Disable button and show loader
            submitBtn.disabled = true
            btnText.style.display = 'none'
            btnLoader.style.display = 'inline'

            try {
                // Prepare form data
                const formData = new FormData(form)

                // Send email via EmailJS
                await sendEmail(formData)

                // Success - reset form
                form.reset()
                clearErrors()
                successMessage.innerHTML = `
                    <strong>Message sent successfully!</strong><br>
                    Thank you ${formData.get('name')}, I'll get back to you as soon as possible.
                `
                successMessage.style.backgroundColor = 'var(--success)'
                successMessage.style.display = 'block'

                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' })

                // Hide message after 7 seconds
                setTimeout(() => {
                    successMessage.style.display = 'none'
                }, 7000)

            } catch (error) {
                console.error('Error sending:', error)

                // Show error message to user
                successMessage.innerHTML = `
                    <strong>Error sending message</strong><br>
                    An error occurred. Please try again or contact me directly.
                `
                successMessage.style.backgroundColor = '#dc3545'
                successMessage.style.display = 'block'

                setTimeout(() => {
                    successMessage.style.display = 'none'
                    successMessage.style.backgroundColor = 'var(--success)'
                }, 7000)
            } finally {
                // Re-enable button
                submitBtn.disabled = false
                btnText.style.display = 'inline'
                btnLoader.style.display = 'none'
            }
        }
    })

    // Real-time validation
    const fields = ['name', 'subject', 'email', 'message']
    fields.forEach(fieldName => {
        const field = document.getElementById(fieldName)
        if (field) {
            field.addEventListener('blur', () => validateField(fieldName))
            field.addEventListener('input', () => clearFieldError(fieldName))
        }
    })
})

function validateForm() {
    let isValid = true
    const fields = ['name', 'subject', 'email', 'message']

    fields.forEach(fieldName => {
        if (!validateField(fieldName)) {
            isValid = false
        }
    })

    return isValid
}

function validateField(fieldName) {
    const field = document.getElementById(fieldName)
    const errorElement = document.getElementById(fieldName + '-error')

    if (!field || !errorElement) return true

    let isValid = true
    let errorMessage = ''

    // Validation according to field type
    switch (fieldName) {
        case 'name':
            if (!field.value.trim()) {
                errorMessage = 'Please enter your name'
                isValid = false
            } else if (field.value.trim().length < 2) {
                errorMessage = 'Name must contain at least 2 characters'
                isValid = false
            }
            break

        case 'subject':
            if (!field.value.trim()) {
                errorMessage = 'Please enter a subject'
                isValid = false
            } else if (field.value.trim().length < 3) {
                errorMessage = 'Subject must contain at least 3 characters'
                isValid = false
            }
            break

        case 'email':
            if (!field.value.trim()) {
                errorMessage = 'Please enter your email'
                isValid = false
            } else if (!isValidEmail(field.value)) {
                errorMessage = 'Please enter a valid email'
                isValid = false
            }
            break

        case 'message':
            if (!field.value.trim()) {
                errorMessage = 'Please enter your message'
                isValid = false
            } else if (field.value.trim().length < 10) {
                errorMessage = 'Message must contain at least 10 characters'
                isValid = false
            }
            break
    }

    // Show or hide error
    if (isValid) {
        field.classList.remove('error')
        errorElement.style.display = 'none'
    } else {
        field.classList.add('error')
        errorElement.textContent = errorMessage
        errorElement.style.display = 'block'
    }

    return isValid
}

function clearFieldError(fieldName) {
    const field = document.getElementById(fieldName)
    const errorElement = document.getElementById(fieldName + '-error')

    if (field && errorElement && field.value.trim()) {
        field.classList.remove('error')
        errorElement.style.display = 'none'
    }
}

function clearErrors() {
    const fields = ['name', 'subject', 'email', 'message']
    fields.forEach(fieldName => {
        const field = document.getElementById(fieldName)
        const errorElement = document.getElementById(fieldName + '-error')

        if (field) field.classList.remove('error')
        if (errorElement) errorElement.style.display = 'none'
    })
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

// ===========================================
// PROJECT MODAL MANAGEMENT
// ===========================================

// Project data
const projectData = {
    project1: {
        title: 'Essence Togo',
        description: 'Essence Togo is a Kotlin mobile app built with Jetpack Compose that helps users quickly find nearby gas stations on a map. Fast, simple, and user-friendly.',
        longDescription: 'Essence Togo is a Kotlin mobile app built with Jetpack Compose that helps users quickly find nearby gas stations on a map. Whether you\'re traveling in an unfamiliar area or simply looking for the closest station, Essence Togo provides a reliable solution with its clean Material Design 3 interface and efficient geolocation features. The app automatically sorts stations by proximity, updates distances in real-time as you move, and integrates seamlessly with Google Maps for turn-by-turn navigation to your selected station.',
        images: ['./images/projet1/accueil.png', './images/projet1/detail.png', './images/projet1/filter.png', './images/projet1/history.png', './images/projet1/map.png',],
        currentImageIndex: 0,
        technologies: ['Kotlin', 'Jetpack compose', 'Firebase', 'Android'],
        github: 'https://github.com/Rahim10020/essence-togo',
        demo: 'https://votre-demo-ecommerce.com',
        features: ['Station Locator: Find gas stations closest to your current position', 'Geolocation: Automatic distance calculation from your current location', 'Advanced Search: Search by station name or address', ' History: View your recently visited stations', 'Modern Interface: Modern design with Material Design 3', 'Real-time: Data synchronized in real-time with Firebase']
    },
    project2: {
        title: 'PixelPulse-blog',
        description: 'Blog web app for tech.',
        longDescription: 'PixelPulse is a modern and high-performance blog platform designed for developers, content creators, and technology enthusiasts. It offers a rich ecosystem for sharing knowledge, technology insights, and interacting with a growing community.',
        images: ['./images/projet2/accueil.png', './images/projet2/detail.png', './images/projet2/tous.png'],
        currentImageIndex: 0,
        technologies: ['Next JS', 'NextAuth JS', 'Postgresql', 'Prisma', 'Tailwind CSS'],
        github: 'https://github.com/Rahim10020/tech-pulse',
        demo: 'https://pixelpulse-blog.vercel.app/',
        features: ['Article Publishing: A rich text editor to create and publish your articles', 'Category Management: Organize your articles into categories for easy navigation', 'Interactive Comments: Engage with your readers through a commenting system', 'Powerful Search: Quickly find articles with efficient search functionality.', 'Author Profiles: Showcase your biography and contributions',]
    },
    project3: {
        title: 'Android Task Manager',
        description: 'Modern task management application for Android built with Kotlin, featuring MVVM architecture, offline capabilities, and intuitive user interface.',
        longDescription: 'A powerful and intuitive task management application designed for productivity enthusiasts. Built using Kotlin and following MVVM architecture patterns, this app provides seamless task organization, priority management, deadline tracking, and collaborative features. The app uses Room Database for local storage and implements Material Design principles for a modern user experience.',
        images: ['./images/ecran3.png', './images/ecran.png', './images/rahim.jpg'],
        currentImageIndex: 0,
        technologies: ['Kotlin', 'Room Database', 'MVVM', 'LiveData', 'ViewBinding', 'Material Design'],
        github: 'https://github.com/votre-username/task-manager-kotlin',
        demo: 'https://play.google.com/store/apps/details?id=com.votreapp.tasks',
        features: ['Task Organization', 'Priority Management', 'Deadline Tracking', 'Offline Mode', 'Data Synchronization', 'Intuitive UI']
    }
}

// Function to change main image when clicking on thumbnail
function changeMainImage(clickedThumbnail, projectId) {
    const project = projectData[projectId]
    if (!project) return

    // Find the index of the clicked image
    const clickedSrc = clickedThumbnail.src
    const imageIndex = project.images.findIndex(img => img === clickedSrc)

    if (imageIndex !== -1) {
        project.currentImageIndex = imageIndex

        // Update main image
        const mainThumbnail = clickedThumbnail.closest('.project-gallery').querySelector('.main-thumbnail')
        if (mainThumbnail) {
            mainThumbnail.src = clickedSrc
        }

        // Update active classes for thumbnails
        const thumbnails = clickedThumbnail.closest('.project-gallery').querySelectorAll('.gallery-thumbnails .thumbnail')
        thumbnails.forEach((thumb, index) => {
            if (index === imageIndex) {
                thumb.classList.add('active')
            } else {
                thumb.classList.remove('active')
            }
        })
    }
}

// Function to open project modal with detailed information
function openProjectModal(projectId) {
    const project = projectData[projectId]
    if (!project) return

    const modalBody = document.getElementById('modal-body')
    if (!modalBody) return

    modalBody.innerHTML = `
        <div class="modal-project">
            <div class="modal-header">
                <h2>${project.title}</h2>
                <div class="modal-gallery">
                    <div class="modal-gallery-thumbnails">
                        ${project.images.map((image, index) =>
        `<img class="modal-thumbnail ${index === 0 ? 'active' : ''}" src="${image}"
                                  alt="Screenshot ${index + 1} of project ${project.title}"
                                  onclick="changeModalImage('${projectId}', ${index})" />`
    ).join('')}
                    </div>
                    <img class="modal-main-image" src="${project.images[0]}" alt="Main screenshot of project ${project.title}" />
                </div>
            </div>

            <div class="modal-content-body">
                <div class="modal-description">
                    <h3>Description</h3>
                    <p>${project.longDescription || project.description}</p>
                </div>

                <div class="modal-features">
                    <h3>Key Features</h3>
                    <ul class="features-list">
                        ${project.features ? project.features.map(feature => `<li>${feature}</li>`).join('') : ''}
                    </ul>
                </div>

                <div class="modal-technologies">
                    <h3>Technologies Used</h3>
                    <div class="tech-stack-modal">
                        ${project.technologies.map(tech => `<span class="tech-tag-modal">${tech}</span>`).join('')}
                    </div>
                </div>

                <div class="modal-links">
                    <h3>Project Links</h3>
                    <div class="modal-project-links">
                        <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="modal-link-btn" title="View Source Code">
                            <i class="fab fa-github"></i>
                        </a>
                        ${project.demo && project.demo.includes('http') ? `
                            <a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="modal-link-btn" title="Live Demo">
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `

    // Show modal
    const modalOverlay = document.getElementById('modal-overlay')
    if (modalOverlay) {
        modalOverlay.style.display = 'flex'
        document.body.style.overflow = 'hidden' // Prevent background scrolling
    }
}

// Function to change main image in modal
function changeModalImage(projectId, imageIndex) {
    const project = projectData[projectId]
    if (!project || !project.images[imageIndex]) return

    // Update main image
    const modalMainImage = document.querySelector('.modal-main-image')
    if (modalMainImage) {
        modalMainImage.src = project.images[imageIndex]
    }

    // Update active classes for thumbnails
    const thumbnails = document.querySelectorAll('.modal-thumbnail')
    thumbnails.forEach((thumb, index) => {
        if (index === imageIndex) {
            thumb.classList.add('active')
        } else {
            thumb.classList.remove('active')
        }
    })
}

// Function to close project modal
function closeModal() {
    const modalOverlay = document.getElementById('modal-overlay')
    if (modalOverlay) {
        modalOverlay.style.display = 'none'
        document.body.style.overflow = 'auto' // Restore background scrolling
    }
}

// ===========================================
// NAVIGATION IMPROVEMENTS & MOBILE MENU
// ===========================================

document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('#navigation a[href^="#"]')
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle')
    const navigation = document.getElementById('navigation')

    // Mobile menu toggle functionality
    if (mobileMenuToggle && navigation) {
        mobileMenuToggle.addEventListener('click', function () {
            navigation.classList.toggle('mobile-menu-open')

            // Update aria-expanded for accessibility
            const isExpanded = navigation.classList.contains('mobile-menu-open')
            mobileMenuToggle.setAttribute('aria-expanded', isExpanded)

            // Change icon based on menu state
            const icon = mobileMenuToggle.querySelector('i')
            if (icon) {
                icon.className = isExpanded ? 'fas fa-times' : 'fas fa-bars'
            }
        })

        // Close mobile menu when clicking on a nav link
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                navigation.classList.remove('mobile-menu-open')
                mobileMenuToggle.setAttribute('aria-expanded', 'false')

                // Reset icon
                const icon = mobileMenuToggle.querySelector('i')
                if (icon) {
                    icon.className = 'fas fa-bars'
                }
            })
        })

        // Close mobile menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!navigation.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                navigation.classList.remove('mobile-menu-open')
                mobileMenuToggle.setAttribute('aria-expanded', 'false')

                // Reset icon
                const icon = mobileMenuToggle.querySelector('i')
                if (icon) {
                    icon.className = 'fas fa-bars'
                }
            }
        })
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault()

            const targetId = this.getAttribute('href').substring(1)
            const targetElement = document.getElementById(targetId)

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                })

                navLinks.forEach(l => l.classList.remove('active'))
                this.classList.add('active')
            }
        })
    })
})


// ===========================================
// UTILITY FUNCTIONS
// ===========================================

// Debounce to optimize scroll events
function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

// Apply debounce to intensive scroll events
const debouncedScrollHandler = debounce(() => {
    // Optimized scroll code can be added here
}, 10)

window.addEventListener('scroll', debouncedScrollHandler)

// Window resize handler for arrows
const debouncedResizeHandler = debounce(() => {
    updateArrowPositions()
}, 100)

window.addEventListener('resize', debouncedResizeHandler)

// ===========================================
// DYNAMIC PROJECT GENERATION
// ===========================================

function generateProjectsHTML() {
    const postWrapper = document.querySelector('.post-wrapper')
    if (!postWrapper) return

    postWrapper.innerHTML = ''

    Object.keys(projectData).forEach(projectId => {
        const project = projectData[projectId]
        if (!project) return

        const projectElement = document.createElement('div')
        projectElement.innerHTML = `
            <div class="post" id="project-${projectId}" tabindex="0">
                <div class="post-main">
                <div class="project-image">
                    <img class="main-thumbnail" src="${project.images[0]}" alt="Main screenshot of project ${project.title}" />
                </div>
                <div class="post-preview">
                    <h6 class="post-title">${project.title}</h6>
                    <p class="post-description">${project.description}</p>
                    <div class="tech-stack">
                        ${project.technologies.slice(0, 3).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="project-card-footer">
                        <span class="project-link" onclick="openProjectModal('${projectId}')">View details</span>
                        <div class="project-links">
                            <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-icon-link" title="View on GitHub">
                                <i class="fab fa-github"></i>
                            </a>
                            ${project.demo && project.demo.includes('http') ? `
                                <a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="project-icon-link" title="View Live Demo">
                                    <i class="fas fa-external-link-alt"></i>
                                </a>
                            ` : ''}
                        </div>
                    </div>
                </div>
                </div>
            </div>
        `

        postWrapper.appendChild(projectElement.firstElementChild)
    })
}

// ===========================================
// INITIALIZATION
// ===========================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('Portfolio initialized successfully!')

    // Generate projects dynamically
    generateProjectsHTML()

    // Initialize hover behavior for project cards
    initializeProjectCardHovers()

    // Test arrow creation after a short delay
    setTimeout(() => {
        const posts = document.querySelectorAll('.post')
        if (posts.length >= 2) {
            console.log('Testing arrow creation between first two cards')
            createArrowConnector(posts[0], posts[1], 'curved')
            setTimeout(() => {
                const testArrow = document.querySelector('.arrow-connector')
                if (testArrow) {
                    testArrow.style.opacity = '1'
                    testArrow.style.visibility = 'visible'
                    console.log('Test arrow made visible')
                }
            }, 1000)
        }
    }, 2000)

    // Entry animation for title
    const introTitle = document.getElementById('intro')
    if (introTitle) {
        setTimeout(() => {
            introTitle.style.borderRight = 'none'
        }, 4000)
    }
})

// ===========================================
// ARROW CONNECTOR FUNCTIONS
// ===========================================

function createArrowConnector(fromElement, toElement, arrowType = 'curved') {
    console.log('Creating arrow from:', fromElement.id, 'to:', toElement.id)

    // Remove any existing arrow for this connection
    const fromId = fromElement.id || fromElement.className || 'unknown';
    const existingArrow = document.querySelector('.arrow-connector[data-from="' + fromId + '"]');
    if (existingArrow) {
        existingArrow.remove();
    }

    const fromRect = fromElement.getBoundingClientRect();
    const toRect = toElement.getBoundingClientRect();

    console.log('Element positions:', {
        from: { x: fromRect.left, y: fromRect.top, width: fromRect.width, height: fromRect.height },
        to: { x: toRect.left, y: toRect.top, width: toRect.width, height: toRect.height }
    })

    // Calculate positions relative to the viewport
    const fromCenterX = fromRect.left + fromRect.width / 2;
    const fromCenterY = fromRect.top + fromRect.height / 2;
    const toCenterX = toRect.left + toRect.width / 2;
    const toCenterY = toRect.top + toRect.height / 2;

    console.log('Center positions:', { fromCenterX, fromCenterY, toCenterX, toCenterY })

    // Calculate the angle and distance between centers
    const deltaX = toCenterX - fromCenterX;
    const deltaY = toCenterY - fromCenterY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    console.log('Delta and distance:', { deltaX, deltaY, distance })

    // Avoid division by zero
    if (distance === 0) {
        console.log('Distance is 0, returning null')
        return null;
    }

    const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    console.log('Calculated angle:', angle)

    // Create SVG arrow
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.classList.add('arrow-connector');
    svg.setAttribute('data-from', fromId);
    svg.setAttribute('data-to', toElement.id || toElement.className || 'unknown');

    // Set SVG dimensions to cover the connection area with adequate margin
    const margin = Math.max(60, distance * 0.2);
    const svgWidth = Math.abs(deltaX) + margin * 2;
    const svgHeight = Math.abs(deltaY) + margin * 2;
    svg.setAttribute('width', Math.max(svgWidth, 100));
    svg.setAttribute('height', Math.max(svgHeight, 100));

    // Position SVG to cover the connection area
    svg.style.position = 'fixed';
    svg.style.left = (Math.min(fromCenterX, toCenterX) - margin) + 'px';
    svg.style.top = (Math.min(fromCenterY, toCenterY) - margin) + 'px';
    svg.style.zIndex = '1';
    svg.style.pointerEvents = 'none';

    if (arrowType === 'curved') {
        // Create curved path with improved control point calculation
        const controlPointOffset = Math.min(distance * 0.4, 150); // Limit curve intensity
        const controlX = (fromCenterX + toCenterX) / 2 + controlPointOffset * Math.sin((angle + 90) * Math.PI / 180);
        const controlY = (fromCenterY + toCenterY) / 2 + controlPointOffset * Math.cos((angle + 90) * Math.PI / 180);

        const pathData = `M ${fromCenterX - svg.offsetLeft},${fromCenterY - svg.offsetTop}
                         Q ${controlX - svg.offsetLeft},${controlY - svg.offsetTop}
                         ${toCenterX - svg.offsetLeft},${toCenterY - svg.offsetTop}`;

        const path = document.createElementNS(svgNS, "path");
        path.setAttribute('d', pathData);
        path.classList.add('arrow-line');
        svg.appendChild(path);

        // Add arrow head at the end with improved positioning
        const arrowHead = document.createElementNS(svgNS, "polygon");
        const headSize = Math.max(8, Math.min(15, distance * 0.05));
        const headAngle = 20;

        // Calculate arrow head position along the path direction
        const endAngle = angle;
        const headPoint1X = toCenterX - svg.offsetLeft - headSize * Math.cos((endAngle - headAngle) * Math.PI / 180);
        const headPoint1Y = toCenterY - svg.offsetTop - headSize * Math.sin((endAngle - headAngle) * Math.PI / 180);
        const headPoint2X = toCenterX - svg.offsetLeft - headSize * Math.cos((endAngle + headAngle) * Math.PI / 180);
        const headPoint2Y = toCenterY - svg.offsetTop - headSize * Math.sin((endAngle + headAngle) * Math.PI / 180);

        arrowHead.setAttribute('points',
            `${toCenterX - svg.offsetLeft},${toCenterY - svg.offsetTop} ${headPoint1X},${headPoint1Y} ${headPoint2X},${headPoint2Y}`);
        arrowHead.classList.add('arrow-head');
        svg.appendChild(arrowHead);

    } else {
        // Create straight line with arrow head
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute('x1', fromCenterX - svg.offsetLeft);
        line.setAttribute('y1', fromCenterY - svg.offsetTop);
        line.setAttribute('x2', toCenterX - svg.offsetLeft);
        line.setAttribute('y2', toCenterY - svg.offsetTop);
        line.classList.add('arrow-line');
        svg.appendChild(line);

        // Add arrow head
        const arrowHead = document.createElementNS(svgNS, "polygon");
        const headSize = 10;
        const headAngle = 30;

        const headPoint1X = toCenterX - svg.offsetLeft - headSize * Math.cos((angle - headAngle) * Math.PI / 180);
        const headPoint1Y = toCenterY - svg.offsetTop - headSize * Math.sin((angle - headAngle) * Math.PI / 180);
        const headPoint2X = toCenterX - svg.offsetLeft - headSize * Math.cos((angle + headAngle) * Math.PI / 180);
        const headPoint2Y = toCenterY - svg.offsetTop - headSize * Math.sin((angle + headAngle) * Math.PI / 180);

        arrowHead.setAttribute('points',
            `${toCenterX - svg.offsetLeft},${toCenterY - svg.offsetTop} ${headPoint1X},${headPoint1Y} ${headPoint2X},${headPoint2Y}`);
        arrowHead.classList.add('arrow-head');
        svg.appendChild(arrowHead);
    }

    // Append to body
    document.body.appendChild(svg);
    console.log('Arrow SVG appended to body:', svg)
    console.log('Arrow SVG outerHTML:', svg.outerHTML)
    return svg;
}

function removeArrowConnector(fromElement) {
    const arrow = document.querySelector('.arrow-connector[data-from="' + (fromElement.id || 'unknown') + '"]');
    if (arrow) {
        arrow.remove();
    }
}

function updateArrowPositions() {
    // Update positions of all existing arrows when window is resized
    const arrows = document.querySelectorAll('.arrow-connector');
    arrows.forEach(arrow => {
        const fromId = arrow.getAttribute('data-from');
        const toId = arrow.getAttribute('data-to');

        if (fromId && toId) {
            const fromElement = document.getElementById(fromId) || document.querySelector(`[data-project-id="${fromId}"]`);
            const toElement = document.getElementById(toId) || document.querySelector(`[data-project-id="${toId}"]`);

            if (fromElement && toElement) {
                arrow.remove();
                createArrowConnector(fromElement, toElement);
            }
        }
    });
}

// ===========================================
// PROJECT CARD HOVER BEHAVIOR
// ===========================================

function initializeProjectCardHovers() {
    const posts = document.querySelectorAll('.post')
    if (posts.length === 0) return

    posts.forEach((post, index) => {
        post.addEventListener('mouseenter', () => {
            handleCardHover(post, index, posts.length)
        })

        post.addEventListener('mouseleave', () => {
            handleCardLeave(post, index, posts.length)
        })
    })
}

function handleCardHover(hoveredPost, hoveredIndex, totalCards) {
    console.log('Card hover triggered:', hoveredIndex, 'Total cards:', totalCards)

    // Remove any existing target cards and arrows
    document.querySelectorAll('.post.target-card').forEach(card => {
        card.classList.remove('target-card')
    })
    document.querySelectorAll('.arrow-connector').forEach(arrow => {
        arrow.remove()
    })

    // Determine target card based on hover position
    let targetIndex = -1

    if (hoveredIndex === 0) {
        // First card -> target middle card (index 1)
        targetIndex = 1
    } else if (hoveredIndex === Math.floor(totalCards / 2)) {
        // Middle card -> target next card (could be index 2)
        targetIndex = Math.min(hoveredIndex + 1, totalCards - 1)
    } else if (hoveredIndex === totalCards - 1) {
        // Last card -> target middle card (index 1)
        targetIndex = 1
    }

    console.log('Target index:', targetIndex)

    // Apply target styling and show features if target exists
    if (targetIndex !== -1 && targetIndex < totalCards) {
        const targetCard = document.querySelectorAll('.post')[targetIndex]
        if (targetCard) {
            console.log('Target card found, adding target-card class')
            targetCard.classList.add('target-card')

            // Create arrow connector between hovered card and target card
            const arrow = createArrowConnector(hoveredPost, targetCard, 'curved')
            console.log('Arrow created:', arrow)
        } else {
            console.log('Target card not found')
        }
    }
}

function handleCardLeave(hoveredPost, hoveredIndex, totalCards) {
    // Remove target card styling and arrows
    document.querySelectorAll('.post.target-card').forEach(card => {
        card.classList.remove('target-card')
    })

    // Remove all arrows
    document.querySelectorAll('.arrow-connector').forEach(arrow => {
        arrow.remove()
    })
}