<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');

// Configuration
require_once 'config.php';
require_once 'database.php';
require_once 'mailer.php';

// Protection CSRF
function verifyCsrfToken($token) {
    if (!isset($_SESSION['csrf_token']) || $token !== $_SESSION['csrf_token']) {
        return false;
    }
    return true;
}

// Rate limiting
function checkRateLimit($ip, $action, $limit = 10, $window = 3600) {
    $db = Database::getInstance();
    $timestamp = time() - $window;
    
    $stmt = $db->prepare("SELECT COUNT(*) as count FROM rate_limits WHERE ip = ? AND action = ? AND timestamp > ?");
    $stmt->execute([$ip, $action, $timestamp]);
    $result = $stmt->fetch();
    
    if ($result['count'] >= $limit) {
        return false;
    }
    
    $stmt = $db->prepare("INSERT INTO rate_limits (ip, action, timestamp) VALUES (?, ?, ?)");
    $stmt->execute([$ip, $action, time()]);
    
    return true;
}

// Nettoyage des données
function sanitizeInput($data) {
    if (is_array($data)) {
        return array_map('sanitizeInput', $data);
    }
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Routes API
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$endpoint = basename($path);

session_start();

switch ($endpoint) {
    case 'contact':
        if ($method === 'POST') {
            // Rate limiting
            $ip = $_SERVER['REMOTE_ADDR'];
            if (!checkRateLimit($ip, 'contact', 5, 3600)) {
                echo json_encode(['success' => false, 'message' => 'Trop de tentatives. Veuillez réessayer plus tard.']);
                exit;
            }
            
            // CSRF protection
            $data = json_decode(file_get_contents('php://input'), true);
            if (!verifyCsrfToken($data['csrf_token'] ?? '')) {
                echo json_encode(['success' => false, 'message' => 'Token de sécurité invalide']);
                exit;
            }
            
            // Validation
            $name = sanitizeInput($data['name'] ?? '');
            $email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
            $message = sanitizeInput($data['message'] ?? '');
            $lang = $data['lang'] ?? 'fr';
            
            if (empty($name) || empty($email) || empty($message)) {
                echo json_encode(['success' => false, 'message' => 'Tous les champs sont requis']);
                exit;
            }
            
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                echo json_encode(['success' => false, 'message' => 'Email invalide']);
                exit;
            }
            
            // Enregistrement en base de données
            $db = Database::getInstance();
            $stmt = $db->prepare("INSERT INTO contacts (name, email, message, lang, ip, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())");
            $stmt->execute([$name, $email, $message, $lang, $ip, $_SERVER['HTTP_USER_AGENT']]);
            
            // Envoi d'email
            $mailer = new Mailer();
            $mailSent = $mailer->sendContactEmail($name, $email, $message, $lang);
            
            // Notification Slack/Discord (optionnel)
            if (defined('SLACK_WEBHOOK')) {
                sendSlackNotification("Nouveau contact: $name ($email)");
            }
            
            echo json_encode([
                'success' => true,
                'message' => $lang === 'fr' ? 'Message envoyé avec succès!' : 'Message sent successfully!'
            ]);
        }
        break;
        
    case 'newsletter':
        if ($method === 'POST') {
            $ip = $_SERVER['REMOTE_ADDR'];
            if (!checkRateLimit($ip, 'newsletter', 3, 3600)) {
                echo json_encode(['success' => false, 'message' => 'Trop de tentatives']);
                exit;
            }
            
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!verifyCsrfToken($data['csrf_token'] ?? '')) {
                echo json_encode(['success' => false, 'message' => 'Token invalide']);
                exit;
            }
            
            $email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
            $lang = $data['lang'] ?? 'fr';
            
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                echo json_encode(['success' => false, 'message' => 'Email invalide']);
                exit;
            }
            
            // Vérifier si déjà inscrit
            $db = Database::getInstance();
            $stmt = $db->prepare("SELECT id FROM newsletter WHERE email = ?");
            $stmt->execute([$email]);
            
            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => false, 'message' => $lang === 'fr' ? 'Déjà inscrit' : 'Already subscribed']);
                exit;
            }
            
            // Ajouter à la newsletter
            $stmt = $db->prepare("INSERT INTO newsletter (email, lang, ip, subscribed_at) VALUES (?, ?, ?, NOW())");
            $stmt->execute([$email, $lang, $ip]);
            
            // Envoyer email de confirmation
            $mailer = new Mailer();
            $mailer->sendWelcomeEmail($email, $lang);
            
            echo json_encode([
                'success' => true,
                'message' => $lang === 'fr' ? 'Inscription réussie!' : 'Subscription successful!'
            ]);
        }
        break;
        
    case 'appointment':
        if ($method === 'POST') {
            $ip = $_SERVER['REMOTE_ADDR'];
            if (!checkRateLimit($ip, 'appointment', 2, 3600)) {
                echo json_encode(['success' => false, 'message' => 'Rate limit exceeded']);
                exit;
            }
            
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!verifyCsrfToken($data['csrf_token'] ?? '')) {
                echo json_encode(['success' => false, 'message' => 'Invalid token']);
                exit;
            }
            
            // Validation des données de rendez-vous
            $required = ['name', 'email', 'date', 'time', 'service'];
            foreach ($required as $field) {
                if (empty($data[$field])) {
                    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
                    exit;
                }
            }
            
            // Vérifier la date (au moins 24h à l'avance)
            $appointmentTime = strtotime($data['date'] . ' ' . $data['time']);
            if ($appointmentTime < time() + 86400) {
                echo json_encode(['success' => false, 'message' => 'Please schedule at least 24 hours in advance']);
                exit;
            }
            
            // Enregistrer le rendez-vous
            $db = Database::getInstance();
            $stmt = $db->prepare("INSERT INTO appointments (name, email, phone, date, time, service, message, lang, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())");
            $stmt->execute([
                sanitizeInput($data['name']),
                filter_var($data['email'], FILTER_SANITIZE_EMAIL),
                sanitizeInput($data['phone'] ?? ''),
                $data['date'],
                $data['time'],
                sanitizeInput($data['service']),
                sanitizeInput($data['message'] ?? ''),
                $data['lang'] ?? 'fr'
            ]);
            
            // Envoyer confirmation
            $mailer = new Mailer();
            $mailer->sendAppointmentConfirmation($data);
            
            echo json_encode([
                'success' => true,
                'message' => ($data['lang'] ?? 'fr') === 'fr' 
                    ? 'Rendez-vous confirmé!' 
                    : 'Appointment confirmed!'
            ]);
        }
        break;
        
    case 'order':
        if ($method === 'POST') {
            // Traitement des commandes
            $data = json_decode(file_get_contents('php://input'), true);
            
            // Logique de commande sécurisée
            // (à étendre avec Stripe/PayPal)
            
            echo json_encode(['success' => true, 'message' => 'Order processed']);
        }
        break;
        
    case 'csrf-token':
        // Générer un nouveau token CSRF
        if (!isset($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        echo json_encode(['token' => $_SESSION['csrf_token']]);
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
        break;
}
?>