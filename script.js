[file name]: script.js
[file content begin]
// =============================================
// GESTION DU POPUP COOKIES (Nouveau système)
// =============================================

// Fonction pour initialiser le popup de cookies
function initCookiePopup() {
    const cookiePopup = document.getElementById('cookiePopup');
    const cookieAccept = document.getElementById('cookiePopupAccept');
    const cookieReject = document.getElementById('cookiePopupReject');
    const cookieClose = document.getElementById('cookiePopupClose');
    
    if (!cookiePopup || !cookieAccept || !cookieReject || !cookieClose) {
        return; // Le popup n'existe pas sur cette page
    }
    
    // Vérifier si l'utilisateur a déjà répondu
    const cookieChoice = localStorage.getItem('cookieChoice');
    
    if (!cookieChoice) {
        // Afficher le popup après 1 seconde
        setTimeout(() => {
            cookiePopup.classList.add('show');
        }, 1000);
    } else {
        // Masquer le popup si déjà répondu
        cookiePopup.style.display = 'none';
    }
    
    // Accepter les cookies
    cookieAccept.addEventListener('click', function() {
        localStorage.setItem('cookieChoice', 'accepted');
        cookiePopup.classList.remove('show');
        cookiePopup.classList.add('hide');
        
        // Masquer complètement après l'animation
        setTimeout(() => {
            cookiePopup.style.display = 'none';
        }, 500);
        
        // Notification
        showNotification('Préférences de cookies enregistrées', 'success');
    });
    
    // Refuser les cookies
    cookieReject.addEventListener('click', function() {
        localStorage.setItem('cookieChoice', 'rejected');
        cookiePopup.classList.remove('show');
        cookiePopup.classList.add('hide');
        
        // Masquer complètement après l'animation
        setTimeout(() => {
            cookiePopup.style.display = 'none';
        }, 500);
        
        // Notification
        showNotification('Préférences de cookies enregistrées', 'success');
    });
    
    // Fermer le popup (sans choix)
    cookieClose.addEventListener('click', function() {
        cookiePopup.classList.remove('show');
        cookiePopup.classList.add('hide');
        
        setTimeout(() => {
            cookiePopup.style.display = 'none';
        }, 500);
        
        // Si l'utilisateur ferme sans répondre, on considère qu'il a refusé
        if (!cookieChoice) {
            localStorage.setItem('cookieChoice', 'closed');
        }
    });
}

// Fonction pour réinitialiser les préférences cookies (pour le bouton dans le footer)
function resetCookiePreferences() {
    localStorage.removeItem('cookieChoice');
    
    const cookiePopup = document.getElementById('cookiePopup');
    if (cookiePopup) {
        cookiePopup.style.display = 'block';
        setTimeout(() => {
            cookiePopup.classList.remove('hide');
            cookiePopup.classList.add('show');
        }, 10);
    }
}

// =============================================
// FONCTIONS DE FILTRAGE BOUTIQUE & PORTFOLIO
// =============================================

// Filtrer les produits par catégorie (BOUTIQUE)
function filterProducts(category) {
    console.log('🚀 filterProducts appelé avec catégorie:', category);
    
    const products = document.querySelectorAll('.produit-card');
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    console.log('📦 Produits trouvés:', products.length);
    console.log('🎯 Boutons trouvés:', categoryBtns.length);
    
    if (products.length === 0 || categoryBtns.length === 0) {
        console.log('❌ Pas sur la page boutique ou éléments non trouvés');
        return;
    }
    
    // Mettre à jour les boutons actifs
    categoryBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
            console.log('✅ Bouton activé:', btn.textContent);
        }
    });
    
    // Filtrer les produits
    products.forEach(product => {
        const productCategory = product.dataset.category;
        console.log(`📋 Produit: ${product.querySelector('h3').textContent}, Catégorie: ${productCategory}`);
        
        if (category === 'all' || productCategory === category) {
            console.log(`✅ AFFICHER produit: ${product.querySelector('h3').textContent}`);
            product.style.display = 'block';
            // Petit délai pour l'animation
            setTimeout(() => {
                product.style.opacity = '1';
                product.style.transform = 'translateY(0)';
            }, 50);
        } else {
            console.log(`❌ CACHER produit: ${product.querySelector('h3').textContent}`);
            // Animation de disparition
            product.style.opacity = '0';
            product.style.transform = 'translateY(20px)';
            setTimeout(() => {
                product.style.display = 'none';
            }, 300);
        }
    });
    
    console.log('🎉 Filtrage terminé pour catégorie:', category);
}

// Filtrer les projets portfolio
function filterPortfolio(filter) {
    console.log('🎨 filterPortfolio appelé avec filtre:', filter);
    
    const items = document.querySelectorAll('.portfolio-item');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    console.log('🖼️ Items portfolio trouvés:', items.length);
    console.log('🎯 Filtres trouvés:', filterBtns.length);
    
    if (items.length === 0 || filterBtns.length === 0) {
        console.log('❌ Pas sur la page portfolio ou éléments non trouvés');
        return;
    }
    
    // Mettre à jour les boutons actifs
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
            console.log('✅ Filtre activé:', btn.textContent);
        }
    });
    
    // Filtrer les projets
    items.forEach(item => {
        const itemCategory = item.dataset.category;
        console.log(`📋 Portfolio item: ${item.querySelector('h3').textContent}, Catégorie: ${itemCategory}`);
        
        if (filter === 'all' || itemCategory === filter) {
            console.log(`✅ AFFICHER item: ${item.querySelector('h3').textContent}`);
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 50);
        } else {
            console.log(`❌ CACHER item: ${item.querySelector('h3').textContent}`);
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
    
    console.log('🎉 Filtrage portfolio terminé pour:', filter);
}

// =============================================
// INITIALISATION DES FILTRES
// =============================================

// Initialiser les filtres de la boutique
function initBoutiqueFilters() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    console.log('🛒 Initialisation des filtres boutique...');
    console.log('🎯 Boutons de catégorie trouvés:', categoryBtns.length);
    
    if (categoryBtns.length === 0) {
        console.log('❌ Aucun bouton de catégorie trouvé');
        return;
    }
    
    categoryBtns.forEach(btn => {
        console.log('🔘 Bouton trouvé:', btn.textContent, 'data-category:', btn.dataset.category);
        
        // Supprimer les anciens événements
        btn.removeEventListener('click', handleCategoryClick);
        
        // Ajouter le nouvel événement
        btn.addEventListener('click', handleCategoryClick);
    });
    
    console.log('✅ Filtres boutique initialisés');
}

// Initialiser les filtres du portfolio
function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    console.log('🎨 Initialisation des filtres portfolio...');
    console.log('🎯 Filtres trouvés:', filterBtns.length);
    
    if (filterBtns.length === 0) {
        console.log('❌ Aucun filtre trouvé');
        return;
    }
    
    filterBtns.forEach(btn => {
        console.log('🔘 Filtre trouvé:', btn.textContent, 'data-filter:', btn.dataset.filter);
        
        // Supprimer les anciens événements
        btn.removeEventListener('click', handleFilterClick);
        
        // Ajouter le nouvel événement
        btn.addEventListener('click', handleFilterClick);
    });
    
    console.log('✅ Filtres portfolio initialisés');
}

// Gestionnaire de clic pour les catégories boutique
function handleCategoryClick() {
    const category = this.dataset.category;
    console.log('👆 Clic sur catégorie boutique:', category);
    filterProducts(category);
}

// Gestionnaire de clic pour les filtres portfolio
function handleFilterClick() {
    const filter = this.dataset.filter;
    console.log('👆 Clic sur filtre portfolio:', filter);
    filterPortfolio(filter);
}

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
        container.innerHTML = '<p class="text-center">Aucun article dans le panier</p>';
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
// ÉVÉNEMENTS ET INITIALISATION PRINCIPALE
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM entièrement chargé');
    
    // Initialiser le popup de cookies
    initCookiePopup();
    
    // Initialiser le compteur du panier
    updatePanierCount();
    
    // Initialiser les filtres BOUTIQUE
    initBoutiqueFilters();
    
    // Initialiser les filtres PORTFOLIO
    initPortfolioFilters();
    
    // Gestion du panier (boutique)
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
                
                // Validation email basique
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email.value)) {
                    showNotification('Veuillez entrer un email valide', 'error');
                    return;
                }
            }
            
            // Validation de l'étape 2
            if (nextStep === '3') {
                // Simuler le paiement
                showNotification('Paiement en cours...', 'info');
                
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
                            phone: document.getElementById('checkoutPhone').value,
                            company: document.getElementById('checkoutCompany').value,
                            notes: document.getElementById('checkoutNotes').value
                        }
                    };
                    
                    // Sauvegarder dans localStorage (pour historique)
                    localStorage.setItem('lastOrder', JSON.stringify(order));
                    
                    // Vider le panier
                    panier = [];
                    localStorage.removeItem('panier');
                    updatePanierCount();
                    
                    showNotification('Commande confirmée avec succès !', 'success');
                }, 1500);
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
    
    // Ajouter un produit au panier (BOUTIQUE)
    document.addEventListener('click', function(e) {
        const addBtn = e.target.closest('.btn-ajouter-panier, .btn-souscrire');
        
        if (addBtn) {
            const id = addBtn.dataset.id;
            const nom = addBtn.dataset.nom;
            const prix = parseFloat(addBtn.dataset.prix);
            
            // Vérifier si l'article est déjà dans le panier
            const existingItem = panier.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantite += 1;
            } else {
                panier.push({
                    id: id,
                    nom: nom,
                    prix: prix,
                    quantite: 1
                });
            }
            
            // Sauvegarder dans localStorage
            localStorage.setItem('panier', JSON.stringify(panier));
            
            // Mettre à jour l'affichage
            updatePanierCount();
            
            // Notification
            showNotification(`"${nom}" ajouté au panier`, 'success');
            
            // Ouvrir le panier (optionnel)
            // openPanierModal();
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
            
            // Validation
            if (!data.name || !data.email || !data.message) {
                showNotification('Veuillez remplir tous les champs obligatoires', 'error');
                return;
            }
            
            // Validation email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Veuillez entrer un email valide', 'error');
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
            const navLinks = document.querySelector('.nav-links');
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Fermer le menu au clic sur un lien
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            document.querySelector('.nav-links').classList.remove('active');
            document.querySelector('.menu-toggle')?.classList.remove('active');
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
                    this.style.background = '#10b981';
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.style.background = '';
                    }, 2000);
                    showNotification('Copié dans le presse-papier', 'success');
                })
                .catch(err => {
                    console.error('Erreur de copie:', err);
                    showNotification('Erreur lors de la copie', 'error');
                });
        });
    });
    
    // Fermer le menu en cliquant à l'extérieur
    document.addEventListener('click', function(e) {
        const navLinks = document.querySelector('.nav-links');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (navLinks && navLinks.classList.contains('active') &&
            !navLinks.contains(e.target) &&
            !menuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
    
    // Empêcher le comportement par défaut des liens vides
    document.querySelectorAll('a[href="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
        });
    });
    
    // Initialiser les animations des produits
    document.querySelectorAll('.produit-card, .portfolio-item').forEach(item => {
        item.style.transition = 'opacity 0.3s, transform 0.3s';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    });
    
    // Initialiser le bouton "Cookies" dans le footer
    const openCookieSettings = document.getElementById('openCookieSettings');
    if (openCookieSettings) {
        openCookieSettings.addEventListener('click', function(e) {
            e.preventDefault();
            resetCookiePreferences();
        });
    }
    
    console.log('✅ Initialisation terminée');
});

// =============================================
// FONCTION DE TEST MANUEL (à appeler depuis la console)
// =============================================

function testFiltres() {
    console.log('🧪 TEST MANUEL DES FILTRES');
    console.log('==========================');
    
    // Test boutique
    const catBtns = document.querySelectorAll('.category-btn');
    console.log(`🎯 Boutons boutique: ${catBtns.length}`);
    catBtns.forEach((btn, i) => {
        console.log(`${i+1}. ${btn.textContent} -> data-category: "${btn.dataset.category}"`);
    });
    
    // Test portfolio
    const filtreBtns = document.querySelectorAll('.filter-btn');
    console.log(`🎨 Filtres portfolio: ${filtreBtns.length}`);
    filtreBtns.forEach((btn, i) => {
        console.log(`${i+1}. ${btn.textContent} -> data-filter: "${btn.dataset.filter}"`);
    });
    
    // Test produits
    const produits = document.querySelectorAll('.produit-card');
    console.log(`📦 Produits boutique: ${produits.length}`);
    produits.forEach((prod, i) => {
        const title = prod.querySelector('h3')?.textContent || 'Sans titre';
        console.log(`${i+1}. ${title} -> data-category: "${prod.dataset.category}"`);
    });
    
    // Test portfolio items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    console.log(`🖼️ Items portfolio: ${portfolioItems.length}`);
    portfolioItems.forEach((item, i) => {
        const title = item.querySelector('h3')?.textContent || 'Sans titre';
        console.log(`${i+1}. ${title} -> data-category: "${item.dataset.category}"`);
    });
}
[file content end]
