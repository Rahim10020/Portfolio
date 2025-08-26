// ===========================================
// GESTION DES THÈMES (Code existant amélioré)
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

    // Ajout de la navigation au clavier pour les thèmes
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

// Observer pour les animations fade-in
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
// VALIDATION ET SOUMISSION DU FORMULAIRE
// ===========================================

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contact-form')
    const submitBtn = document.getElementById('submit-btn')
    const btnText = document.getElementById('btn-text')
    const btnLoader = document.getElementById('btn-loader')
    const successMessage = document.getElementById('success-message')

    // Gestion de la soumission du formulaire
    form.addEventListener('submit', async function (e) {
        e.preventDefault()

        if (validateForm()) {
            // Désactiver le bouton et afficher le loader
            submitBtn.disabled = true
            btnText.style.display = 'none'
            btnLoader.style.display = 'inline'

            // Simulation d'envoi (remplacer par vraie logique d'envoi)
            try {
                await simulateFormSubmission()

                // Succès - réinitialiser le formulaire
                form.reset()
                clearErrors()
                successMessage.style.display = 'block'

                // Faire défiler vers le message de succès
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' })

                // Cacher le message après 5 secondes
                setTimeout(() => {
                    successMessage.style.display = 'none'
                }, 5000)

            } catch (error) {
                console.error('Erreur lors de l\'envoi:', error)
                alert('Une erreur est survenue. Veuillez réessayer.')
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

function simulateFormSubmission() {
    return new Promise((resolve) => {
        // Simuler un délai d'envoi de 2 secondes
        setTimeout(() => {
            resolve()
        }, 2000)
    })
}

// ===========================================
// GESTION DES MODALES POUR LES PROJETS
// ===========================================

// Données des projets
const projectData = {
    project1: {
        title: 'Plateforme E-commerce Django',
        image: './images/ecran1.png',
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
        image: './images/ecran2.png',
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
        image: './images/ecran3.png',
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

    modalBody.innerHTML = `
        <div class="project-modal">
            <img src="${project.image}" alt="${project.title}" class="modal-image" />
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

        // Focus sur la modale pour l'accessibilité
        modalOverlay.focus()
    }
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

// Fermer la modale en cliquant sur l'overlay (mais pas sur le contenu)
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

// Navigation fluide vers les sections
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('#navigation a[href^="#"]')

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault()

            const targetId = this.getAttribute('href').substring(1)
            const targetElement = document.getElementById(targetId)

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80 // Offset pour la navigation fixe

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                })

                // Mettre en surbrillance le lien actif
                navLinks.forEach(l => l.classList.remove('active'))
                this.classList.add('active')
            }
        })
    })
})

// Détecter la section active pendant le scroll
window.addEventListener('scroll', function () {
    const sections = document.querySelectorAll('section[class^="s"]')
    const navLinks = document.querySelectorAll('#navigation a[href^="#"]')

    let currentSection = ''

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100
        const sectionHeight = section.offsetHeight

        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.id || section.querySelector('[id]')?.id || ''
        }
    })

    // Mettre à jour la navigation active
    navLinks.forEach(link => {
        link.classList.remove('active')
        if (link.getAttribute('href') === '#' + currentSection) {
            link.classList.add('active')
        }
    })
})

// ===========================================
// AMÉLIORATION DES INTERACTIONS
// ===========================================

// Animation des dots de navigation au clic
document.addEventListener('DOMContentLoaded', function () {
    const browserDots = document.querySelectorAll('.browser-dot')

    browserDots.forEach(dot => {
        dot.addEventListener('click', function () {
            // Animation de clic
            this.style.transform = 'scale(0.8)'
            setTimeout(() => {
                this.style.transform = 'scale(1)'
            }, 150)
        })
    })
})

// Parallax léger sur l'image de profil
window.addEventListener('scroll', function () {
    const profilePic = document.getElementById('profile-pic')
    if (profilePic) {
        const scrolled = window.pageYOffset
        const parallax = scrolled * 0.1
        profilePic.style.transform = `translateY(${parallax}px) scale(1)`
    }
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
// INITIALISATION
// ===========================================

// S'assurer que tout est initialisé au chargement de la page
document.addEventListener('DOMContentLoaded', function () {
    console.log('Portfolio initialisé avec succès !')

    // Vérifier que tous les éléments nécessaires sont présents
    const requiredElements = [
        'contact-form',
        'modal-overlay',
        'backToTop',
        'theme-style'
    ]

    requiredElements.forEach(id => {
        const element = document.getElementById(id)
        if (!element) {
            console.warn(`Élément manquant: ${id}`)
        }
    })

    // Animation d'entrée pour le titre
    const introTitle = document.getElementById('intro')
    if (introTitle) {
        setTimeout(() => {
            introTitle.style.borderRight = 'none'
        }, 4000)
    }
})