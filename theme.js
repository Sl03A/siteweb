// theme.js - Mode sombre/clair et chatbot seulement

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser le mode sombre
    initDarkMode();
    
    // Initialiser le chatbot
    initChatbot();
});

// =============================================
// SYSTÈME DE MODE SOMBRE/CLAIR
// =============================================

function initDarkMode() {
    // Créer le bouton de toggle
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = `
        <i class="fas fa-moon moon-icon"></i>
        <i class="fas fa-sun sun-icon"></i>
    `;
    themeToggle.setAttribute('title', 'Changer le thème');
    themeToggle.setAttribute('aria-label', 'Changer le thème');
    
    themeToggle.addEventListener('click', toggleDarkMode);
    
    // Ajouter le bouton au body
    document.body.appendChild(themeToggle);
    
    // Vérifier le thème sauvegardé
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        enableDarkMode();
    }
}

function toggleDarkMode() {
    const isDark = document.body.classList.contains('dark-mode');
    
    if (isDark) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
    
    // Animation du bouton
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.style.transform = 'scale(0.9)';
    setTimeout(() => {
        themeToggle.style.transform = 'scale(1)';
    }, 150);
    
    showNotification('Mode sombre activé', 'success');
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
    
    // Animation du bouton
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.style.transform = 'scale(0.9)';
    setTimeout(() => {
        themeToggle.style.transform = 'scale(1)';
    }, 150);
    
    showNotification('Mode clair activé', 'success');
}

// =============================================
// CHATBOT
// =============================================

function initChatbot() {
    // Créer le bouton de toggle du chatbot
    const chatbotToggle = document.createElement('button');
    chatbotToggle.className = 'chatbot-toggle';
    chatbotToggle.innerHTML = '<i class="fas fa-comment-dots"></i>';
    chatbotToggle.setAttribute('title', 'Ouvrir l\'assistant virtuel');
    chatbotToggle.setAttribute('aria-label', 'Assistant virtuel');
    
    // Créer le container du chatbot
    const chatbotContainer = document.createElement('div');
    chatbotContainer.className = 'chatbot-container';
    chatbotContainer.id = 'chatbotContainer';
    
    chatbotContainer.innerHTML = `
        <div class="chatbot-header">
            <h3><i class="fas fa-robot"></i> Assistant Slozw</h3>
            <button class="chatbot-close" id="chatbotClose">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="chatbot-body">
            <div class="chat-messages" id="chatMessages">
                <div class="chat-message bot">
                    Bonjour ! 👋 Je suis l'assistant virtuel de Slozw. Comment puis-je vous aider ?
                </div>
            </div>
            <div class="chat-options" id="chatOptions">
                <button class="chat-option" data-question="prix">💰 Combien coûte un site web ?</button>
                <button class="chat-option" data-question="delais">⏱️ Quels sont vos délais ?</button>
                <button class="chat-option" data-question="processus">🔄 Comment ça se passe ?</button>
                <button class="chat-option" data-question="contact">📞 Comment vous contacter ?</button>
                <button class="chat-option" data-question="portfolio">🎨 Avez-vous des exemples ?</button>
            </div>
        </div>
        <div class="chatbot-footer">
            <p>💡 Réponses automatiques • Réponse humaine sous 24h</p>
        </div>
    `;
    
    // Ajouter les éléments au body
    document.body.appendChild(chatbotToggle);
    document.body.appendChild(chatbotContainer);
    
    // Événements
    chatbotToggle.addEventListener('click', toggleChatbot);
    document.getElementById('chatbotClose')?.addEventListener('click', toggleChatbot);
    
    // Ajouter les événements aux options
    document.querySelectorAll('.chat-option').forEach(option => {
        option.addEventListener('click', function() {
            const question = this.dataset.question;
            handleChatQuestion(question, this.textContent);
        });
    });
}

function toggleChatbot() {
    const chatbot = document.getElementById('chatbotContainer');
    const toggle = document.querySelector('.chatbot-toggle');
    
    if (chatbot) {
        chatbot.classList.toggle('active');
        
        if (chatbot.classList.contains('active')) {
            toggle.innerHTML = '<i class="fas fa-times"></i>';
            toggle.setAttribute('title', 'Fermer l\'assistant');
        } else {
            toggle.innerHTML = '<i class="fas fa-comment-dots"></i>';
            toggle.setAttribute('title', 'Ouvrir l\'assistant virtuel');
        }
    }
}

function handleChatQuestion(questionType, questionText) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    // Ajouter la question de l'utilisateur
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message user';
    userMessage.textContent = questionText;
    chatMessages.appendChild(userMessage);
    
    // Générer la réponse du bot
    let response = getBotResponse(questionType);
    
    // Ajouter un délai pour simuler la réflexion
    setTimeout(() => {
        const botMessage = document.createElement('div');
        botMessage.className = 'chat-message bot';
        botMessage.textContent = response;
        chatMessages.appendChild(botMessage);
        
        // Faire défiler vers le bas
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 800);
}

function getBotResponse(questionType) {
    const responses = {
        'prix': 'Les prix varient selon le projet :\n• Site vitrine : à partir de 899€\n• E-commerce : à partir de 1499€\n• Logo : à partir de 199€\n\nJe peux vous préparer un devis personnalisé gratuitement !',
        'delais': 'Délais moyens :\n• Site vitrine : 2-3 semaines\n• E-commerce : 4-6 semaines\n• Logo : 1 semaine\n\nCes délais peuvent varier selon la complexité du projet.',
        'processus': 'Processus en 4 étapes :\n1. 📞 Briefing et analyse de vos besoins\n2. 🎨 Création des maquettes (validation)\n3. 💻 Développement et intégration\n4. 🚀 Livraison et formation\n\nVous êtes accompagné à chaque étape !',
        'contact': 'Pour me contacter :\n📧 Email : contact@slozw.com\n📞 Téléphone : +33 1 23 45 67 89\n📍 Paris, France\n\nJe réponds sous 24h !',
        'portfolio': 'Vous pouvez voir mes réalisations dans la section Portfolio :\n• Sites e-commerce\n• Applications web\n• Design UI/UX\n• Logos professionnels\n\nOu sur Behance : @slozw'
    };
    
    return responses[questionType] || 'Je ne peux pas répondre à cette question pour le moment. Contactez-moi directement pour plus d\'informations !';
}

// =============================================
// STYLES MINIMAL POUR LES NOUVELLES FONCTIONNALITÉS
// =============================================

function addThemeStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Mode sombre */
        body.dark-mode {
            background-color: #0f172a;
            color: #f1f5f9;
        }
        
        body.dark-mode .navbar {
            background-color: #1e293b;
        }
        
        body.dark-mode .service-card,
        body.dark-mode .project-card,
        body.dark-mode .produit-card {
            background-color: #1e293b;
            border-color: #334155;
        }
        
        /* Bouton mode sombre */
        .theme-toggle {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #2563eb;
            color: white;
            border: none;
            cursor: pointer;
            z-index: 9998;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s;
        }
        
        .theme-toggle:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }
        
        .theme-toggle .sun-icon {
            display: none;
        }
        
        .theme-toggle .moon-icon {
            display: block;
        }
        
        body.dark-mode .theme-toggle .sun-icon {
            display: block;
        }
        
        body.dark-mode .theme-toggle .moon-icon {
            display: none;
        }
        
        /* Chatbot */
        .chatbot-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #2563eb;
            color: white;
            border: none;
            cursor: pointer;
            z-index: 9998;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s;
        }
        
        .chatbot-toggle:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }
        
        .chatbot-container {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 350px;
            max-width: calc(100vw - 40px);
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 9997;
            display: none;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid #e2e8f0;
        }
        
        body.dark-mode .chatbot-container {
            background: #1e293b;
            border-color: #334155;
        }
        
        .chatbot-container.active {
            display: flex;
            animation: slideUp 0.3s ease;
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .chatbot-header {
            padding: 1rem 1.5rem;
            background: #2563eb;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .chatbot-header h3 {
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .chatbot-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.3s;
        }
        
        .chatbot-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .chatbot-body {
            flex: 1;
            padding: 1.5rem;
            overflow-y: auto;
            max-height: 400px;
        }
        
        body.dark-mode .chatbot-body {
            background: #1e293b;
        }
        
        .chat-messages {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .chat-message {
            max-width: 80%;
            padding: 0.75rem 1rem;
            border-radius: 15px;
            font-size: 0.95rem;
            line-height: 1.4;
        }
        
        .chat-message.bot {
            align-self: flex-start;
            background: #f1f5f9;
            color: #333;
            border-bottom-left-radius: 5px;
        }
        
        body.dark-mode .chat-message.bot {
            background: #334155;
            color: #f1f5f9;
        }
        
        .chat-message.user {
            align-self: flex-end;
            background: #2563eb;
            color: white;
            border-bottom-right-radius: 5px;
        }
        
        .chat-options {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-top: 1rem;
        }
        
        .chat-option {
            padding: 0.75rem 1rem;
            background: #f1f5f9;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            color: #333;
            cursor: pointer;
            text-align: left;
            font-size: 0.9rem;
            transition: all 0.3s;
        }
        
        body.dark-mode .chat-option {
            background: #334155;
            border-color: #475569;
            color: #f1f5f9;
        }
        
        .chat-option:hover {
            background: #2563eb;
            color: white;
            border-color: #2563eb;
        }
        
        .chatbot-footer {
            padding: 1rem 1.5rem;
            border-top: 1px solid #e2e8f0;
            background: #f8fafc;
        }
        
        body.dark-mode .chatbot-footer {
            background: #1e293b;
            border-color: #334155;
        }
        
        .chatbot-footer p {
            font-size: 0.85rem;
            color: #64748b;
            text-align: center;
        }
        
        body.dark-mode .chatbot-footer p {
            color: #cbd5e1;
        }
        
        @media (max-width: 768px) {
            .chatbot-container {
                width: calc(100vw - 40px);
                right: 20px;
                bottom: 80px;
            }
            
            .chatbot-toggle {
                bottom: 20px;
                right: 20px;
            }
            
            .theme-toggle {
                bottom: 80px;
                right: 20px;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Ajouter les styles
addThemeStyles();
