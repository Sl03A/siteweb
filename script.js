[file name]: script.js
[file content begin]
// =============================================
// GESTION DU PANIER - BOUTIQUE
// =============================================

let panier = JSON.parse(localStorage.getItem('panier')) || [];

// Mettre à jour le compteur du panier
function updatePanierCount() {
    const count = panier.reduce((total, item) => total + item.quantite, 0);
    document.querySelectorAll('.panier-count').forEach(el => {
        el.textContent = count;
    });
}

// Fonctions pour la boutique
function openPanierModal() {
    const modal = document.getElementById('panierModal');
    if (modal) {
        modal.classList.add('show');
        updatePanierDisplay();
        document.body.style.overflow = 'hidden';
    }
}

function closePanierModal() {
    const modal = document.getElementById('panierModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

function openCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        updateCheckoutSummary();
        generateOrderReference();
    }
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Mettre à jour l'affichage du panier
function updatePanierDisplay() {
    const container = document.getElementById('panierItems');
    const totalElement = document.getElementById('totalPanier');
    
    if (!container || !totalElement) return;
    
    if (panier.length === 0) {
        container.innerHTML = `
            <div class="panier-vide">
                <i class="fas fa-shopping-basket"></i>
                <p>Votre panier est vide</p>
                <a href="boutique.html" class="btn btn-outline">Continuer vos achats</a>
            </div>
        `;
        totalElement.textContent = '0€';
        return;
    }
    
    let total = 0;
    container.innerHTML = '';
    
    panier.forEach(item => {
        const itemTotal = item.prix * item.quantite;
        total += itemTotal;
        
        const div = document.createElement('div');
        div.className = 'panier-item';
        div.innerHTML = `
            <div class="panier-item-info">
                <h4>${item.nom}</h4>
                <p>${item.prix}€ × ${item.quantite}</p>
            </div>
            <div class="panier-item-actions">
                <span class="panier-item-total">${itemTotal}€</span>
                <button class="btn-remove" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(div);
    });
    
    totalElement.textContent = total.toFixed(2) + '€';
}

// Mettre à jour le récapitulatif du checkout
function updateCheckoutSummary() {
    const container = document.getElementById('checkoutSummary');
    const totalElement = document.getElementById('checkoutTotal');
    
    if (!container || !totalElement) return;
    
    if (panier.length === 0) {
        container.innerHTML = '<p>Aucun article dans le panier</p>';
        totalElement.textContent = '0€';
        return;
    }
    
    let total = 0;
    container.innerHTML = '';
    
    panier.forEach(item => {
        const itemTotal = item.prix * item.quantite;
        total += itemTotal;
        
        const div = document.createElement('div');
        div.className = 'checkout-item';
        div.innerHTML = `
            <span>${item.nom} (×${item.quantite})</span>
            <span>${itemTotal.toFixed(2)}€</span>
        `;
        container.appendChild(div);
    });
    
    totalElement.textContent = total.toFixed(2) + '€';
}

// Générer une référence de commande
function generateOrderReference() {
    const refElement = document.getElementById('orderReference');
    if (refElement) {
        const timestamp = new Date().getTime().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        refElement.textContent = `SLZW-${timestamp}${random}`;
    }
}

// Filtrer les produits par catégorie
function filterProducts(category) {
    const products = document.querySelectorAll('.produit-card');
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    // Mettre à jour les boutons actifs
    categoryBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    // Filtrer les produits
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Filtrer les projets portfolio
function filterPortfolio(filter) {
    const items = document.querySelectorAll('.portfolio-item');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Mettre à jour les boutons actifs
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    
    // Filtrer les projets
    items.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Gestion des étapes du checkout
function goToStep(stepNumber) {
    // Cacher toutes les étapes
    document.querySelectorAll('.checkout-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Montrer l'étape sélectionnée
    const stepElement = document.getElementById(`step${stepNumber}`);
    if (stepElement) {
        stepElement.classList.add('active');
    }
    
    // Mettre à jour les indicateurs d'étape
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
        if (parseInt(step.dataset.step) === stepNumber) {
            step.classList.add('active');
        }
    });
}

// Notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = 'notification';
    notification.classList.add(type, 'show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// =============================================
// ÉVÉNEMENTS ET INITIALISATION
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser le compteur du panier
    updatePanierCount();
    
    // Boutique - Filtrage par catégorie
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            filterProducts(this.dataset.category);
        });
    });
    
    // Portfolio - Filtrage
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            filterPortfolio(this.dataset.filter);
        });
    });
    
    // Ouvrir le panier
    document.querySelectorAll('.panier-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openPanierModal();
        });
    });
    
    // Fermer le panier
    document.querySelector('.close-panier')?.addEventListener('click', closePanierModal);
    
    // Fermer le checkout
    document.querySelector('.close-checkout')?.addEventListener('click', closeCheckoutModal);
    
    // Vider le panier
    document.getElementById('viderPanier')?.addEventListener('click', function() {
        panier = [];
        localStorage.removeItem('panier');
        updatePanierCount();
        updatePanierDisplay();
        showNotification('Panier vidé', 'success');
    });
    
    // Procéder au paiement
    document.getElementById('proceedCheckout')?.addEventListener('click', function() {
        if (panier.length === 0) {
            showNotification('Votre panier est vide', 'error');
            return;
        }
        closePanierModal();
        openCheckoutModal();
    });
    
    // Navigation des étapes du checkout
    document.querySelectorAll('.next-step').forEach(btn => {
        btn.addEventListener('click', function() {
            const nextStep = this.dataset.next;
            
            // Validation de l'étape 1
            if (nextStep === '2') {
                const name = document.getElementById('checkoutName');
                const email = document.getElementById('checkoutEmail');
                const phone = document.getElementById('checkoutPhone');
                
                if (!name.value || !email.value || !phone.value) {
                    showNotification('Veuillez remplir tous les champs obligatoires', 'error');
                    return;
                }
            }
            
            // Validation de l'étape 2
            if (nextStep === '3') {
                // Simuler le paiement
                setTimeout(() => {
                    // Enregistrer la commande
                    const order = {
                        date: new Date().toISOString(),
                        reference: document.getElementById('orderReference').textContent,
                        articles: [...panier],
                        total: panier.reduce((sum, item) => sum + (item.prix * item.quantite), 0),
                        client: {
                            name: document.getElementById('checkoutName').value,
                            email: document.getElementById('checkoutEmail').value,
                            phone: document.getElementById('checkoutPhone').value
                        }
                    };
                    
                    // Sauvegarder dans localStorage
                    localStorage.setItem('lastOrder', JSON.stringify(order));
                    
                    // Vider le panier
                    panier = [];
                    localStorage.removeItem('panier');
                    updatePanierCount();
                }, 500);
            }
            
            goToStep(parseInt(nextStep));
        });
    });
    
    document.querySelectorAll('.prev-step').forEach(btn => {
        btn.addEventListener('click', function() {
            const prevStep = this.dataset.prev;
            goToStep(parseInt(prevStep));
        });
    });
    
    // Fermer le checkout après confirmation
    document.getElementById('closeCheckout')?.addEventListener('click', function() {
        closeCheckoutModal();
        window.location.href = 'index.html';
    });
    
    // Retirer un article du panier
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-remove')) {
            const id = e.target.closest('.btn-remove').dataset.id;
            panier = panier.filter(item => item.id !== id);
            localStorage.setItem('panier', JSON.stringify(panier));
            updatePanierCount();
            updatePanierDisplay();
            updateCheckoutSummary();
            showNotification('Article supprimé du panier', 'success');
        }
    });
    
    // Fermer les modales en cliquant à l'extérieur
    document.querySelectorAll('.panier-modal, .checkout-modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                if (this.classList.contains('panier-modal')) {
                    closePanierModal();
                } else {
                    closeCheckoutModal();
                }
            }
        });
    });
    
    // Formulaire de contact
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les données
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validation simple
            if (!data.name || !data.email || !data.message) {
                showNotification('Veuillez remplir tous les champs obligatoires', 'error');
                return;
            }
            
            // Simulation d'envoi
            console.log('Message envoyé:', data);
            
            // Réinitialiser le formulaire
            this.reset();
            showNotification('Message envoyé avec succès ! Je vous réponds dans les 24h.', 'success');
        });
    }
    
    // Menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.querySelector('.nav-links').classList.toggle('active');
        });
    }
    
    // Fermer le menu au clic sur un lien
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            document.querySelector('.nav-links').classList.remove('active');
        });
    });
    
    // Copier les coordonnées
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.dataset.text;
            navigator.clipboard.writeText(text)
                .then(() => {
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i> Copié !';
                    setTimeout(() => {
                        this.innerHTML = originalText;
                    }, 2000);
                })
                .catch(err => {
                    console.error('Erreur de copie:', err);
                });
        });
    });
});
[file content end]
