// Gestion du panier
let panier = JSON.parse(localStorage.getItem('panier')) || [];

// Mettre à jour le compteur du panier
function updatePanierCount() {
    const count = panier.reduce((total, item) => total + item.quantite, 0);
    document.querySelector('.panier-count').textContent = count;
}

// Ajouter au panier
document.querySelectorAll('.btn-ajouter').forEach(btn => {
    btn.addEventListener('click', function() {
        const id = this.dataset.id;
        const nom = this.dataset.nom;
        const prix = parseInt(this.dataset.prix);
        
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
    });
});

// Afficher le panier
document.querySelector('.panier-btn').addEventListener('click', function() {
    const modal = document.getElementById('panierModal');
    modal.classList.add('show');
    updatePanierDisplay();
});

// Fermer le panier
document.querySelector('.close-panier').addEventListener('click', function() {
    document.getElementById('panierModal').classList.remove('show');
});

// Mettre à jour l'affichage du panier
function updatePanierDisplay() {
    const container = document.getElementById('panierItems');
    const totalElement = document.getElementById('totalPanier');
    
    if (panier.length === 0) {
        container.innerHTML = '<p class="panier-vide">Votre panier est vide</p>';
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
    
    totalElement.textContent = total + '€';
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

// Commander
document.getElementById('btnCommander').addEventListener('click', function() {
    if (panier.length === 0) {
        showNotification('Votre panier est vide', 'error');
        return;
    }
    
    const total = panier.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
    const commande = {
        date: new Date().toISOString(),
        articles: panier,
        total: total,
        statut: 'en attente'
    };
    
    // Simulation d'envoi de commande
    console.log('Commande envoyée:', commande);
    
    // Vider le panier
    panier = [];
    localStorage.removeItem('panier');
    updatePanierCount();
    updatePanierDisplay();
    
    document.getElementById('panierModal').classList.remove('show');
    showNotification('Commande passée avec succès ! Je vous contacte rapidement.', 'success');
});

// Formulaire de contact
document.getElementById('form-contact').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Récupérer les données
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Validation simple
    if (!data[0] || !data[1] || !data[2]) {
        showNotification('Veuillez remplir tous les champs', 'error');
        return;
    }
    
    // Simulation d'envoi
    console.log('Message envoyé:', data);
    
    // Réinitialiser le formulaire
    this.reset();
    showNotification('Message envoyé avec succès !');
});

// Notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = 'notification';
    notification.classList.add(type, 'show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Menu mobile
document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Fermer le menu au clic sur un lien
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelector('.nav-links').classList.remove('active');
    });
});

// Initialiser le compteur du panier au chargement
document.addEventListener('DOMContentLoaded', function() {
    updatePanierCount();
});
