// Variables globales
let currentStep = 1;
let selectedService = null;
let selectedServiceName = '';
let selectedServicePrice = 0;
let orderData = {};

// Menu mobile
const menuBtn = document.querySelector('.menu-btn');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');

menuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuBtn.innerHTML = navMenu.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Fermer le menu au clic sur un lien
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Fonctions pour les commandes
function selectService(serviceType) {
    showNotification('Service ajouté au panier !');
    updateCartCount(1);
    
    // Rediriger vers le formulaire de commande
    window.location.href = '#commande';
    
    // Sélectionner automatiquement le service
    setTimeout(() => {
        selectOrderService(serviceType, 
            serviceType === 'design' ? 'Design de Site' : 
            serviceType === 'dev' ? 'Site Web Complet' : 'Boutique en Ligne',
            serviceType === 'design' ? 299 : 
            serviceType === 'dev' ? 599 : 899
        );
    }, 500);
}

function orderProject(projectName) {
    showNotification('Projet ajouté à la commande !');
    updateCartCount(1);
    
    // Rediriger vers le formulaire de commande
    window.location.href = '#commande';
    
    // Pré-remplir avec le projet
    setTimeout(() => {
        document.getElementById('projectName').value = projectName;
        document.getElementById('projectDesc').value = `Je souhaite commander un projet similaire à "${projectName}"`;
    }, 500);
}

function selectOrderService(service, name, price) {
    selectedService = service;
    selectedServiceName = name;
    selectedServicePrice = price;
    
    // Mettre en surbrillance la carte sélectionnée
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    // Afficher le service sélectionné
    const selectedDiv = document.getElementById('selectedService');
    selectedDiv.innerHTML = `
        <h5><i class="fas fa-check-circle" style="color: #10b981;"></i> Service sélectionné :</h5>
        <p><strong>${name}</strong> - ${price}€</p>
    `;
    selectedDiv.style.display = 'block';
}

function nextStep() {
    // Validation
    if (currentStep === 1 && !selectedService) {
        showNotification('Veuillez sélectionner un service', 'error');
        return;
    }
    
    if (currentStep === 2) {
        const projectName = document.getElementById('projectName').value;
        const projectDesc = document.getElementById('projectDesc').value;
        
        if (!projectName || !projectDesc) {
            showNotification('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }
    }
    
    if (currentStep === 3) {
        const clientName = document.getElementById('clientName').value;
        const clientEmail = document.getElementById('clientEmail').value;
        
        if (!clientName || !clientEmail) {
            showNotification('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }
    }
    
    // Passer à l'étape suivante
    document.getElementById(`step${currentStep}`).classList.remove('active');
    currentStep++;
    document.getElementById(`step${currentStep}`).classList.add('active');
    
    // Mettre à jour la navigation si besoin
    if (currentStep > 1) {
        window.scrollTo(0, document.getElementById('commande').offsetTop + 100);
    }
}

function prevStep() {
    document.getElementById(`step${currentStep}`).classList.remove('active');
    currentStep--;
    document.getElementById(`step${currentStep}`).classList.add('active');
}

function submitOrder() {
    // Collecter toutes les données
    const projectName = document.getElementById('projectName').value;
    const projectDesc = document.getElementById('projectDesc').value;
    const deadline = document.getElementById('deadline').value;
    const clientName = document.getElementById('clientName').value;
    const clientEmail = document.getElementById('clientEmail').value;
    const clientPhone = document.getElementById('clientPhone').value;
    const budget = document.getElementById('budget').value;
    
    // Créer l'objet commande
    orderData = {
        service: selectedService,
        serviceName: selectedServiceName,
        price: selectedServicePrice,
        project: {
            name: projectName,
            description: projectDesc,
            deadline: deadline + ' jours'
        },
        client: {
            name: clientName,
            email: clientEmail,
            phone: clientPhone,
            budget: budget
        },
        date: new Date().toLocaleString()
    };
    
    // Simuler l'envoi (remplacer par un vrai appel API)
    console.log('Commande envoyée:', orderData);
    
    // Afficher le récapitulatif
    const summaryDiv = document.getElementById('orderSummary');
    summaryDiv.innerHTML = `
        <p><strong>Service :</strong> ${selectedServiceName} (${selectedServicePrice}€)</p>
        <p><strong>Projet :</strong> ${projectName}</p>
        <p><strong>Client :</strong> ${clientName}</p>
        <p><strong>Email :</strong> ${clientEmail}</p>
        <p><strong>Date :</strong> ${new Date().toLocaleDateString()}</p>
    `;
    
    // Passer à l'étape de confirmation
    document.getElementById(`step${currentStep}`).classList.remove('active');
    currentStep++;
    document.getElementById(`step${currentStep}`).classList.add('active');
    
    // Réinitialiser le panier
    updateCartCount(0);
    
    // Envoyer une notification par email (simulation)
    setTimeout(() => {
        showNotification('Email de confirmation envoyé !');
    }, 1000);
}

function resetOrder() {
    // Réinitialiser le formulaire
    currentStep = 1;
    selectedService = null;
    selectedServiceName = '';
    selectedServicePrice = 0;
    orderData = {};
    
    // Réinitialiser les champs
    document.getElementById('projectName').value = '';
    document.getElementById('projectDesc').value = '';
    document.getElementById('clientName').value = '';
    document.getElementById('clientEmail').value = '';
    document.getElementById('clientPhone').value = '';
    document.getElementById('budget').value = '';
    document.getElementById('selectedService').innerHTML = '';
    document.getElementById('selectedService').style.display = 'none';
    
    // Désélectionner les options
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Retour à l'étape 1
    document.getElementById('step4').classList.remove('active');
    document.getElementById('step1').classList.add('active');
}

// Fonction utilitaire pour copier du texte
function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Texte copié dans le presse-papier !');
    });
}

// Mettre à jour le compteur du panier
function updateCartCount(count) {
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = count;
}

// Système de notifications
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = 'notification show';
    
    if (type === 'error') {
        notification.classList.add('error');
    }
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Bouton Retour en haut
const backToTopBtn = document.createElement('button');
backToTopBtn.className = 'back-to-top';
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Animation au scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 1s ease forwards';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .portfolio-item, .contact-item').forEach(el => {
    observer.observe(el);
});

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    console.log('Site Slozw - Système de commande chargé');
    updateCartCount(0);
});
