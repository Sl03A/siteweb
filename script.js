// =============================================
// CONFIGURATION INITIALE
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('%c🚀 Portfolio Chargé avec Succès 🚀', 'color: #2563eb; font-size: 18px; font-weight: bold;');
    console.log('%c✨ Développé avec passion et précision ✨', 'color: #7c3aed; font-size: 14px;');
    
    // Initialiser l'année courante
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // =============================================
    // GESTION DU THÈME
    // =============================================
    
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Fonction pour appliquer le thème
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Mettre à jour l'icône
        if (themeToggle) {
            themeToggle.innerHTML = theme === 'dark' 
                ? '<i class="fas fa-sun"></i>' 
                : '<i class="fas fa-moon"></i>';
        }
    }
    
    // Charger le thème sauvegardé ou détecter la préférence système
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (prefersDarkScheme.matches) {
        applyTheme('dark');
    }
    
    // Basculer le thème
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
            
            // Animation du bouton
            this.style.transform = 'scale(0.8) rotate(180deg)';
            setTimeout(() => {
                this.style.transform = 'scale(1) rotate(0)';
            }, 300);
            
            // Notification
            showNotification(`Thème ${newTheme === 'dark' ? 'sombre' : 'clair'} activé`);
        });
    }
    
    // =============================================
    // NAVIGATION RESPONSIVE
    // =============================================
    
    const menuBtn = document.querySelector('.menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    
    // Toggle menu mobile
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
            this.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
            
            // Animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }
    
    // Fermer le menu au clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Fermer le menu mobile
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuBtn.classList.remove('active');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
            
            // Gérer le défilement doux pour les ancres
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Mettre à jour le lien actif
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });
    
    // Changer la classe active au scroll
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;
        
        document.querySelectorAll('section[id]').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // =============================================
    // ANIMATION DE LA NAVBAR AU SCROLL
    // =============================================
    
    function handleScroll() {
        // Navbar scroll effect
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Bouton retour en haut
        const backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
        
        // Mettre à jour le lien actif
        updateActiveNavLink();
        
        // Animer les éléments au scroll
        animateOnScroll();
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // =============================================
    // BOUTON RETOUR EN HAUT
    // =============================================
    
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 300);
        });
    }
    
    // =============================================
    // ANIMATIONS AU SCROLL
    // =============================================
    
    function animateOnScroll() {
        const elements = document.querySelectorAll(
            '.service-card, .portfolio-item, .skill-item, .tool-item, .info-item'
        );
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('animate');
            }
        });
    }
    
    // Initialiser les animations
    animateOnScroll();
    
    // =============================================
    // FILTRES PORTFOLIO
    // =============================================
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Retirer la classe active de tous les boutons
                filterBtns.forEach(b => {
                    b.classList.remove('active');
                    b.style.transform = 'scale(1)';
                });
                
                // Ajouter la classe active au bouton cliqué
                this.classList.add('active');
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                // Récupérer le filtre
                const filter = this.getAttribute('data-filter');
                
                // Filtrer les éléments
                portfolioItems.forEach(item => {
                    const categories = item.getAttribute('data-category').split(' ');
                    
                    if (filter === 'all' || categories.includes(filter)) {
                        item.classList.remove('hidden');
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        setTimeout(() => {
                            item.classList.add('hidden');
                        }, 300);
                    }
                });
                
                // Notification
                showNotification(`Filtre "${this.textContent.trim()}" appliqué`);
            });
        });
    }
    
    // =============================================
    // ANIMATION DES COMPÉTENCES
    // =============================================
    
    const skillProgresses = document.querySelectorAll('.skill-progress');
    
    function animateSkills() {
        skillProgresses.forEach(progress => {
            const width = progress.getAttribute('data-width');
            progress.style.width = `${width}%`;
        });
    }
    
    // Observer pour animer les compétences quand elles sont visibles
    const competencesSection = document.getElementById('competences');
    if (competencesSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkills();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(competencesSection);
    }
    
    // =============================================
    // ANIMATION DES STATISTIQUES
    // =============================================
    
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateNumbers() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000; // 2 secondes
            const step = target / (duration / 16); // 60fps
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 16);
        });
    }
    
    // Animer les statistiques quand la section hero est visible
    const heroSection = document.getElementById('accueil');
    if (heroSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(heroSection);
    }
    
    // =============================================
    // FORMULAIRE DE CONTACT
    // =============================================
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les données du formulaire
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validation simple
            if (!data.name || !data.email || !data.subject || !data.message) {
                showNotification('Veuillez remplir tous les champs obligatoires', 'error');
                return;
            }
            
            // Simuler l'envoi (remplacer par une vraie requête AJAX)
            console.log('Données du formulaire:', data);
            
            // Afficher la notification
            showNotification('Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.');
            
            // Réinitialiser le formulaire
            this.reset();
            
            // Animation
            this.style.transform = 'scale(0.99)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 300);
        });
    }
    
    // =============================================
    // BOUTONS DE COPIE
    // =============================================
    
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-text');
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Changer temporairement le texte du bouton
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Copié !';
                
                showNotification('Texte copié dans le presse-papier');
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Erreur lors de la copie:', err);
                showNotification('Erreur lors de la copie', 'error');
            });
        });
    });
    
    // =============================================
    // EFFETS HOVER AVANCÉS
    // =============================================
    
    // Effet sur les cartes de service
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 20px 40px rgba(37, 99, 235, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow-md)';
        });
    });
    
    // Effet sur les projets
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const overlay = this.querySelector('.portfolio-overlay');
            const img = this.querySelector('img');
            
            if (overlay) overlay.style.opacity = '1';
            if (img) img.style.transform = 'scale(1.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            const overlay = this.querySelector('.portfolio-overlay');
            const img = this.querySelector('img');
            
            if (overlay) overlay.style.opacity = '0';
            if (img) img.style.transform = 'scale(1)';
        });
    });
    
    // =============================================
    // GESTION DU REDIMENSIONNEMENT
    // =============================================
    
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Fermer le menu mobile si on passe en desktop
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (menuBtn) {
                    menuBtn.classList.remove('active');
                    menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        }, 250);
    });
    
    // =============================================
    // SYSTEME DE NOTIFICATIONS
    // =============================================
    
    window.showNotification = function(message, type = 'success') {
        const notification = document.getElementById('notification');
        if (!notification) return;
        
        notification.textContent = message;
        notification.className = 'notification show';
        notification.classList.add(type);
        
        // Ajouter un bouton de fermeture
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: inherit;
            font-size: 1.5rem;
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
        });
        
        notification.appendChild(closeBtn);
        
        // Masquer automatiquement après 5 secondes
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.contains(closeBtn)) {
                    notification.removeChild(closeBtn);
                }
            }, 300);
        }, 5000);
    };
    
    // =============================================
    // PRELOADER ET ANIMATIONS INITIALES
    // =============================================
    
    // Ajouter la classe loaded au body
    setTimeout(() => {
        document.body.classList.add('loaded');
        
        // Animer les éléments initiaux
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.animation = 'fadeInUp 1s ease';
        }
    }, 100);
    
    // =============================================
    // EFFETS SONORES OPTIONNELS
    // =============================================
    
    // Décommenter pour ajouter des effets sonores
    /*
    const clickSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3');
    const hoverSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-hover-notification-757.mp3');
    
    clickSound.volume = 0.3;
    hoverSound.volume = 0.2;
    
    // Ajouter les sons aux interactions
    document.querySelectorAll('button, a, .service-card, .portfolio-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            hoverSound.currentTime = 0;
            hoverSound.play().catch(() => {});
        });
        
        el.addEventListener('click', () => {
            clickSound.currentTime = 0;
            clickSound.play().catch(() => {});
        });
    });
    */
    
    // =============================================
    // FONCTIONNALITÉS AVANCÉES
    // =============================================
    
    // Partage de page
    const shareButtons = document.querySelectorAll('[data-share]');
    shareButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            try {
                await navigator.share({
                    title: document.title,
                    text: 'Découvrez mon portfolio de développement web et design',
                    url: window.location.href
                });
                showNotification('Page partagée avec succès !');
            } catch (err) {
                // Fallback : copier le lien
                navigator.clipboard.writeText(window.location.href);
                showNotification('Lien copié dans le presse-papier');
            }
        });
    });
    
    // Mode plein écran
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    fullscreenBtn.style.cssText = `
        position: fixed;
        bottom: 6rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #2563eb, #7c3aed);
        border: none;
        border-radius: 50%;
        color: white;
        cursor: pointer;
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
        transition: all 0.3s ease;
    `;
    
    fullscreenBtn.addEventListener('mouseenter', () => {
        fullscreenBtn.style.transform = 'scale(1.1)';
    });
    
    fullscreenBtn.addEventListener('mouseleave', () => {
        fullscreenBtn.style.transform = 'scale(1)';
    });
    
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Erreur fullscreen: ${err.message}`);
            });
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            document.exitFullscreen();
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    });
    
    // Ajouter le bouton au DOM (optionnel)
    // document.body.appendChild(fullscreenBtn);
});

// =============================================
// FONCTIONS UTILITAIRES GLOBALES
// =============================================

// Formater les nombres
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Générer un identifiant unique
function generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
}

// Détecter le type d'appareil
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Détecter la connexion Internet
function isOnline() {
    return navigator.onLine;
}

// Gestionnaire d'erreurs global
window.addEventListener('error', function(e) {
    console.error('Erreur globale:', e.error);
    showNotification('Une erreur est survenue', 'error');
});

// =============================================
// POLYFILLS ET FALLBACKS
// =============================================

// Smooth scroll polyfill
if (!('scrollBehavior' in document.documentElement.style)) {
    import('https://cdn.jsdelivr.net/npm/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js')
        .then(() => {
            console.log('Polyfill smoothscroll chargé');
        })
        .catch(err => {
            console.warn('Impossible de charger le polyfill smoothscroll:', err);
        });
}

// Intersection Observer polyfill pour les vieux navigateurs
if (!('IntersectionObserver' in window)) {
    console.warn('IntersectionObserver non supporté');
}

// =============================================
// PERFORMANCE ET ANALYTIQUES
// =============================================

// Mesurer les performances
if ('performance' in window) {
    window.addEventListener('load', () => {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`Temps de chargement: ${loadTime}ms`);
        
        if (loadTime > 3000) {
            console.warn('Temps de chargement élevé, envisagez des optimisations');
        }
    });
}

// Suivi des interactions (basique)
document.addEventListener('click', function(e) {
    const target = e.target;
    const tagName = target.tagName.toLowerCase();
    const className = target.className;
    
    // Loguer les interactions importantes
    if (tagName === 'button' || tagName === 'a' || className.includes('btn')) {
        console.log(`Interaction avec: ${target.textContent.trim() || className}`);
    }
});
