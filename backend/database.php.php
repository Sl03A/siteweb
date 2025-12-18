<?php
class Database {
    private static $instance = null;
    private $pdo;
    
    private function __construct() {
        try {
            $this->pdo = new PDO(
                'sqlite:' . __DIR__ . '/database.sqlite',
                null,
                null,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
            $this->createTables();
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            throw $e;
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function createTables() {
        // Table contacts
        $this->pdo->exec("
            CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                message TEXT NOT NULL,
                lang TEXT DEFAULT 'fr',
                ip TEXT,
                user_agent TEXT,
                read_status INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ");
        
        // Table newsletter
        $this->pdo->exec("
            CREATE TABLE IF NOT EXISTS newsletter (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                lang TEXT DEFAULT 'fr',
                ip TEXT,
                subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                active INTEGER DEFAULT 1
            )
        ");
        
        // Table appointments
        $this->pdo->exec("
            CREATE TABLE IF NOT EXISTS appointments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                date DATE NOT NULL,
                time TIME NOT NULL,
                service TEXT NOT NULL,
                message TEXT,
                lang TEXT DEFAULT 'fr',
                status TEXT DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ");
        
        // Table orders
        $this->pdo->exec("
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_number TEXT UNIQUE NOT NULL,
                customer_name TEXT NOT NULL,
                customer_email TEXT NOT NULL,
                customer_phone TEXT,
                total_amount REAL NOT NULL,
                currency TEXT DEFAULT 'EUR',
                items TEXT, -- JSON des articles
                status TEXT DEFAULT 'pending',
                lang TEXT DEFAULT 'fr',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ");
        
        // Table rate_limits
        $this->pdo->exec("
            CREATE TABLE IF NOT EXISTS rate_limits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ip TEXT NOT NULL,
                action TEXT NOT NULL,
                timestamp INTEGER NOT NULL
            )
        ");
        
        // Table analytics (optionnel)
        $this->pdo->exec("
            CREATE TABLE IF NOT EXISTS analytics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                page TEXT NOT NULL,
                lang TEXT DEFAULT 'fr',
                ip TEXT,
                user_agent TEXT,
                referrer TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ");
    }
    
    public function getConnection() {
        return $this->pdo;
    }
    
    // Méthodes utilitaires
    public function getContacts($limit = 50) {
        $stmt = $this->pdo->prepare("SELECT * FROM contacts ORDER BY created_at DESC LIMIT ?");
        $stmt->execute([$limit]);
        return $stmt->fetchAll();
    }
    
    public function getSubscribersCount() {
        $stmt = $this->pdo->query("SELECT COUNT(*) as count FROM newsletter WHERE active = 1");
        return $stmt->fetch()['count'];
    }
    
    public function getPendingAppointments() {
        $stmt = $this->pdo->prepare("SELECT * FROM appointments WHERE date >= DATE('now') AND status = 'pending' ORDER BY date, time");
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
?>