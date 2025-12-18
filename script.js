// Gestion du panier
let panier = JSON.parse(localStorage.getItem('panier')) || [];

// Mettre à jour le compteur du panier
function updatePanierCount() {
    const count = panier.reduce((total, item) => total + item.quantite, 0);
    const panierCounts = document.querySelectorAll('.panier-count');
    panierCounts.forEach(element => {
        element.textContent = count;
    });
}

// Ajouter au panier
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn-ajouter-panier') || e.target.closest('.btn-souscrire')) {
        const btn = e.target.closest('.btn-ajouter-panier, .btn-souscrire');
        const id = btn.dataset.id;
        const nom = btn.dataset.nom;
        const prix = parseInt(btn.dataset.prix);
        
        // Vérifier si le produit est déjà dans le panier
        const index = panier.findIndex(item => item.id === id);
        
        if (index > -1) {
            panier[index].quantite++;
        } else {
            panier.push({
                id: id,
                nom: nom,
                prix: prix,
                quantite: 1
            });
        }
        
        // Sauvegarder dans le localStorage
        localStorage.setItem('panier', JSON.stringify(panier));
        
        // Mettre à jour l'affichage
        updatePanierCount();
        showNotification(`${nom} ajouté au panier !`);
        
        // Ouvrir le panier automatiquement
        if (!window.location.pathname.includes('boutique')) {
            setTimeout(() => {
                document.getElementById('panierModal')?.classList.add('show');
                updatePanierDisplay();
            }, 500);
        }
    }
});

// Afficher le panier
document.addEventListener('click', function(e) {
    if (e.target.closest('.panier-btn')) {
        e.preventDefault();
        const modal = document.getElementById('panierModal');
        modal.classList.add('show');
        updatePanierDisplay();
    }
});

// Fermer le panier
document.querySelector('.close-panier')?.addEventListener('click', function() {
    document.getElementById('panierModal').classList.remove('show');
});

// Mettre à jour l'affichage du panier
function updatePanierDisplay() {
    const container = document.getElementById('panierItems');
    const totalElement = document.getElementById('totalPanier');
    
    if (!container) return;
    
    if (panier.length === 0) {
        container.innerHTML = `
            <div class="panier-vide">
                <i class="fas fa-shopping-basket"></i>
                <p>Votre panier est vide</p>
                <a href="boutique.html" class="btn btn-outline">Continuer vos achats</a>
            </div>
        `;
        if (totalElement) totalElement.textContent = '0€';
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
            <div>
                <h4>${item.nom}</h4>
                <p>${item.prix}€ × ${item.quantite}</p>
            </div>
            <div>
                <span>${itemTotal}€</span>
                <button class="btn-remove" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(div);
    });
    
    if (totalElement) totalElement.textContent = total + '€';
}

// Supprimer un article
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn-remove')) {
        const id = e.target.closest('.btn-remove').dataset.id;
        panier = panier.filter(item => item.id !== id);
        localStorage.setItem('panier', JSON.stringify(panier));
        updatePanierCount();
        updatePanierDisplay();
        showNotification('Article supprimé du panier');
    }
});

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
    
    document.getElementById('panierModal').classList.remove('show');
    document.getElementById('checkoutModal').classList.add('show');
    updateCheckoutSummary();
});

// Fermer le checkout
document.querySelector('.close-checkout')?.addEventListener('click', function() {
    document.getElementById('checkoutModal').classList.remove('show');
});

// Gestion des étapes du checkout
document.addEventListener('click', function(e) {
    // Boutons "Suivant"
    if (e.target.closest('.next-step')) {
        const nextStep = e.target.closest('.next-step').dataset.next;
        changeCheckoutStep(nextStep);
    }
    
    // Boutons "Retour"
    if (e.target.closest('.prev-step')) {
        const prevStep = e.target.closest('.prev-step').dataset.prev;
        changeCheckoutStep(prevStep);
    }
});

function changeCheckoutStep(stepNumber) {
    // Mettre à jour les étapes actives
    document.querySelectorAll('.checkout-steps .step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelector(`.checkout-steps .step[data-step="${stepNumber}"]`).classList.add('active');
    
    // Mettre à jour le contenu
    document.querySelectorAll('.checkout-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById(`step${stepNumber}`).classList.add('active');
    
    // Si on arrive à l'étape 3 (confirmation), générer la référence
    if (stepNumber === '3') {
        generateOrderReference();
    }
}

function updateCheckoutSummary() {
    const summaryContainer = document.getElementById('checkoutSummary');
    const totalElement = document.getElementById('checkoutTotal');
    
    if (!summaryContainer || !totalElement) return;
    
    let total = 0;
    summaryContainer.innerHTML = '';
    
    panier.forEach(item => {
        const itemTotal = item.prix * item.quantite;
        total += itemTotal;
        
        const div = document.createElement('div');
        div.style.marginBottom = '0.5rem';
        div.style.paddingBottom = '0.5rem';
        div.style.borderBottom = '1px solid #e2e8f0';
        div.innerHTML = `
            <div style="display: flex; justify-content: space-between;">
                <span>${item.nom} × ${item.quantite}</span>
                <span>${itemTotal}€</span>
            </div>
        `;
        summaryContainer.appendChild(div);
    });
    
    totalElement.textContent = total + '€';
}

function generateOrderReference() {
    const reference = 'SLZW-' + Date.now().toString().slice(-6);
    document.getElementById('orderReference').textContent = reference;
}

// Fermer le checkout et rediriger
document.getElementById('closeCheckout')?.addEventListener('click', function() {
    document.getElementById('checkoutModal').classList.remove('show');
    
    // Vider le panier après confirmation
    panier = [];
    localStorage.removeItem('panier');
    updatePanierCount();
    updatePanierDisplay();
    
    // Rediriger vers l'accueil
    window.location.href = 'index.html';
});

// Formulaire de contact
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Récupérer les données
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Validation simple
    if (!data.name || !data.email || !data.message) {
        showNotification('Veuillez remplir tous les champs obligatoires (*)', 'error');
        return;
    }
    
    // Simulation d'envoi
    console.log('Message de contact envoyé:', data);
    
    // Réinitialiser le formulaire
    this.reset();
    showNotification('Message envoyé avec succès ! Je vous réponds dans les 24h.');
});

// Copier le texte des boutons "Copier"
document.addEventListener('click', function(e) {
    if (e.target.closest('.copy-btn')) {
        const btn = e.target.closest('.copy-btn');
        const text = btn.dataset.text;
        
        navigator.clipboard.writeText(text)
            .then(() => {
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Copié !';
                btn.style.background = '#10b981';
                btn.style.color = 'white';
                btn.style.borderColor = '#10b981';
                
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                    btn.style.color = '';
                    btn.style.borderColor = '';
                }, 2000);
            })
            .catch(err => {
                console.error('Erreur de copie : ', err);
                showNotification('Erreur lors de la copie', 'error');
            });
    }
});

// Filtrage des projets (portfolio)
document.addEventListener('click', function(e) {
    if (e.target.closest('.filter-btn')) {
        const btn = e.target.closest('.filter-btn');
        const filter = btn.dataset.filter;
        
        // Mettre à jour les boutons actifs
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filtrer les projets
        document.querySelectorAll('.portfolio-item').forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }
});

// Filtrage des produits (boutique)
document.addEventListener('click', function(e) {
    if (e.target.closest('.category-btn')) {
        const btn = e.target.closest('.category-btn');
        const category = btn.dataset.category;
        
        // Mettre à jour les boutons actifs
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filtrer les produits
        document.querySelectorAll('.produit-card').forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
});

// Menu mobile
document.querySelector('.menu-toggle')?.addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Fermer le menu au clic sur un lien
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelector('.nav-links').classList.remove('active');
    });
});

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

// Fermer les modals en cliquant à l'extérieur
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('panier-modal')) {
        document.getElementById('panierModal').classList.remove('show');
    }
    if (e.target.classList.contains('checkout-modal')) {
        document.getElementById('checkoutModal').classList.remove('show');
    }
});

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', function() {
    updatePanierCount();
    
    // Appliquer les filtres par défaut
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const filterBtn = document.querySelector(`.filter-btn[data-filter="${hash}"]`) || 
                         document.querySelector(`.category-btn[data-category="${hash}"]`);
        if (filterBtn) filterBtn.click();
    }
});
