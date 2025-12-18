<?php
// Admin Dashboard
session_start();

// Sécurité admin
require_once 'config.php';

// Vérifier l'authentification
function is_authenticated() {
    if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        return false;
    }
    
    // Vérifier l'expiration de la session
    if (isset($_SESSION['admin_last_activity']) && (time() - $_SESSION['admin_last_activity'] > 1800)) {
        session_unset();
        session_destroy();
        return false;
    }
    
    $_SESSION['admin_last_activity'] = time();
    return true;
}

// Rediriger si non authentifié
if (!is_authenticated() && basename($_SERVER['PHP_SELF']) !== 'login.php') {
    header('Location: login.php');
    exit;
}

// Connexion à la base de données
require_once 'database.php';
$db = Database::getInstance();
$pdo = $db->getConnection();

// Fonctions admin
function get_stats() {
    global $pdo;
    
    $stats = [];
    
    // Nombre de contacts
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM contacts");
    $stats['contacts'] = $stmt->fetch()['count'];
    
    // Nombre d'abonnés newsletter
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM newsletter WHERE active = 1");
    $stats['subscribers'] = $stmt->fetch()['count'];
    
    // Nombre de rendez-vous à venir
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM appointments WHERE date >= DATE('now') AND status = 'pending'");
    $stats['appointments'] = $stmt->fetch()['count'];
    
    // Nombre de commandes
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM orders");
    $stats['orders'] = $stmt->fetch()['count'];
    
    // Répartition par langue
    $stmt = $pdo->query("SELECT lang, COUNT(*) as count FROM contacts GROUP BY lang");
    $stats['contacts_by_lang'] = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
    
    return $stats;
}

function get_recent_contacts($limit = 10) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM contacts ORDER BY created_at DESC LIMIT ?");
    $stmt->execute([$limit]);
    return $stmt->fetchAll();
}

function get_pending_appointments() {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM appointments WHERE date >= DATE('now') AND status = 'pending' ORDER BY date, time");
    $stmt->execute();
    return $stmt->fetchAll();
}

function update_contact_status($id, $read) {
    global $pdo;
    $stmt = $pdo->prepare("UPDATE contacts SET read_status = ? WHERE id = ?");
    return $stmt->execute([$read ? 1 : 0, $id]);
}

function update_appointment_status($id, $status) {
    global $pdo;
    $stmt = $pdo->prepare("UPDATE appointments SET status = ? WHERE id = ?");
    return $stmt->execute([$status, $id]);
}

// Traitement des actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    switch ($action) {
        case 'mark_read':
            $id = $_POST['id'] ?? 0;
            update_contact_status($id, true);
            break;
            
        case 'mark_unread':
            $id = $_POST['id'] ?? 0;
            update_contact_status($id, false);
            break;
            
        case 'update_appointment':
            $id = $_POST['id'] ?? 0;
            $status = $_POST['status'] ?? 'pending';
            update_appointment_status($id, $status);
            break;
            
        case 'export_contacts':
            export_contacts_csv();
            break;
            
        case 'delete_contact':
            $id = $_POST['id'] ?? 0;
            $stmt = $pdo->prepare("DELETE FROM contacts WHERE id = ?");
            $stmt->execute([$id]);
            break;
    }
    
    // Rediriger pour éviter le re-submit
    header('Location: ' . $_SERVER['PHP_SELF']);
    exit;
}

function export_contacts_csv() {
    global $pdo;
    
    $stmt = $pdo->query("SELECT * FROM contacts ORDER BY created_at DESC");
    $contacts = $stmt->fetchAll();
    
    // En-têtes CSV
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=contacts_' . date('Y-m-d') . '.csv');
    
    $output = fopen('php://output', 'w');
    
    // En-têtes
    fputcsv($output, ['ID', 'Nom', 'Email', 'Téléphone', 'Message', 'Langue', 'Date', 'Lu']);
    
    // Données
    foreach ($contacts as $contact) {
        fputcsv($output, [
            $contact['id'],
            $contact['name'],
            $contact['email'],
            $contact['phone'] ?? '',
            $contact['message'],
            $contact['lang'],
            $contact['created_at'],
            $contact['read_status'] ? 'Oui' : 'Non'
        ]);
    }
    
    fclose($output);
    exit;
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Slozw</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f8fafc;
            color: #1e293b;
        }
        
        .admin-container {
            display: flex;
            min-height: 100vh;
        }
        
        .sidebar {
            width: 250px;
            background: #1e293b;
            color: white;
            padding: 2rem 1rem;
        }
        
        .sidebar h2 {
            margin-bottom: 2rem;
            color: #60a5fa;
            text-align: center;
        }
        
        .nav-links {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .nav-links a {
            color: #cbd5e1;
            text-decoration: none;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            transition: all 0.3s;
        }
        
        .nav-links a:hover,
        .nav-links a.active {
            background: #334155;
            color: white;
        }
        
        .nav-links a i {
            width: 20px;
            margin-right: 0.5rem;
        }
        
        .logout-btn {
            margin-top: 2rem;
            background: #ef4444;
            color: white;
            border: none;
            padding: 0.75rem;
            border-radius: 8px;
            cursor: pointer;
            width: 100%;
            font-weight: 600;
        }
        
        .main-content {
            flex: 1;
            padding: 2rem;
            overflow-y: auto;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #e2e8f0;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .stat-card {
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .stat-number {
            font-size: 2.5rem;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 0.5rem;
        }
        
        .stat-label {
            color: #64748b;
            font-size: 0.9rem;
        }
        
        .section {
            background: white;
            border-radius: 10px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .section h3 {
            margin-bottom: 1rem;
            color: #1e293b;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #e2e8f0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        th, td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        
        th {
            background: #f8fafc;
            font-weight: 600;
            color: #475569;
        }
        
        tr:hover {
            background: #f8fafc;
        }
        
        .status-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
        }
        
        .status-pending {
            background: #fef3c7;
            color: #92400e;
        }
        
        .status-confirmed {
            background: #d1fae5;
            color: #065f46;
        }
        
        .status-cancelled {
            background: #fee2e2;
            color: #991b1b;
        }
        
        .btn {
            padding: 0.5rem 1rem;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.3s;
        }
        
        .btn-primary {
            background: #2563eb;
            color: white;
        }
        
        .btn-primary:hover {
            background: #1d4ed8;
        }
        
        .btn-secondary {
            background: #6b7280;
            color: white;
        }
        
        .btn-danger {
            background: #ef4444;
            color: white;
        }
        
        .btn-sm {
            padding: 0.25rem 0.5rem;
            font-size: 0.8rem;
        }
        
        .actions {
            display: flex;
            gap: 0.5rem;
        }
        
        .read-status {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
        }
        
        .read-status.read {
            background: #10b981;
        }
        
        .read-status.unread {
            background: #ef4444;
        }
        
        .lang-flag {
            font-size: 1.2rem;
        }
        
        .export-btn {
            margin-bottom: 1rem;
        }
        
        @media (max-width: 768px) {
            .admin-container {
                flex-direction: column;
            }
            
            .sidebar {
                width: 100%;
                padding: 1rem;
            }
            
            .nav-links {
                flex-direction: row;
                flex-wrap: wrap;
            }
            
            .main-content {
                padding: 1rem;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
            }
            
            table {
                display: block;
                overflow-x: auto;
            }
        }
    </style>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="admin-container">
        <!-- Sidebar -->
        <div class="sidebar">
            <h2><i class="fas fa-cogs"></i> Admin Slozw</h2>
            
            <div class="nav-links">
                <a href="#" class="active">
                    <i class="fas fa-tachometer-alt"></i> Dashboard
                </a>
                <a href="#contacts">
                    <i class="fas fa-envelope"></i> Contacts
                </a>
                <a href="#newsletter">
                    <i class="fas fa-newspaper"></i> Newsletter
                </a>
                <a href="#appointments">
                    <i class="fas fa-calendar-alt"></i> Rendez-vous
                </a>
                <a href="#orders">
                    <i class="fas fa-shopping-cart"></i> Commandes
                </a>
                <a href="#analytics">
                    <i class="fas fa-chart-bar"></i> Analytics
                </a>
                <a href="#settings">
                    <i class="fas fa-cog"></i> Paramètres
                </a>
            </div>
            
            <div class="admin-info">
                <p style="margin-top: 2rem; color: #94a3b8; font-size: 0.9rem;">
                    <i class="fas fa-user"></i> <?php echo $_SESSION['admin_username'] ?? 'Admin'; ?>
                </p>
                <p style="color: #94a3b8; font-size: 0.9rem;">
                    <i class="fas fa-clock"></i> Dernière connexion: 
                    <?php echo date('H:i', $_SESSION['admin_last_activity'] ?? time()); ?>
                </p>
            </div>
            
            <form action="login.php" method="POST">
                <button type="submit" name="logout" class="logout-btn">
                    <i class="fas fa-sign-out-alt"></i> Déconnexion
                </button>
            </form>
        </div>
        
        <!-- Main Content -->
        <div class="main-content">
            <div class="header">
                <h1>Dashboard Admin</h1>
                <div class="header-info">
                    <span style="color: #64748b;">
                        <i class="fas fa-calendar"></i> <?php echo date('d/m/Y'); ?>
                    </span>
                </div>
            </div>
            
            <?php
            $stats = get_stats();
            ?>
            
            <!-- Stats -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number"><?php echo $stats['contacts']; ?></div>
                    <div class="stat-label">Contacts</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-number"><?php echo $stats['subscribers']; ?></div>
                    <div class="stat-label">Abonnés Newsletter</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-number"><?php echo $stats['appointments']; ?></div>
                    <div class="stat-label">Rendez-vous</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-number"><?php echo $stats['orders']; ?></div>
                    <div class="stat-label">Commandes</div>
                </div>
            </div>
            
            <!-- Répartition par langue -->
            <div class="section">
                <h3>Contacts par langue</h3>
                <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
                    <?php foreach ($stats['contacts_by_lang'] as $lang => $count): ?>
                        <div style="text-align: center;">
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">
                                <?php 
                                $flags = ['fr' => '🇫🇷', 'en' => '🇬🇧', 'es' => '🇪🇸', 'de' => '🇩🇪'];
                                echo $flags[$lang] ?? '🌐';
                                ?>
                            </div>
                            <div style="font-size: 1.5rem; font-weight: bold;"><?php echo $count; ?></div>
                            <div style="color: #64748b; text-transform: uppercase;"><?php echo $lang; ?></div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
            
            <!-- Contacts récents -->
            <div class="section" id="contacts">
                <h3>Contacts récents</h3>
                
                <form method="POST" class="export-btn">
                    <input type="hidden" name="action" value="export_contacts">
                    <button type="submit" class="btn btn-secondary">
                        <i class="fas fa-download"></i> Exporter en CSV
                    </button>
                </form>
                
                <?php
                $recent_contacts = get_recent_contacts(20);
                ?>
                
                <table>
                    <thead>
                        <tr>
                            <th>Statut</th>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Langue</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($recent_contacts as $contact): ?>
                        <tr>
                            <td>
                                <span class="read-status <?php echo $contact['read_status'] ? 'read' : 'unread'; ?>"></span>
                            </td>
                            <td><?php echo htmlspecialchars($contact['name']); ?></td>
                            <td><?php echo htmlspecialchars($contact['email']); ?></td>
                            <td>
                                <span class="lang-flag">
                                    <?php 
                                    $flags = ['fr' => '🇫🇷', 'en' => '🇬🇧', 'es' => '🇪🇸', 'de' => '🇩🇪'];
                                    echo $flags[$contact['lang']] ?? '🌐';
                                    ?>
                                </span>
                                <?php echo strtoupper($contact['lang']); ?>
                            </td>
                            <td><?php echo date('d/m/Y H:i', strtotime($contact['created_at'])); ?></td>
                            <td>
                                <div class="actions">
                                    <form method="POST" style="display: inline;">
                                        <input type="hidden" name="action" value="<?php echo $contact['read_status'] ? 'mark_unread' : 'mark_read'; ?>">
                                        <input type="hidden" name="id" value="<?php echo $contact['id']; ?>">
                                        <button type="submit" class="btn btn-sm <?php echo $contact['read_status'] ? 'btn-secondary' : 'btn-primary'; ?>">
                                            <?php echo $contact['read_status'] ? 'Marquer non lu' : 'Marquer lu'; ?>
                                        </button>
                                    </form>
                                    
                                    <button type="button" class="btn btn-sm btn-primary" 
                                            onclick="showContactDetails(<?php echo htmlspecialchars(json_encode($contact)); ?>)">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    
                                    <form method="POST" style="display: inline;" onsubmit="return confirm('Supprimer ce contact ?');">
                                        <input type="hidden" name="action" value="delete_contact">
                                        <input type="hidden" name="id" value="<?php echo $contact['id']; ?>">
                                        <button type="submit" class="btn btn-sm btn-danger">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
            
            <!-- Rendez-vous à venir -->
            <div class="section" id="appointments">
                <h3>Rendez-vous à venir</h3>
                
                <?php
                $appointments = get_pending_appointments();
                ?>
                
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Heure</th>
                            <th>Client</th>
                            <th>Service</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($appointments as $appointment): ?>
                        <tr>
                            <td><?php echo date('d/m/Y', strtotime($appointment['date'])); ?></td>
                            <td><?php echo $appointment['time']; ?></td>
                            <td><?php echo htmlspecialchars($appointment['name']); ?><br>
                                <small><?php echo htmlspecialchars($appointment['email']); ?></small>
                            </td>
                            <td><?php echo htmlspecialchars($appointment['service']); ?></td>
                            <td>
                                <span class="status-badge status-<?php echo $appointment['status']; ?>">
                                    <?php echo $appointment['status']; ?>
                                </span>
                            </td>
                            <td>
                                <div class="actions">
                                    <form method="POST" style="display: inline;">
                                        <input type="hidden" name="action" value="update_appointment">
                                        <input type="hidden" name="id" value="<?php echo $appointment['id']; ?>">
                                        <select name="status" onchange="this.form.submit()" style="padding: 0.25rem; border-radius: 4px; border: 1px solid #e2e8f0;">
                                            <option value="pending" <?php echo $appointment['status'] === 'pending' ? 'selected' : ''; ?>>En attente</option>
                                            <option value="confirmed" <?php echo $appointment['status'] === 'confirmed' ? 'selected' : ''; ?>>Confirmé</option>
                                            <option value="cancelled" <?php echo $appointment['status'] === 'cancelled' ? 'selected' : ''; ?>>Annulé</option>
                                        </select>
                                    </form>
                                    
                                    <button type="button" class="btn btn-sm btn-primary"
                                            onclick="showAppointmentDetails(<?php echo htmlspecialchars(json_encode($appointment)); ?>)">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    
    <!-- Modal pour les détails du contact -->
    <div id="contactModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
        <div style="background: white; padding: 2rem; border-radius: 10px; max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3>Détails du contact</h3>
                <button onclick="closeModal('contactModal')" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
            </div>
            <div id="contactDetails"></div>
        </div>
    </div>
    
    <!-- Modal pour les détails du rendez-vous -->
    <div id="appointmentModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
        <div style="background: white; padding: 2rem; border-radius: 10px; max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3>Détails du rendez-vous</h3>
                <button onclick="closeModal('appointmentModal')" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
            </div>
            <div id="appointmentDetails"></div>
        </div>
    </div>
    
    <script>
    function showContactDetails(contact) {
        const details = `
            <p><strong>Nom :</strong> ${contact.name}</p>
            <p><strong>Email :</strong> ${contact.email}</p>
            <p><strong>Téléphone :</strong> ${contact.phone || 'Non fourni'}</p>
            <p><strong>Langue :</strong> ${contact.lang.toUpperCase()}</p>
            <p><strong>Date :</strong> ${new Date(contact.created_at).toLocaleString()}</p>
            <p><strong>IP :</strong> ${contact.ip || 'Non disponible'}</p>
            <p><strong>User Agent :</strong> ${contact.user_agent || 'Non disponible'}</p>
            <div style="margin-top: 1rem; padding: 1rem; background: #f8fafc; border-radius: 5px;">
                <strong>Message :</strong>
                <p>${contact.message.replace(/\n/g, '<br>')}</p>
            </div>
        `;
        
        document.getElementById('contactDetails').innerHTML = details;
        document.getElementById('contactModal').style.display = 'flex';
    }
    
    function showAppointmentDetails(appointment) {
        const details = `
            <p><strong>Client :</strong> ${appointment.name}</p>
            <p><strong>Email :</strong> ${appointment.email}</p>
            <p><strong>Téléphone :</strong> ${appointment.phone || 'Non fourni'}</p>
            <p><strong>Date :</strong> ${appointment.date} à ${appointment.time}</p>
            <p><strong>Service :</strong> ${appointment.service}</p>
            <p><strong>Langue :</strong> ${appointment.lang.toUpperCase()}</p>
            <p><strong>Statut :</strong> ${appointment.status}</p>
            ${appointment.message ? `
            <div style="margin-top: 1rem; padding: 1rem; background: #f8fafc; border-radius: 5px;">
                <strong>Message :</strong>
                <p>${appointment.message.replace(/\n/g, '<br>')}</p>
            </div>
            ` : ''}
        `;
        
        document.getElementById('appointmentDetails').innerHTML = details;
        document.getElementById('appointmentModal').style.display = 'flex';
    }
    
    function closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }
    
    // Fermer les modals en cliquant à l'extérieur
    document.querySelectorAll('#contactModal, #appointmentModal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
    
    // Rafraîchissement automatique toutes les 30 secondes
    setTimeout(() => {
        location.reload();
    }, 30000);
    </script>
</body>
</html>
