<?php
session_start();
require_once 'config.php';

// Informations de connexion (à changer en production)
$admin_username = 'admin';
$admin_password_hash = password_hash('ChangeThisPassword123!', PASSWORD_DEFAULT);

// Déconnexion
if (isset($_POST['logout'])) {
    session_unset();
    session_destroy();
    header('Location: login.php');
    exit;
}

// Connexion
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    // Validation simple
    if (empty($username) || empty($password)) {
        $error = 'Veuillez remplir tous les champs';
    } elseif ($username === $admin_username && password_verify($password, $admin_password_hash)) {
        // Authentification réussie
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_username'] = $username;
        $_SESSION['admin_last_activity'] = time();
        
        // Rediriger vers le dashboard
        header('Location: admin.php');
        exit;
    } else {
        $error = 'Identifiants incorrects';
        
        // Log des tentatives échouées
        log_event('failed_login_attempt', [
            'username' => $username,
            'ip' => $_SERVER['REMOTE_ADDR']
        ]);
    }
}

// Vérifier si déjà connecté
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header('Location: admin.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion Admin - Slozw</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .login-container {
            background: white;
            padding: 3rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            width: 100%;
            max-width: 400px;
        }
        
        .logo {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .logo h1 {
            color: #2563eb;
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }
        
        .logo p {
            color: #64748b;
        }
        
        .login-form h2 {
            text-align: center;
            margin-bottom: 2rem;
            color: #1e293b;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #475569;
            font-weight: 500;
        }
        
        .form-group input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 1rem;
            transition: border 0.3s;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: #2563eb;
        }
        
        .error-message {
            background: #fee2e2;
            color: #991b1b;
            padding: 0.75rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            text-align: center;
            display: <?php echo $error ? 'block' : 'none'; ?>;
        }
        
        .btn-login {
            width: 100%;
            padding: 0.75rem;
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        .btn-login:hover {
            background: #1d4ed8;
        }
        
        .security-notice {
            margin-top: 1.5rem;
            padding: 1rem;
            background: #f8fafc;
            border-radius: 8px;
            text-align: center;
            color: #64748b;
            font-size: 0.9rem;
        }
        
        .security-notice i {
            color: #10b981;
            margin-right: 0.5rem;
        }
        
        @media (max-width: 480px) {
            .login-container {
                padding: 2rem;
                margin: 1rem;
            }
        }
    </style>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="login-container">
        <div class="logo">
            <h1>Slozw</h1>
            <p>Admin Dashboard</p>
        </div>
        
        <?php if ($error): ?>
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i> <?php echo htmlspecialchars($error); ?>
        </div>
        <?php endif; ?>
        
        <div class="login-form">
            <h2>Connexion Admin</h2>
            
            <form method="POST">
                <div class="form-group">
                    <label for="username">Nom d'utilisateur</label>
                    <input type="text" id="username" name="username" required autofocus>
                </div>
                
                <div class="form-group">
                    <label for="password">Mot de passe</label>
                    <input type="password" id="password" name="password" required>
                </div>
                
                <button type="submit" name="login" class="btn-login">
                    <i class="fas fa-sign-in-alt"></i> Se connecter
                </button>
            </form>
            
            <div class="security-notice">
                <i class="fas fa-shield-alt"></i>
                Accès sécurisé - Connexion chiffrée
            </div>
        </div>
    </div>
    
    <script>
    // Protection contre les bots
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.querySelector('form');
        let submitCount = 0;
        
        form.addEventListener('submit', function(e) {
            submitCount++;
            
            if (submitCount > 3) {
                e.preventDefault();
                alert('Trop de tentatives. Veuillez patienter.');
                setTimeout(() => {
                    location.reload();
                }, 5000);
            }
        });
        
        // Anti-inspection
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
        
        document.addEventListener('keydown', function(e) {
            // Bloquer F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
                (e.ctrlKey && e.key === 'u')) {
                e.preventDefault();
            }
        });
    });
    </script>
</body>
</html>
