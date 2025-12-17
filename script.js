// script.js - Fonctionnalités interactives pour le site Sl03A

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // 1. MENU MOBILE
    // ============================================
    
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Fermer le menu en cliquant sur un lien
        document.querySelectorAll('.nav-list a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
    
    // ============================================
    // 2. BACK TO TOP BUTTON
    // ============================================
    
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ============================================
    // 3. ANIMATION AU SCROLL
    // ============================================
    
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.service-card, .portfolio-card, .testimonial-card, .process-step');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initialiser l'opacité et la position
    document.querySelectorAll('.service-card, .portfolio-card, .testimonial-card, .process-step').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Appel initial
    
    // ============================================
    // 4. FORMULAIRE DE CONTACT
    // ============================================
    
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validation basique
            const requiredFields = contactForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#ef476f';
                    isValid = false;
                    
                    // Réinitialiser la couleur après 2 secondes
                    setTimeout(() => {
                        field.style.borderColor = '';
                    }, 2000);
                }
            });
            
            if (!isValid) {
                showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
                return;
            }
            
            // Simuler l'envoi
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            submitBtn.disabled = true;
            
            // Simulation d'un délai d'envoi
            setTimeout(() => {
                showNotification('Votre message a été envoyé avec succès ! Je vous répondrai dans les 24h.', 'success');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Scroll vers le haut du formulaire
                contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 1500);
        });
        
        // Réinitialiser les bordures lors de la saisie
        contactForm.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', function() {
                this.style.borderColor = '';
            });
        });
    }
    
    // ============================================
    // 5. NOTIFICATIONS
    // ============================================
    
    function showNotification(message, type = 'info') {
        // Créer la notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Styles pour la notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4cc9f0' : type === 'error' ? '#ef476f' : '#4361ee'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;
        
        // Ajouter les styles d'animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                flex: 1;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 1rem;
                padding: 0.25rem;
            }
        `;
        document.head.appendChild(style);
        
        // Ajouter au body
        document.body.appendChild(notification);
        
        // Fermer la notification
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', function() {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Auto-fermer après 5 secondes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // ============================================
    // 6. COMPTEUR ANIMÉ
    // ============================================
    
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16); // 60fps
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start) + '+';
            }
        }, 16);
    }
    
    // Démarrer les compteurs lorsqu'ils sont visibles
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target.querySelector('.stat-number');
                if (counter && !counter.classList.contains('animated')) {
                    const target = parseInt(counter.textContent);
                    animateCounter(counter, target);
                    counter.classList.add('animated');
                }
            }
        });
    }, { threshold: 0.5 });
    
    // Observer les sections avec des statistiques
    document.querySelectorAll('.hero-stats').forEach(stats => {
        observer.observe(stats);
    });
    
    // ============================================
    // 7. PRELOADER SIMPLE
    // ============================================
    
    window.addEventListener('load', function() {
        const preloader = document.createElement('div');
        preloader.id = 'preloader';
        preloader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #4361ee, #7209b7);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.5s ease;
        `;
        
        preloader.innerHTML = `
            <div class="spinner">
                <div style="
                    width: 60px;
                    height: 60px;
                    border: 5px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                "></div>
                <h2 style="color: white; margin-top: 20px; font-family: Montserrat, sans-serif;">Sl03A Services</h2>
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(preloader);
        
        // Masquer le preloader
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                if (preloader.parentNode) {
                    preloader.remove();
                }
            }, 500);
        }, 1000);
    });
    
    // ============================================
    // 8. ACTIVE NAV LINK ON SCROLL
    // ============================================
    
    const sections = document.querySelectorAll('section[id]');
    
    function activateNavLinkOnScroll() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector(`.nav-list a[href*="${sectionId}"]`)?.classList.add('active');
            } else {
                document.querySelector(`.nav-list a[href*="${sectionId}"]`)?.classList.remove('active');
            }
        });
    }
    
    window.addEventListener('scroll', activateNavLinkOnScroll);
    
    // ============================================
    // 9. COPYRIGHT YEAR AUTO-UPDATE
    // ============================================
    
    const yearSpans = document.querySelectorAll('.footer-copyright p');
    const currentYear = new Date().getFullYear();
    
    yearSpans.forEach(span => {
        if (span.textContent.includes('2024')) {
            span.textContent = span.textContent.replace('2024', currentYear);
        }
    });
    
    // ============================================
    // 10. SERVICE CARDS HOVER EFFECT
    // ============================================
    
    const serviceCards = document.querySelectorAll('.service-card, .package-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
});

// ============================================
// FONCTIONS GLOBALES UTILITAIRES
// ============================================

// Debounce function pour optimiser les événements scroll/resize
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Formater les prix
function formatPrice(price, currency = '€') {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(price);
}

// Détection du thème système (dark/light mode)
function detectColorScheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

// Initialiser la détection de thème
detectColorScheme();

// Écouter les changements de thème
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', detectColorScheme);

// Initialiser les tooltips
function initTooltips() {
    const tooltips = document.querySelectorAll('[title]');
    
    tooltips.forEach(el => {
        el.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('title');
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.cssText = `
                position: fixed;
                top: ${rect.top - tooltip.offsetHeight - 10}px;
                left: ${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px;
                background: var(--dark);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 6px;
                font-size: 0.9rem;
                z-index: 9999;
                pointer-events: none;
            `;
            
            this._tooltip = tooltip;
        });
        
        el.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                this._tooltip.remove();
                this._tooltip = null;
            }
        });
    });
}

// Lazy loading des images
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Ajouter la classe "loaded" au body quand tout est chargé
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    initTooltips();
    initLazyLoading();
});

// Exporter les fonctions globales si besoin
window.Sl03A = {
    showNotification,
    formatPrice,
    debounce
};