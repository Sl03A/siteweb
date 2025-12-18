<?php
// Configuration de sécurité
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error.log');

// Configuration de la base de données
define('DB_PATH', __DIR__ . '/database.sqlite');

// Configuration SMTP pour les emails
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'contact@slozw.com');
define('SMTP_PASS', 'votre_mot_de_passe_sécurisé'); // À remplacer par des variables d'environnement
define('FROM_EMAIL', 'contact@slozw.com');
define('FROM_NAME', 'Slozw');
define('ADMIN_EMAIL', 'admin@slozw.com');

// Configuration des webhooks (optionnel)
define('SLACK_WEBHOOK', ''); // URL du webhook Slack
define('DISCORD_WEBHOOK', ''); // URL du webhook Discord

// Clés API (à stocker dans des variables d'environnement en production)
define('RECAPTCHA_SECRET_KEY', '');
define('STRIPE_SECRET_KEY', '');
define('PAYPAL_CLIENT_ID', '');

// Configuration de sécurité
define('CSRF_TOKEN_LIFETIME', 3600); // 1 heure
define('RATE_LIMIT_WINDOW', 3600); // 1 heure
define('MAX_LOGIN_ATTEMPTS', 5);
define('SESSION_TIMEOUT', 1800); // 30 minutes

// Configuration du site
define('SITE_URL', 'https://slozw.com');
define('SITE_NAME', 'Slozw');
define('DEFAULT_LANG', 'fr');
define('SUPPORTED_LANGS', ['fr', 'en', 'es', 'de']);

// Configuration des devises
define('DEFAULT_CURRENCY', 'EUR');
define('SUPPORTED_CURRENCIES', ['EUR', 'USD', 'GBP', 'CHF']);

// Désactiver les en-têtes sensibles
header_remove('X-Powered-By');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: geolocation=(), microphone=(), camera=()');

// Configuration des sessions
session_start([
    'cookie_httponly' => true,
    'cookie_secure' => true,
    'cookie_samesite' => 'Strict',
    'use_strict_mode' => true,
    'gc_maxlifetime' => SESSION_TIMEOUT
]);

// Régénération régulière de l'ID de session
if (!isset($_SESSION['created'])) {
    $_SESSION['created'] = time();
} elseif (time() - $_SESSION['created'] > 300) {
    session_regenerate_id(true);
    $_SESSION['created'] = time();
}

// Fonctions de sécurité
function sanitize_input($data) {
    if (is_array($data)) {
        return array_map('sanitize_input', $data);
    }
    
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    
    return $data;
}

function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function validate_phone($phone) {
    $phone = preg_replace('/[^0-9+]/', '', $phone);
    return preg_match('/^[+]?[0-9]{10,15}$/', $phone);
}

function generate_csrf_token() {
    if (!isset($_SESSION['csrf_token']) || time() - $_SESSION['csrf_token_time'] > CSRF_TOKEN_LIFETIME) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        $_SESSION['csrf_token_time'] = time();
    }
    return $_SESSION['csrf_token'];
}

function verify_csrf_token($token) {
    if (!isset($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $token)) {
        return false;
    }
    
    // Vérifier l'expiration
    if (time() - $_SESSION['csrf_token_time'] > CSRF_TOKEN_LIFETIME) {
        unset($_SESSION['csrf_token'], $_SESSION['csrf_token_time']);
        return false;
    }
    
    return true;
}

// Fonction de log
function log_event($event, $data = []) {
    $log_entry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'event' => $event,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
        'data' => $data
    ];
    
    $log_file = __DIR__ . '/logs/' . date('Y-m-d') . '.log';
    file_put_contents($log_file, json_encode($log_entry) . PHP_EOL, FILE_APPEND | LOCK_EX);
}

// Vérifier si le fichier de log existe
if (!file_exists(__DIR__ . '/logs')) {
    mkdir(__DIR__ . '/logs', 0755, true);
}
?>
