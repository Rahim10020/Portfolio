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
        title: 'Plateforme E-commerce Django',
        images: ['./images/ecran1.png', './images/detail.png', './images/accueil.png'],
        currentImageIndex: 0,
        technologies: ['Django', 'Python', 'PostgreSQL', 'Bootstrap', 'JavaScript', 'Stripe API', 'Redis'],
        features: [
            'Interface d\'administration complète pour la gestion des produits',
            'Système de panier avec gestion des sessions',
            'Authentification et profils utilisateurs',
            'Intégration de paiement sécurisé avec Stripe',
            'Gestion des stocks en temps réel',
            'Système de recommandations basé sur l\'historique',
            'Design responsive et optimisé mobile',
            'Système de reviews et ratings'
        ],
        github: 'https://github.com/votre-username/ecommerce-django',
        demo: 'https://votre-demo-ecommerce.com'
    },
    project2: {
        title: 'Application Mobile de Fitness',
        images: ['./images/ecran2.png', './images/history.png', './images/filter.png'],
        currentImageIndex: 0,
        technologies: ['Flutter', 'Dart', 'Firebase', 'Provider', 'SQLite', 'Google Maps API'],
        features: [
            'Suivi détaillé des exercices et performances',
            'Synchronisation cloud en temps réel avec Firebase',
            'Interface intuitive et moderne avec Material Design',
            'Mode hors-ligne avec synchronisation automatique',
            'Statistiques et graphiques de progression',
            'Géolocalisation pour le tracking des courses',
            'Notifications push personnalisées',
            'Partage social des performances'
        ],
        github: 'https://github.com/votre-username/fitness-flutter',
        demo: 'https://play.google.com/store/apps/details?id=com.votreapp.fitness'
    },
    project3: {
        title: 'Gestionnaire de Tâches Android',
        images: ['./images/ecran3.png', './images/ecran.png', './images/rahim.jpg'],
        currentImageIndex: 0,
        technologies: ['Kotlin', 'Room Database', 'MVVM', 'LiveData', 'ViewBinding', 'Material Design'],
        features: [
            'Architecture MVVM propre et maintenable',
            'Base de données locale Room pour la persistence',
            'Interface Material Design moderne',
            'Notifications push intelligentes',
            'Organisation par catégories et priorités',
            'Recherche et filtrage avancés',
            'Mode sombre et personnalisation',
            'Widgets pour l\'écran d\'accueil'
        ],
        github: 'https://github.com/votre-username/task-manager-kotlin',
        demo: 'https://play.google.com/store/apps/details?id=com.votreapp.tasks'
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

// ===========================================
// NAVIGATION IMPROVEMENTS
// ===========================================

document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('#navigation a[href^="#"]')

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
            <div class="post">
                <div class="project-gallery">
                    <div class="gallery-thumbnails">
                        ${project.images.map((image, index) =>
            `<img class="thumbnail ${index === 0 ? 'active' : ''}" src="${image}"
                                alt="Screenshot ${index + 1} of project ${project.title}"
                                onclick="changeMainImage(this, '${projectId}')" />`
        ).join('')}
                    </div>
                    <img class="main-thumbnail" src="${project.images[0]}" alt="Main screenshot of project ${project.title}" />
                </div>
                <div class="post-preview">
                    <h6 class="post-title">${project.title}</h6>
                    <div class="tech-stack">
                        ${project.technologies.slice(0, 3).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="project-card-footer">
                        <span class="project-link">View details</span>
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

    // Entry animation for title
    const introTitle = document.getElementById('intro')
    if (introTitle) {
        setTimeout(() => {
            introTitle.style.borderRight = 'none'
        }, 4000)
    }
})