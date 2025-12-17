// =============================================
// CONFIGURATION INITIALE
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio chargé avec succès !');
    
    // =============================================
    // MENU MOBILE ET NAVIGATION
    // =============================================
    const menuBtn = document.querySelector('.menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const navbar = document.querySelector('.navbar');
    
    // Toggle menu mobile
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
            
            // Animation du bouton
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }
    
    // Fermer le menu au clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Fermer le menu mobile s'il est ouvert
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (menuBtn) {
                    menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
            
            // Animation douce pour les ancres
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
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
                
                // Récupérer la catégorie à filtrer
                const filter = this.getAttribute('data-filter');
                
                // Filtrer les éléments du portfolio
                portfolioItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    
                    if (filter === 'all' || filter === category) {
                        // Afficher l'élément avec animation
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        }, 50);
                    } else {
                        // Masquer l'élément avec animation
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.9)';
                        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
                
                // Animation de réorganisation de la grille
                setTimeout(() => {
                    document.querySelector('.portfolio-grid').style.transform = 'translateY(5px)';
                    setTimeout(() => {
                        document.querySelector('.portfolio-grid').style.transform = 'translateY(0)';
                    }, 100);
                }, 50);
            });
        });
    }
    
    // =============================================
    // BOUTON RETOUR EN HAUT
    // =============================================
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        // Afficher/masquer le bouton au scroll
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 500) {
                backToTopBtn.classList.add('visible');
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.visibility = 'visible';
                backToTopBtn.style.transform = 'translateY(0)';
            } else {
                backToTopBtn.classList.remove('visible');
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.visibility = 'hidden';
                backToTopBtn.style.transform = 'translateY(10px)';
            }
        });
        
        // Fonction de retour en haut
        backToTopBtn.addEventListener('click', function() {
            // Animation du bouton
            this.style.transform = 'scale(0.9)';
            
            // Scroll doux vers le haut
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Réinitialiser l'animation
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 300);
        });
    }
    
    // =============================================
    // ANIMATIONS AU SCROLL
    // =============================================
    const animateOnScroll = function() {
        const elements = document.querySelectorAll(
            '.service-card, .portfolio-item, .contact-item, .section-title, .section-subtitle'
        );
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                if (!element.classList.contains('animated')) {
                    element.classList.add('animated');
                    element.style.animation = 'fadeInUp 0.8s ease forwards';
                    
                    // Délai progressif pour les éléments en grille
                    if (element.classList.contains('service-card') || 
                        element.classList.contains('portfolio-item')) {
                        const index = Array.from(elements).indexOf(element);
                        element.style.animationDelay = `${(index % 4) * 0.1}s`;
                    }
                }
            }
        });
    };
    
    // Initialiser les animations
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Exécuter une fois au chargement
    
    // =============================================
    // NAVBAR DYNAMIQUE AU SCROLL
    // =============================================
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
            navbar.style.padding = '0.5rem 0';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            navbar.style.padding = '1rem 0';
        }
    });
    
    // =============================================
    // HOVER EFFECTS AVANCÉS
    // =============================================
    // Effet sur les cartes de service
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(37, 99, 235, 0.2)';
            
            // Animation de l'icône
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'rotate(10deg) scale(1.1)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.08)';
            
            // Réinitialiser l'icône
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'rotate(0) scale(1)';
            }
        });
    });
    
    // Effet sur les projets portfolio
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
    // ANIMATION DES CHIFFRES (POUR EXTENSION FUTURE)
    // =============================================
    const animateNumbers = function() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.innerText = Math.ceil(current);
                    setTimeout(updateCounter, 20);
                } else {
                    counter.innerText = target;
                }
            };
            
            updateCounter();
        });
    };
    
    // Observer pour l'animation des chiffres (si ajoutés plus tard)
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
    
    // =============================================
    // PRELOADER SIMPLE (OPTIONNEL)
    // =============================================
    window.addEventListener('load', function() {
        // Simuler un temps de chargement
        setTimeout(() => {
            document.body.classList.add('loaded');
            
            // Supprimer le preloader si présent
            const preloader = document.querySelector('.preloader');
            if (preloader) {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                setTimeout(() => {
                    preloader.remove();
                }, 500);
            }
        }, 500);
    });
    
    // =============================================
    // GESTION DU RESIZE
    // =============================================
    let resizeTimer;
    window.addEventListener('resize', function() {
        // Désactiver les transitions pendant le resize
        document.body.classList.add('resize-active');
        
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove('resize-active');
            
            // Réinitialiser le menu mobile si on passe en desktop
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (menuBtn) {
                    menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        }, 250);
    });
    
    // =============================================
    // EFFETS SONORES (OPTIONNEL - COMMENTÉ)
    // =============================================
    /*
    const hoverSound = new Audio('hover-sound.mp3');
    const clickSound = new Audio('click-sound.mp3');
    
    // Configurer les sons
    hoverSound.volume = 0.1;
    clickSound.volume = 0.2;
    
    // Ajouter les sons aux interactions
    document.querySelectorAll('button, a, .service-card, .portfolio-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            hoverSound.currentTime = 0;
            hoverSound.play().catch(e => console.log("Audio non chargé"));
        });
        
        el.addEventListener('click', () => {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log("Audio non chargé"));
        });
    });
    */
    
    // =============================================
    // THEME SWITCHER (POUR EXTENSION FUTURE)
    // =============================================
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            this.innerHTML = document.body.classList.contains('dark-mode')
                ? '<i class="fas fa-sun"></i>'
                : '<i class="fas fa-moon"></i>';
            
            // Sauvegarder la préférence
            localStorage.setItem('theme', 
                document.body.classList.contains('dark-mode') ? 'dark' : 'light'
            );
        });
        
        // Charger le thème sauvegardé
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
        }
    }
    
    // =============================================
    // CONSOLE LOG STYLÉ (POUR LE FUN)
    // =============================================
    console.log('%c✨ Portfolio Prêt! ✨', 
        'color: #2563eb; font-size: 18px; font-weight: bold;');
    console.log('%cDéveloppé avec passion ❤️', 
        'color: #7c3aed; font-size: 14px;');
});

// =============================================
// FONCTIONS UTILITAIRES
// =============================================

// Fonction pour copier l'email (extension future)
function copyEmail() {
    const email = 'contact@monportfolio.com';
    navigator.clipboard.writeText(email).then(() => {
        alert('Email copié dans le presse-papier !');
    });
}

// Fonction pour partager le portfolio
function sharePortfolio() {
    if (navigator.share) {
        navigator.share({
            title: 'Mon Portfolio',
            text: 'Découvrez mon portfolio de création web',
            url: window.location.href
        });
    } else {
        // Fallback pour les navigateurs qui ne supportent pas l'API Share
        alert('Partagez ce lien : ' + window.location.href);
    }
}

// Fonction pour afficher une notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// =============================================
// AJOUT DE STYLES DYNAMIQUES POUR LES NOTIFICATIONS
// =============================================
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification button {
        background: transparent;
        border: none;
        color: white;
        font-size: 20px;
        margin-left: 15px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.3s;
    }
    
    .notification button:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .resize-active * {
        transition: none !important;
    }
`;
document.head.appendChild(notificationStyles);
