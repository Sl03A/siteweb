// =============================================
// GESTION DE L'INTERNATIONALISATION
// =============================================

class Internationalization {
    constructor() {
        this.currentLang = document.documentElement.lang || 'fr';
        this.translations = {};
        this.init();
    }

    async init() {
        await this.loadTranslations();
        this.setupLanguageSwitcher();
        this.applyTranslations();
        this.setupHreflang();
    }

    async loadTranslations() {
        try {
            const response = await fetch(`translations/${this.currentLang}.json`);
            this.translations = await response.json();
        } catch (error) {
            console.error('Failed to load translations:', error);
            // Fallback aux traductions intégrées
            this.translations = await this.getFallbackTranslations();
        }
    }

    async getFallbackTranslations() {
        // Traductions de fallback minimales
        return {
            fr: {
                hero: { title: "Créations Digitales d'Excellence" },
                // ... autres traductions
            },
            en: {
                hero: { title: "Excellence in Digital Creations" },
                // ... autres traductions
            }
        }[this.currentLang] || {};
    }

    setupLanguageSwitcher() {
        // Sélecteur de langue dans la nav
        document.querySelectorAll('.language-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = option.getAttribute('href').split('_')[1]?.split('.')[0] || 'fr';
                this.switchLanguage(lang);
            });
        });

        // Sélecteur de langue dans le footer
        document.querySelectorAll('.footer-lang').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = option.getAttribute('href').split('_')[1]?.split('.')[0] || 'fr';
                this.switchLanguage(lang);
            });
        });

        // Détection automatique de la langue du navigateur
        const browserLang = navigator.language.split('-')[0];
        const supportedLangs = ['fr', 'en', 'es', 'de'];
        
        if (supportedLangs.includes(browserLang) && browserLang !== this.currentLang) {
            // Demander à l'utilisateur s'il veut changer de langue
            this.showLanguageSuggestion(browserLang);
        }
    }

    showLanguageSuggestion(lang) {
        if (this.getCookie('lang_suggestion_shown')) return;

        const messages = {
            fr: "Voulez-vous visiter le site en français ?",
            en: "Would you like to visit the site in English?",
            es: "¿Le gustaría visitar el sitio en español?",
            de: "Möchten Sie die Seite auf Deutsch besuchen?"
        };

        const notification = document.createElement('div');
        notification.className = 'notification language-suggestion';
        notification.innerHTML = `
            <p>${messages[lang] || messages.en}</p>
            <div class="language-suggestion-buttons">
                <button class="btn btn-sm btn-primary" data-lang="${lang}">Oui</button>
                <button class="btn btn-sm btn-secondary" id="dismissLangSuggestion">Non</button>
            </div>
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 100);

        notification.querySelector(`[data-lang="${lang}"]`).addEventListener('click', () => {
            this.switchLanguage(lang);
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
            this.setCookie('lang_suggestion_shown', 'true', 30);
        });

        notification.querySelector('#dismissLangSuggestion').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
            this.setCookie('lang_suggestion_shown', 'true', 30);
        });
    }

    async switchLanguage(lang) {
        // Sauvegarder la préférence
        this.setCookie('preferred_lang', lang, 365);
        localStorage.setItem('preferred_lang', lang);

        // Mettre à jour l'interface pendant le chargement
        document.documentElement.classList.add('lang-transition');
        document.documentElement.lang = lang;

        // Rediriger vers la page dans la nouvelle langue
        const currentPage = window.location.pathname.split('/').pop();
        const baseName = currentPage.replace(/_fr|_en|_es|_de/, '');
        const newPage = baseName.replace('.html', `_${lang}.html`);
        
        window.location.href = newPage;
    }

    applyTranslations() {
        // Appliquer les traductions aux éléments avec data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            if (translation) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else if (element.hasAttribute('data-i18n-html')) {
                    element.innerHTML = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Mettre à jour les attributs lang
        document.documentElement.lang = this.currentLang;

        // Mettre à jour les URLs canoniques et hreflang
        this.updateMetaTags();
    }

    getTranslation(key) {
        const keys = key.split('.');
        let value = this.translations;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                console.warn(`Translation missing for key: ${key}`);
                return null;
            }
        }
        
        return value;
    }

    setupHreflang() {
        // S'assurer que les liens hreflang sont présents
        const pages = ['index', 'services', 'portfolio', 'boutique', 'contact'];
        const languages = ['fr', 'en', 'es', 'de'];
        
        let hreflangTags = '';
        languages.forEach(lang => {
            pages.forEach(page => {
                const url = `https://slozw.com/${lang}/${page}.html`;
                hreflangTags += `<link rel="alternate" hreflang="${lang}" href="${url}" />`;
            });
        });
        
        // Ajouter x-default
        hreflangTags += `<link rel="alternate" hreflang="x-default" href="https://slozw.com/" />`;
        
        // Injecter dans le head
        document.head.insertAdjacentHTML('beforeend', hreflangTags);
    }

    updateMetaTags() {
        // Mettre à jour les meta tags pour le SEO
        const title = this.getTranslation('meta.title') || document.title;
        const description = this.getTranslation('meta.description') || 
                          document.querySelector('meta[name="description"]')?.content;
        
        document.title = title;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.content = description;
        
        // Mettre à jour les Open Graph tags
        this.updateOpenGraphTags();
    }

    updateOpenGraphTags() {
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDesc = document.querySelector('meta[property="og:description"]');
        const ogLocale = document.querySelector('meta[property="og:locale"]');
        
        if (ogTitle) ogTitle.content = document.title;
        if (ogDesc) ogDesc.content = this.getTranslation('meta.description') || '';
        if (ogLocale) ogLocale.content = this.currentLang;
    }

    setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/;SameSite=Strict";
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
        }
        return null;
    }
}

// =============================================
// GESTION DES COOKIES RGPD
// =============================================

class CookieManager {
    constructor() {
        this.cookieConsent = null;
        this.init();
    }

    init() {
        // Vérifier si le consentement a déjà été donné
        this.cookieConsent = this.getCookieConsent();
        
        if (!this.cookieConsent) {
            this.showCookieBanner();
        } else {
            this.applyCookieConsent();
        }

        this.setupCookieEvents();
    }

    getCookieConsent() {
        const consent = localStorage.getItem('cookie_consent');
        return consent ? JSON.parse(consent) : null;
    }

    saveCookieConsent(consent) {
        localStorage.setItem('cookie_consent', JSON.stringify(consent));
        this.setCookie('cookie_consent', JSON.stringify(consent), 365);
    }

    showCookieBanner() {
        const banner = document.getElementById('cookieBanner');
        if (!banner) return;

        setTimeout(() => {
            banner.classList.add('show');
        }, 1000);

        // Bouton Accepter
        document.getElementById('cookieAccept').addEventListener('click', () => {
            this.acceptAllCookies();
            banner.classList.remove('show');
        });

        // Bouton Refuser
        document.getElementById('cookieReject').addEventListener('click', () => {
            this.rejectAllCookies();
            banner.classList.remove('show');
        });

        // Bouton Personnaliser
        document.getElementById('cookieCustomize').addEventListener('click', () => {
            document.getElementById('cookiePreferences').classList.toggle('show');
        });

        // Sauvegarder les préférences
        document.getElementById('savePreferences').addEventListener('click', () => {
            this.saveCustomPreferences();
            banner.classList.remove('show');
        });
    }

    acceptAllCookies() {
        const consent = {
            essential: true,
            analytics: true,
            marketing: true,
            timestamp: new Date().toISOString()
        };
        
        this.saveCookieConsent(consent);
        this.applyCookieConsent();
        this.loadAnalytics();
        this.loadMarketing();
        
        showNotification('Préférences de cookies sauvegardées', 'success');
    }

    rejectAllCookies() {
        const consent = {
            essential: true, // Toujours requis
            analytics: false,
            marketing: false,
            timestamp: new Date().toISOString()
        };
        
        this.saveCookieConsent(consent);
        this.applyCookieConsent();
        
        showNotification('Cookies non essentiels désactivés', 'success');
    }

    saveCustomPreferences() {
        const consent = {
            essential: true,
            analytics: document.getElementById('cookieAnalytics').checked,
            marketing: document.getElementById('cookieMarketing').checked,
            timestamp: new Date().toISOString()
        };
        
        this.saveCookieConsent(consent);
        this.applyCookieConsent();
        
        if (consent.analytics) this.loadAnalytics();
        if (consent.marketing) this.loadMarketing();
        
        showNotification('Préférences sauvegardées', 'success');
    }

    applyCookieConsent() {
        if (!this.cookieConsent) return;

        // Mettre à jour les cases à cocher dans les préférences
        const analyticsCheck = document.getElementById('cookieAnalytics');
        const marketingCheck = document.getElementById('cookieMarketing');
        
        if (analyticsCheck) analyticsCheck.checked = this.cookieConsent.analytics;
        if (marketingCheck) marketingCheck.checked = this.cookieConsent.marketing;

        // Charger les scripts selon le consentement
        if (this.cookieConsent.analytics) {
            this.loadAnalytics();
        }
        
        if (this.cookieConsent.marketing) {
            this.loadMarketing();
        }
    }

    loadAnalytics() {
        // Google Analytics (exemple)
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
        
        // Matomo (exemple)
        if (typeof _paq !== 'undefined') {
            _paq.push(['rememberConsentGiven']);
        }
        
        console.log('Analytics cookies loaded');
    }

    loadMarketing() {
        // Facebook Pixel (exemple)
        if (typeof fbq !== 'undefined') {
            fbq('consent', 'grant');
        }
        
        console.log('Marketing cookies loaded');
    }

    setupCookieEvents() {
        // Ouvrir les paramètres des cookies depuis le footer
        document.getElementById('openCookieSettings')?.addEventListener('click', (e) => {
            e.preventDefault();
            const banner = document.getElementById('cookieBanner');
            if (banner) {
                banner.classList.add('show');
                document.getElementById('cookiePreferences').classList.add('show');
            }
        });
    }

    setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/;SameSite=Strict;Secure";
    }
}

// =============================================
// GESTION DU BACKEND & API
// =============================================

class BackendAPI {
    constructor() {
        this.baseURL = window.location.hostname === 'localhost' 
            ? 'http://localhost/slozw/backend/'
            : 'https://slozw.com/backend/';
        
        this.csrfToken = null;
        this.init();
    }

    async init() {
        await this.getCSRFToken();
        this.setupForms();
        this.setupRateLimiting();
    }

    async getCSRFToken() {
        try {
            const response = await fetch(`${this.baseURL}api.php?endpoint=csrf-token`);
            const data = await response.json();
            this.csrfToken = data.token;
            
            // Injecter le token dans les formulaires
            document.querySelectorAll('input[name="csrf_token"]').forEach(input => {
                input.value = this.csrfToken;
            });
        } catch (error) {
            console.error('Failed to get CSRF token:', error);
        }
    }

    setupForms() {
        // Formulaire de contact
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
        }

        // Formulaire newsletter
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => this.handleNewsletterForm(e));
        }

        // Formulaire de rendez-vous
        const appointmentForm = document.getElementById('appointmentForm');
        if (appointmentForm) {
            appointmentForm.addEventListener('submit', (e) => this.handleAppointmentForm(e));
        }
    }

    async handleContactForm(e) {
        e.preventDefault();
        const form = e.target;
        
        if (!this.validateForm(form)) return;
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        data.csrf_token = this.csrfToken;
        data.lang = document.documentElement.lang || 'fr';
        
        try {
            this.showFormLoading(form);
            
            const response = await fetch(`${this.baseURL}api.php?endpoint=contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': this.csrfToken
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showFormSuccess(form, result.message);
                form.reset();
                this.trackConversion('contact_form_submit');
            } else {
                this.showFormError(form, result.message);
            }
        } catch (error) {
            this.showFormError(form, 'Une erreur est survenue. Veuillez réessayer.');
            console.error('Contact form error:', error);
        } finally {
            this.hideFormLoading(form);
        }
    }

    async handleNewsletterForm(e) {
        e.preventDefault();
        const form = e.target;
        const emailInput = form.querySelector('input[type="email"]');
        
        if (!emailInput.value || !this.validateEmail(emailInput.value)) {
            this.showFormError(form, 'Veuillez entrer une adresse email valide.');
            return;
        }
        
        const data = {
            email: emailInput.value,
            csrf_token: this.csrfToken,
            lang: document.documentElement.lang || 'fr'
        };
        
        try {
            this.showFormLoading(form);
            
            const response = await fetch(`${this.baseURL}api.php?endpoint=newsletter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': this.csrfToken
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showFormSuccess(form, result.message);
                form.reset();
                this.trackConversion('newsletter_subscription');
            } else {
                this.showFormError(form, result.message);
            }
        } catch (error) {
            this.showFormError(form, 'Erreur de connexion. Veuillez réessayer.');
            console.error('Newsletter form error:', error);
        } finally {
            this.hideFormLoading(form);
        }
    }

    async handleAppointmentForm(e) {
        e.preventDefault();
        const form = e.target;
        
        if (!this.validateForm(form)) return;
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        data.csrf_token = this.csrfToken;
        data.lang = document.documentElement.lang || 'fr';
        
        // Validation de la date
        const appointmentTime = new Date(data.date + 'T' + data.time);
        const minTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h à l'avance
        
        if (appointmentTime < minTime) {
            this.showFormError(form, 'Veuillez choisir une date au moins 24h à l\'avance.');
            return;
        }
        
        try {
            this.showFormLoading(form);
            
            const response = await fetch(`${this.baseURL}api.php?endpoint=appointment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': this.csrfToken
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showFormSuccess(form, result.message);
                form.reset();
                this.trackConversion('appointment_booking');
                
                // Ouvrir le modal de confirmation
                this.showAppointmentConfirmation(data);
            } else {
                this.showFormError(form, result.message);
            }
        } catch (error) {
            this.showFormError(form, 'Erreur de réservation. Veuillez réessayer.');
            console.error('Appointment form error:', error);
        } finally {
            this.hideFormLoading(form);
        }
    }

    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                this.highlightError(field, 'Ce champ est requis');
            } else if (field.type === 'email' && !this.validateEmail(field.value)) {
                isValid = false;
                this.highlightError(field, 'Email invalide');
            } else {
                this.removeError(field);
            }
        });
        
        return isValid;
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    highlightError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    removeError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) errorElement.remove();
    }

    showFormLoading(form) {
        form.classList.add('form-loading');
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        }
    }

    hideFormLoading(form) {
        form.classList.remove('form-loading');
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            const originalText = submitButton.getAttribute('data-original-text') || 'Envoyer';
            submitButton.innerHTML = originalText;
        }
    }

    showFormSuccess(form, message) {
        let successElement = form.querySelector('.form-message.success');
        if (!successElement) {
            successElement = document.createElement('div');
            successElement.className = 'form-message success';
            form.prepend(successElement);
        }
        successElement.textContent = message;
        successElement.style.display = 'block';
        
        // Masquer après 5 secondes
        setTimeout(() => {
            successElement.style.display = 'none';
        }, 5000);
    }

    showFormError(form, message) {
        let errorElement = form.querySelector('.form-message.error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-message error';
            form.prepend(errorElement);
        }
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Masquer après 5 secondes
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }

    showAppointmentConfirmation(data) {
        const modal = document.createElement('div');
        modal.className = 'modal appointment-confirmation';
        modal.innerHTML = `
            <div class="modal-content">
                <h2><i class="fas fa-calendar-check"></i> Rendez-vous confirmé !</h2>
                <div class="appointment-details">
                    <p><strong>Date :</strong> ${data.date}</p>
                    <p><strong>Heure :</strong> ${data.time}</p>
                    <p><strong>Service :</strong> ${data.service}</p>
                    <p>Un email de confirmation vous a été envoyé.</p>
                </div>
                <button class="btn btn-primary close-modal">Fermer</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        // Fermer en cliquant à l'extérieur
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    setupRateLimiting() {
        // Suivi des tentatives de formulaire
        const attemptsKey = 'form_attempts';
        let attempts = JSON.parse(localStorage.getItem(attemptsKey) || '{}');
        
        // Réinitialiser les compteurs après 1 heure
        const now = Date.now();
        Object.keys(attempts).forEach(key => {
            if (now - attempts[key].timestamp > 3600000) {
                delete attempts[key];
            }
        });
        
        localStorage.setItem(attemptsKey, JSON.stringify(attempts));
    }

    trackConversion(event) {
        // Envoyer l'événement à Google Analytics (si autorisé)
        if (typeof gtag !== 'undefined' && cookieManager?.cookieConsent?.analytics) {
            gtag('event', event, {
                'event_category': 'conversion',
                'event_label': document.documentElement.lang
            });
        }
        
        // Enregistrer en local
        const conversions = JSON.parse(localStorage.getItem('conversions') || '[]');
        conversions.push({
            event: event,
            timestamp: new Date().toISOString(),
            lang: document.documentElement.lang,
            page: window.location.pathname
        });
        localStorage.setItem('conversions', JSON.stringify(conversions.slice(-100))); // Garder les 100 derniers
    }
}

// =============================================
// INITIALISATION GLOBALE
// =============================================

let i18n, cookieManager, backendAPI;

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser l'internationalisation
    i18n = new Internationalization();
    
    // Initialiser la gestion des cookies
    cookieManager = new CookieManager();
    
    // Initialiser l'API backend
    backendAPI = new BackendAPI();
    
    // Mettre à jour le compteur du panier
    updatePanierCount();
    
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
    
    // Charger la langue préférée
    const preferredLang = localStorage.getItem('preferred_lang') || 
                         cookieManager.getCookie('preferred_lang') ||
                         navigator.language.split('-')[0];
    
    const supportedLangs = ['fr', 'en', 'es', 'de'];
    if (supportedLangs.includes(preferredLang) && preferredLang !== document.documentElement.lang) {
        i18n.switchLanguage(preferredLang);
    }
    
    // Analytics basique (respectueux de la vie privée)
    if (cookieManager?.cookieConsent?.analytics) {
        trackPageView();
    }
});

// Fonction de notification (gardée depuis la version précédente)
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

// Analytics respectueux de la vie privée
function trackPageView() {
    const data = {
        page: window.location.pathname,
        lang: document.documentElement.lang,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    };
    
    // Envoyer à l'API (optionnel)
    if (backendAPI && cookieManager?.cookieConsent?.analytics) {
        backendAPI.trackPageView(data);
    }
    
    // Stocker localement pour analytics interne
    const pageViews = JSON.parse(localStorage.getItem('page_views') || '[]');
    pageViews.push(data);
    localStorage.setItem('page_views', JSON.stringify(pageViews.slice(-1000))); // Limiter à 1000 entrées
}

// Gestion du panier (fonctions existantes)
let panier = JSON.parse(localStorage.getItem('panier')) || [];

function updatePanierCount() {
    const count = panier.reduce((total, item) => total + item.quantite, 0);
    const panierCounts = document.querySelectorAll('.panier-count');
    panierCounts.forEach(element => {
        element.textContent = count;
    });
}

// ... autres fonctions du panier (gardées de la version précédente) ...

// Support pour les Webhooks (notifications)
function sendWebhook(event, data) {
    if (!cookieManager?.cookieConsent?.analytics) return;
    
    const webhookURL = 'https://hooks.slack.com/services/...'; // URL de webhook Slack/Discord
    
    fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            event: event,
            data: data,
            timestamp: new Date().toISOString(),
            domain: window.location.hostname
        })
    }).catch(error => console.error('Webhook error:', error));
}

// Service Worker pour PWA (optionnel)
if ('serviceWorker' in navigator && cookieManager?.cookieConsent?.essential) {
    navigator.serviceWorker.register('/sw.js').then(() => {
        console.log('Service Worker registered');
    }).catch(error => {
        console.error('Service Worker registration failed:', error);
    });
}

// Performance monitoring
window.addEventListener('load', () => {
    if (cookieManager?.cookieConsent?.analytics) {
        const perfData = {
            loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
            domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
            pageSize: performance.getEntriesByType('resource')
                .filter(r => r.initiatorType === 'script' || r.initiatorType === 'css' || r.initiatorType === 'img')
                .reduce((total, r) => total + r.transferSize, 0)
        };
        
        console.log('Performance:', perfData);
        
        // Envoyer les données de performance
        if (backendAPI) {
            backendAPI.trackPerformance(perfData);
        }
    }
});
