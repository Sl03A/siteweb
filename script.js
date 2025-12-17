// =============================================
// INITIALISATION & CONFIGURATION
// =============================================

// État global de l'application
const AppState = {
    currentStep: 1,
    selectedService: null,
    selectedServiceName: '',
    selectedServicePrice: 0,
    orderData: {},
    cartItems: 0,
    isChatOpen: false,
    theme: 'light'
};

// Initialiser l'application
document.addEventListener('DOMContentLoaded', function() {
    console.log('%c✨ Slozw - Créations Digitales ✨', 'color: #6366f1; font-size: 18px; font-weight: bold;');
    console.log('%cSite premium chargé avec succès', 'color: #8b5cf6; font-size: 14px;');
    
    initApplication();
    initCanvas();
    initEventListeners();
    initAnimations();
    initTheme();
    
    // Cacher le preloader
    setTimeout(() => {
        document.querySelector('.preloader').classList.add('fade-out');
        setTimeout(() => {
            document.querySelector('.preloader').style.display = 'none';
        }, 500);
    }, 1000);
});

// =============================================
// INITIALISATION DE L'APPLICATION
// =============================================

function initApplication() {
    // Mettre à jour l'année dans le footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Initialiser les compteurs
    initCounters();
    
    // Initialiser les filtres du portfolio
    initPortfolioFilters();
    
    // Initialiser le système de commande
    initOrderSystem();
    
    // Initialiser le chat
    initChat();
}

// =============================================
// CANVAS PARTICULES (EFFET VISUEL)
// =============================================

function initCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    // Créer les particules
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25,
            color: `rgba(99, 102, 241, ${Math.random() * 0.3 + 0.1})`
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dessiner les particules
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            
            // Mettre à jour la position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Rebondir sur les bords
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.y > canvas.height) particle.y = 0;
            if (particle.y < 0) particle.y = canvas.height;
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Redimensionner le canvas
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// =============================================
// GESTION DU THÈME
// =============================================

function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Charger le thème sauvegardé
    const savedTheme = localStorage.getItem('slozw-theme');
    if (savedTheme) {
        AppState.theme = savedTheme;
        applyTheme(savedTheme);
    } else if (prefersDarkScheme.matches) {
        AppState.theme = 'dark';
        applyTheme('dark');
    }
    
    // Gérer le bouton de changement de thème
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    AppState.theme = AppState.theme === 'light' ? 'dark' : 'light';
    applyTheme(AppState.theme);
    
    // Animation du bouton
    const btn = event.currentTarget;
    btn.style.transform = 'scale(0.8) rotate(180deg)';
    setTimeout(() => {
        btn.style.transform = 'scale(1) rotate(0)';
    }, 300);
    
    showNotification(`Thème ${AppState.theme === 'dark' ? 'sombre' : 'clair'} activé`);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('slozw-theme', theme);
    
    // Mettre à jour l'icône
    const themeToggle = document.querySelector('.theme-toggle i');
    if (themeToggle) {
        themeToggle.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// =============================================
// NAVIGATION & MENU MOBILE
// =============================================

function initEventListeners() {
    // Menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Fermer le menu au clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
            
            // Mettre à jour le lien actif
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Navigation au scroll
    window.addEventListener('scroll', handleScroll);
    
    // Retour en haut
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', scrollToTop);
    }
    
    // Boutons WhatsApp
    const whatsappBtn = document.querySelector('.floating-btn.whatsapp');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            window.open('https://wa.me/33123456789', '_blank');
        });
    }
}

function handleScroll() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Bouton retour en haut
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
    
    // Animation des éléments au scroll
    animateOnScroll();
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function scrollToSection(sectionId) {
    const section = document.querySelector(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// =============================================
// ANIMATIONS & EFFETS
// =============================================

function initAnimations() {
    // Observer pour les animations au scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });
    
    // Observer les éléments à animer
    document.querySelectorAll('.service-card, .portfolio-item, .contact-card, .stat-card').forEach(el => {
        observer.observe(el);
    });
    
    // Animer les chiffres
    animateCounters();
}

function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .portfolio-item');
    const windowHeight = window.innerHeight;
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            element.classList.add('animate');
        }
    });
}

function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        counter.textContent = '0';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(counter, target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 20);
}

// =============================================
// PORTFOLIO & FILTRES
// =============================================

function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Mettre à jour les boutons actifs
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Animation du bouton
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Filtrer les éléments
            const filter = this.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                const categories = item.getAttribute('data-category').split(' ');
                
                if (filter === 'all' || categories.includes(filter)) {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                    item.style.pointerEvents = 'auto';
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    item.style.pointerEvents = 'none';
                }
            });
            
            showNotification(`Filtre "${this.textContent}" appliqué`);
        });
    });
}

// =============================================
// SYSTÈME DE COMMANDE
// =============================================

function initOrderSystem() {
    // Initialiser les étapes
    updateStepIndicator();
    
    // Initialiser le panier
    updateCart();
}

function selectService(serviceType) {
    showNotification('Service ajouté au panier !');
    updateCart(1);
    
    // Rediriger vers le formulaire de commande
    scrollToSection('#commande');
    
    // Sélectionner automatiquement le service
    setTimeout(() => {
        let serviceName, servicePrice;
        switch(serviceType) {
            case 'design':
                serviceName = 'UI/UX Design Élégant';
                servicePrice = 499;
                break;
            case 'dev':
                serviceName = 'Développement Web Avancé';
                servicePrice = 899;
                break;
            case 'ecommerce':
                serviceName = 'E-commerce Premium';
                servicePrice = 1499;
                break;
        }
        
        selectOrderService(serviceType, serviceName, servicePrice);
    }, 500);
}

function orderProject(projectName) {
    showNotification('Projet ajouté à la commande !');
    updateCart(1);
    
    // Rediriger vers le formulaire de commande
    scrollToSection('#commande');
    
    // Pré-remplir avec le projet
    setTimeout(() => {
        document.getElementById('projectName').value = projectName;
        document.getElementById('projectDescription').value = `Je souhaite commander un projet similaire à "${projectName}"`;
    }, 500);
}

function selectOrderService(service, name, price) {
    AppState.selectedService = service;
    AppState.selectedServiceName = name;
    AppState.selectedServicePrice = price;
    
    // Mettre à jour l'affichage
    const selectedText = document.getElementById('selectedServiceText');
    const selectedSummary = document.getElementById('selectedSummary');
    
    if (selectedText) {
        selectedText.textContent = `${name} - ${price}€`;
    }
    
    if (selectedSummary) {
        selectedSummary.style.display = 'block';
    }
    
    // Mettre en surbrillance l'option sélectionnée
    document.querySelectorAll('.service-option').forEach(option => {
        option.classList.remove('selected');
        if (option.getAttribute('data-service') === service) {
            option.classList.add('selected');
        }
    });
}

function nextStep() {
    // Validation de l'étape actuelle
    if (AppState.currentStep === 1 && !AppState.selectedService) {
        showNotification('Veuillez sélectionner un service', 'error');
        return;
    }
    
    if (AppState.currentStep === 2) {
        const projectName = document.getElementById('projectName').value;
        const projectDesc = document.getElementById('projectDescription').value;
        
        if (!projectName || !projectDesc) {
            showNotification('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }
    }
    
    if (AppState.currentStep === 3) {
        const clientName = document.getElementById('clientName').value;
        const clientEmail = document.getElementById('clientEmail').value;
        const acceptTerms = document.getElementById('acceptTerms').checked;
        
        if (!clientName || !clientEmail) {
            showNotification('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }
        
        if (!acceptTerms) {
            showNotification('Veuillez accepter les conditions générales', 'error');
            return;
        }
    }
    
    // Passer à l'étape suivante
    document.querySelectorAll('.step-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    
    AppState.currentStep++;
    
    document.getElementById(`step${AppState.currentStep}`).classList.add('active');
    document.querySelector(`.step[data-step="${AppState.currentStep}"]`).classList.add('active');
    
    // Mettre à jour l'indicateur d'étapes
    updateStepIndicator();
    
    // Scroll vers le haut de la section
    const stepPanel = document.getElementById(`step${AppState.currentStep}`);
    stepPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function prevStep() {
    document.querySelectorAll('.step-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    
    AppState.currentStep--;
    
    document.getElementById(`step${AppState.currentStep}`).classList.add('active');
    document.querySelector(`.step[data-step="${AppState.currentStep}"]`).classList.add('active');
    
    updateStepIndicator();
}

function updateStepIndicator() {
    document.querySelectorAll('.step').forEach((step, index) => {
        if (index + 1 <= AppState.currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

function submitOrder() {
    // Collecter toutes les données
    const projectName = document.getElementById('projectName').value;
    const projectDesc = document.getElementById('projectDescription').value;
    const projectType = document.getElementById('projectType').value;
    const projectDeadline = document.getElementById('projectDeadline').value;
    const projectBudget = document.getElementById('projectBudget').value;
    const clientName = document.getElementById('clientName').value;
    const clientEmail = document.getElementById('clientEmail').value;
    const clientPhone = document.getElementById('clientPhone').value;
    const clientCompany = document.getElementById('clientCompany').value;
    const additionalInfo = document.getElementById('additionalInfo').value;
    
    // Créer l'objet commande
    AppState.orderData = {
        service: {
            type: AppState.selectedService,
            name: AppState.selectedServiceName,
            price: AppState.selectedServicePrice
        },
        project: {
            name: projectName,
            description: projectDesc,
            type: projectType,
            deadline: projectDeadline,
            budget: projectBudget
        },
        client: {
            name: clientName,
            email: clientEmail,
            phone: clientPhone,
            company: clientCompany,
            additionalInfo: additionalInfo
        },
        date: new Date().toLocaleString('fr-FR'),
        reference: 'SLZW-' + Date.now()
    };
    
    // Afficher le récapitulatif
    const summaryDiv = document.getElementById('orderSummary');
    if (summaryDiv) {
        summaryDiv.innerHTML = `
            <div class="summary-item">
                <strong>Référence :</strong>
                <span>${AppState.orderData.reference}</span>
            </div>
            <div class="summary-item">
                <strong>Service :</strong>
                <span>${AppState.selectedServiceName}</span>
            </div>
            <div class="summary-item">
                <strong>Montant :</strong>
                <span>${AppState.selectedServicePrice}€</span>
            </div>
            <div class="summary-item">
                <strong>Projet :</strong>
                <span>${projectName}</span>
            </div>
            <div class="summary-item">
                <strong>Client :</strong>
                <span>${clientName}</span>
            </div>
            <div class="summary-item">
                <strong>Date :</strong>
                <span>${new Date().toLocaleDateString('fr-FR')}</span>
            </div>
        `;
    }
    
    // Simuler l'envoi de la commande
    console.log('Commande soumise :', AppState.orderData);
    
    // Passer à l'étape de confirmation
    nextStep();
    
    // Réinitialiser le panier
    updateCart(0);
    
    // Envoyer une notification
    showNotification('Commande confirmée ! Je vous contacte dans les 24h.');
    
    // Simulation d'envoi d'email
    setTimeout(() => {
        showNotification('Email de confirmation envoyé à ' + clientEmail);
    }, 1500);
}

function resetOrder() {
    // Réinitialiser l'état
    AppState.currentStep = 1;
    AppState.selectedService = null;
    AppState.selectedServiceName = '';
    AppState.selectedServicePrice = 0;
    AppState.orderData = {};
    
    // Réinitialiser le formulaire
    document.getElementById('projectName').value = '';
    document.getElementById('projectDescription').value = '';
    document.getElementById('projectBudget').value = '';
    document.getElementById('clientName').value = '';
    document.getElementById('clientEmail').value = '';
    document.getElementById('clientPhone').value = '';
    document.getElementById('clientCompany').value = '';
    document.getElementById('additionalInfo').value = '';
    document.getElementById('acceptTerms').checked = false;
    
    // Réinitialiser l'affichage
    document.getElementById('selectedServiceText').textContent = 'Aucun service sélectionné';
    document.getElementById('selectedSummary').style.display = 'none';
    document.querySelectorAll('.service-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Retour à l'étape 1
    document.querySelectorAll('.step-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    
    document.getElementById('step1').classList.add('active');
    document.querySelector('.step[data-step="1"]').classList.add('active');
    
    updateStepIndicator();
}

// =============================================
// GESTION DU PANIER
// =============================================

function updateCart(count = null) {
    if (count !== null) {
        AppState.cartItems = count;
    }
    
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        cartBadge.textContent = AppState.cartItems;
        
        // Animation du badge
        if (AppState.cartItems > 0) {
            cartBadge.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartBadge.style.transform = 'scale(1)';
            }, 300);
        }
    }
}

// =============================================
// CHAT EN DIRECT
// =============================================

function initChat() {
    const chatWidget = document.getElementById('chatWidget');
    const chatHeader = document.querySelector('.chat-header');
    
    if (chatHeader) {
        chatHeader.addEventListener('click', toggleChat);
    }
    
    // Messages par défaut
    const messages = [
        "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
        "Je suis disponible pour répondre à vos questions sur nos services.",
        "Vous pouvez également commander directement via le formulaire.",
        "Réponse garantie sous 24 heures !"
    ];
    
    // Afficher un message toutes les 30 secondes
    let messageIndex = 0;
    setInterval(() => {
        if (!AppState.isChatOpen) {
            addBotMessage(messages[messageIndex]);
            messageIndex = (messageIndex + 1) % messages.length;
        }
    }, 30000);
}

function toggleChat() {
    AppState.isChatOpen = !AppState.isChatOpen;
    const chatWidget = document.getElementById('chatWidget');
    
    if (chatWidget) {
        chatWidget.classList.toggle('open');
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatMessage');
    const message = input.value.trim();
    
    if (message) {
        addUserMessage(message);
        input.value = '';
        
        // Réponse automatique après 1 seconde
        setTimeout(() => {
            const responses = [
                "Merci pour votre message ! Je vous réponds dans les plus brefs délais.",
                "Je note votre question et vous réponds rapidement.",
                "Très bonne question ! Je prépare une réponse détaillée.",
                "Je transfère votre demande à l'équipe concernée."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addBotMessage(randomResponse);
        }, 1000);
    }
}

function addUserMessage(text) {
    const messagesContainer = document.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user';
    messageDiv.innerHTML = `
        <div class="message-content">${text}</div>
        <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
    `;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addBotMessage(text) {
    const messagesContainer = document.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot';
    messageDiv.innerHTML = `
        <div class="message-content">${text}</div>
        <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
    `;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// =============================================
// NOTIFICATIONS
// =============================================

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    
    // Ajouter une icône
    let icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'warning') icon = 'fa-info-circle';
    
    notification.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    
    // Masquer automatiquement après 5 secondes
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// =============================================
// UTILITAIRES
// =============================================

function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Texte copié dans le presse-papier !');
    }).catch(err => {
        console.error('Erreur lors de la copie :', err);
        showNotification('Erreur lors de la copie', 'error');
    });
}

function openChat() {
    toggleChat();
    showNotification('Chat de support ouvert !');
}

// =============================================
// GESTION DES ERREURS
// =============================================

window.addEventListener('error', function(e) {
    console.error('Erreur globale :', e.error);
    showNotification('Une erreur est survenue', 'error');
});

// =============================================
// PERFORMANCE & ANALYTIQUES
// =============================================

if ('performance' in window) {
    window.addEventListener('load', () => {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`Temps de chargement : ${loadTime}ms`);
        
        if (loadTime > 3000) {
            console.warn('Temps de chargement élevé, optimisations nécessaires');
        }
    });
}

// =============================================
// POLYFILLS POUR LES VIEUX NAVIGATEURS
// =============================================

// Smooth scroll polyfill
if (!('scrollBehavior' in document.documentElement.style)) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js';
    document.head.appendChild(script);
}

// Intersection Observer polyfill
if (!('IntersectionObserver' in window)) {
    const script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
    document.head.appendChild(script);
}
