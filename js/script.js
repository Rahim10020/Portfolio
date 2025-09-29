// ===========================================
// CONFIGURATION EMAILJS
// ===========================================

const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_eauxtoj',
    TEMPLATE_ID: 'template_z4293yq',
    PUBLIC_KEY: 'n77pXLtp9kbv-fCwm'
}

// Initialisation EmailJS
document.addEventListener('DOMContentLoaded', function () {
    // Vérifier si EmailJS est chargé
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY)
        console.log('EmailJS initialisé avec succès')
    } else {
        console.error('EmailJS non chargé')
    }
})

// ===========================================
// FONCTION D'ENVOI EMAIL
// ===========================================

async function sendEmail(formData) {
    try {
        // Préparer les données du template
        const templateParams = {
            from_name: formData.get('name'),
            from_email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            to_name: 'Rahim ALI',
            reply_to: formData.get('email')
        }

        console.log('Envoi de l\'email avec les paramètres:', templateParams)

        // Envoyer l'email via EmailJS
        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams
        )

        console.log('Email envoyé avec succès:', response)
        return response

    } catch (error) {
        console.error('Erreur lors de l\'envoi:', error)
        throw error
    }
}

// ===========================================
// GESTION DES THÈMES (Code existant)
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

    // Navigation au clavier pour les thèmes
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
// ANIMATIONS AU SCROLL
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

// Appliquer l'observer à tous les éléments avec la classe fade-in
document.addEventListener('DOMContentLoaded', function () {
    const fadeElements = document.querySelectorAll('.fade-in')
    fadeElements.forEach(el => {
        observer.observe(el)
    })
})

// ===========================================
// BOUTON RETOUR EN HAUT
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
// VALIDATION ET SOUMISSION DU FORMULAIRE (VERSION UNIFIÉE)
// ===========================================

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contact-form')
    const submitBtn = document.getElementById('submit-btn')
    const btnText = document.getElementById('btn-text')
    const btnLoader = document.getElementById('btn-loader')
    const successMessage = document.getElementById('success-message')

    // UN SEUL gestionnaire d'événements pour le formulaire
    form.addEventListener('submit', async function (e) {
        e.preventDefault()

        if (validateForm()) {
            // Désactiver le bouton et afficher le loader
            submitBtn.disabled = true
            btnText.style.display = 'none'
            btnLoader.style.display = 'inline'

            try {
                // Préparer les données du formulaire
                const formData = new FormData(form)

                // Envoyer l'email via EmailJS
                await sendEmail(formData)

                // Succès - réinitialiser le formulaire
                form.reset()
                clearErrors()
                successMessage.innerHTML = `
                    <strong>Message envoyé avec succès !</strong><br>
                    Merci ${formData.get('name')}, je vous répondrai dans les plus brefs délais.
                `
                successMessage.style.backgroundColor = 'var(--success)'
                successMessage.style.display = 'block'

                // Faire défiler vers le message de succès
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' })

                // Cacher le message après 7 secondes
                setTimeout(() => {
                    successMessage.style.display = 'none'
                }, 7000)

            } catch (error) {
                console.error('Erreur lors de l\'envoi:', error)

                // Afficher un message d'erreur à l'utilisateur
                successMessage.innerHTML = `
                    <strong>Erreur lors de l'envoi</strong><br>
                    Une erreur est survenue. Veuillez réessayer ou me contacter directement.
                `
                successMessage.style.backgroundColor = '#dc3545'
                successMessage.style.display = 'block'

                setTimeout(() => {
                    successMessage.style.display = 'none'
                    successMessage.style.backgroundColor = 'var(--success)'
                }, 7000)
            } finally {
                // Réactiver le bouton
                submitBtn.disabled = false
                btnText.style.display = 'inline'
                btnLoader.style.display = 'none'
            }
        }
    })

    // Validation en temps réel
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

    // Validation selon le type de champ
    switch (fieldName) {
        case 'name':
            if (!field.value.trim()) {
                errorMessage = 'Veuillez saisir votre nom'
                isValid = false
            } else if (field.value.trim().length < 2) {
                errorMessage = 'Le nom doit contenir au moins 2 caractères'
                isValid = false
            }
            break

        case 'subject':
            if (!field.value.trim()) {
                errorMessage = 'Veuillez saisir un sujet'
                isValid = false
            } else if (field.value.trim().length < 3) {
                errorMessage = 'Le sujet doit contenir au moins 3 caractères'
                isValid = false
            }
            break

        case 'email':
            if (!field.value.trim()) {
                errorMessage = 'Veuillez saisir votre email'
                isValid = false
            } else if (!isValidEmail(field.value)) {
                errorMessage = 'Veuillez saisir un email valide'
                isValid = false
            }
            break

        case 'message':
            if (!field.value.trim()) {
                errorMessage = 'Veuillez saisir votre message'
                isValid = false
            } else if (field.value.trim().length < 10) {
                errorMessage = 'Le message doit contenir au moins 10 caractères'
                isValid = false
            }
            break
    }

    // Afficher ou cacher l'erreur
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
// GESTION DES MODALES POUR LES PROJETS
// ===========================================

// Données des projets
const projectData = {
    project1: {
        title: 'Plateforme E-commerce Django',
        images: ['./images/ecran1.png', './images/detail.png', './images/accueil.png'],
        currentImageIndex: 0,
        description: 'Plateforme e-commerce complète développée avec Django, intégrant un système de gestion des produits, panier d\'achat, authentification utilisateur et système de paiement sécurisé avec Stripe.',
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
        description: 'Application mobile cross-platform développée avec Flutter pour le suivi d\'entraînements sportifs. Synchronisation en temps réel avec Firebase et fonctionnalités avancées de tracking.',
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
        description: 'Application Android native pour la gestion de tâches quotidiennes, construite avec Kotlin en suivant l\'architecture MVVM pour une maintenabilité optimale et des performances élevées.',
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

// Fonction pour changer l'image principale lors du clic sur une miniature
function changeMainImage(clickedThumbnail, projectId) {
    const project = projectData[projectId]
    if (!project) return

    // Trouver l'index de l'image cliquée
    const clickedSrc = clickedThumbnail.src
    const imageIndex = project.images.findIndex(img => img === clickedSrc)

    if (imageIndex !== -1) {
        project.currentImageIndex = imageIndex

        // Mettre à jour l'image principale
        const mainThumbnail = clickedThumbnail.closest('.project-gallery').querySelector('.main-thumbnail')
        if (mainThumbnail) {
            mainThumbnail.src = clickedSrc
        }

        // Mettre à jour les classes active des miniatures
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

function openModal(projectId) {
    const project = projectData[projectId]
    if (!project) {
        console.error('Projet non trouvé:', projectId)
        return
    }

    const modalBody = document.getElementById('modal-body')
    if (!modalBody) {
        console.error('Élément modal-body non trouvé')
        return
    }

    // S'assurer que currentImageIndex existe
    if (project.currentImageIndex === undefined) {
        project.currentImageIndex = 0
    }

    const currentImage = project.images[project.currentImageIndex]

    modalBody.innerHTML = `
        <div class="project-modal">
            <div class="modal-gallery">
                <img src="${currentImage}" alt="${project.title}" class="modal-image" />
                ${project.images.length > 1 ? `
                    <div class="modal-gallery-nav">
                        <button class="gallery-nav-btn prev" onclick="changeModalImage('${projectId}', 'prev')" ${project.currentImageIndex === 0 ? 'disabled' : ''}>
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <div class="gallery-indicators">
                            ${project.images.map((_, index) =>
        `<span class="indicator ${index === project.currentImageIndex ? 'active' : ''}" onclick="setModalImage('${projectId}', ${index})"></span>`
    ).join('')}
                        </div>
                        <button class="gallery-nav-btn next" onclick="changeModalImage('${projectId}', 'next')" ${project.currentImageIndex === project.images.length - 1 ? 'disabled' : ''}>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                ` : ''}
            </div>
            <h2>${project.title}</h2>
            <p class="project-description">${project.description}</p>

            <div class="modal-tech-stack">
                <h4>Technologies utilisées:</h4>
                <div class="tech-grid">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>

            <div class="modal-features">
                <h4>Fonctionnalités principales:</h4>
                <ul>
                    ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>

            <div class="modal-links">
                <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="modal-btn">
                    Code source
                </a>
                <a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="modal-btn">
                    Voir la démo
                </a>
            </div>
        </div>
    `

    const modalOverlay = document.getElementById('modal-overlay')
    if (modalOverlay) {
        modalOverlay.style.display = 'flex'
        document.body.style.overflow = 'hidden'
        modalOverlay.focus()
    }
}

// Fonctions de navigation pour la galerie dans la modale
function changeModalImage(projectId, direction) {
    const project = projectData[projectId]
    if (!project) return

    if (direction === 'prev' && project.currentImageIndex > 0) {
        project.currentImageIndex--
    } else if (direction === 'next' && project.currentImageIndex < project.images.length - 1) {
        project.currentImageIndex++
    }

    updateModalGallery(projectId)
}

function setModalImage(projectId, imageIndex) {
    const project = projectData[projectId]
    if (!project) return

    project.currentImageIndex = imageIndex
    updateModalGallery(projectId)
}

function updateModalGallery(projectId) {
    const project = projectData[projectId]
    if (!project) return

    const modalBody = document.getElementById('modal-body')
    if (!modalBody) return

    const currentImage = project.images[project.currentImageIndex]
    const modalImage = modalBody.querySelector('.modal-image')
    const prevBtn = modalBody.querySelector('.gallery-nav-btn.prev')
    const nextBtn = modalBody.querySelector('.gallery-nav-btn.next')
    const indicators = modalBody.querySelectorAll('.indicator')

    if (modalImage) modalImage.src = currentImage

    // Mettre à jour les boutons de navigation
    if (prevBtn) prevBtn.disabled = project.currentImageIndex === 0
    if (nextBtn) nextBtn.disabled = project.currentImageIndex === project.images.length - 1

    // Mettre à jour les indicateurs
    indicators.forEach((indicator, index) => {
        if (index === project.currentImageIndex) {
            indicator.classList.add('active')
        } else {
            indicator.classList.remove('active')
        }
    })
}

function closeModal() {
    const modalOverlay = document.getElementById('modal-overlay')
    if (modalOverlay) {
        modalOverlay.style.display = 'none'
        document.body.style.overflow = 'auto'
    }
}

// Fermer la modale avec la touche Escape
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeModal()
    }
})

// Fermer la modale en cliquant sur l'overlay
document.addEventListener('DOMContentLoaded', function () {
    const modalOverlay = document.getElementById('modal-overlay')
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function (e) {
            if (e.target === modalOverlay) {
                closeModal()
            }
        })
    }
})

// ===========================================
// AMÉLIORATIONS DE NAVIGATION
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
// FONCTIONS UTILITAIRES
// ===========================================

// Débounce pour optimiser les événements de scroll
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

// Appliquer le debounce aux événements de scroll intensifs
const debouncedScrollHandler = debounce(() => {
    // Code de scroll optimisé peut être ajouté ici
}, 10)

window.addEventListener('scroll', debouncedScrollHandler)

// ===========================================
// GÉNÉRATION DYNAMIQUE DES PROJETS
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
                                alt="Capture d'écran ${index + 1} du projet ${project.title}"
                                onclick="changeMainImage(this, '${projectId}')" />`
        ).join('')}
                    </div>
                    <img class="main-thumbnail" src="${project.images[0]}" alt="Capture d'écran principale du projet ${project.title}" />
                </div>
                <div class="post-preview">
                    <h6 class="post-title">${project.title}</h6>
                    <div class="tech-stack">
                        ${project.technologies.slice(0, 3).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <p class="post-intro">
                        ${project.description.length > 100 ?
                project.description.substring(0, 100) + '...' :
                project.description}
                    </p>
                    <a href="#" onclick="openModal('${projectId}')" class="project-link">Voir les détails</a>
                </div>
            </div>
        `

        postWrapper.appendChild(projectElement.firstElementChild)
    })
}

// ===========================================
// INITIALISATION
// ===========================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('Portfolio initialisé avec succès !')

    // Générer les projets dynamiquement
    generateProjectsHTML()

    // Animation d'entrée pour le titre
    const introTitle = document.getElementById('intro')
    if (introTitle) {
        setTimeout(() => {
            introTitle.style.borderRight = 'none'
        }, 4000)
    }
})