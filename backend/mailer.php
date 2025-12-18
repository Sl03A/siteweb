<?php
class Mailer {
    private $smtp_host;
    private $smtp_port;
    private $smtp_user;
    private $smtp_pass;
    private $from_email;
    private $from_name;
    
    public function __construct() {
        require_once 'config.php';
        $this->smtp_host = SMTP_HOST;
        $this->smtp_port = SMTP_PORT;
        $this->smtp_user = SMTP_USER;
        $this->smtp_pass = SMTP_PASS;
        $this->from_email = FROM_EMAIL;
        $this->from_name = FROM_NAME;
    }
    
    public function sendContactEmail($name, $email, $message, $lang = 'fr') {
        $subject = $lang === 'fr' 
            ? "Nouveau message de $name - Slozw"
            : "New message from $name - Slozw";
        
        $body = $lang === 'fr' 
            ? "<h2>Nouveau message de contact</h2>
               <p><strong>Nom:</strong> $name</p>
               <p><strong>Email:</strong> $email</p>
               <p><strong>Message:</strong></p>
               <p>$message</p>"
            : "<h2>New contact message</h2>
               <p><strong>Name:</strong> $name</p>
               <p><strong>Email:</strong> $email</p>
               <p><strong>Message:</strong></p>
               <p>$message</p>";
        
        return $this->sendEmail(ADMIN_EMAIL, $subject, $body);
    }
    
    public function sendWelcomeEmail($to, $lang = 'fr') {
        $subject = $lang === 'fr'
            ? "Bienvenue chez Slozw !"
            : "Welcome to Slozw!";
        
        $body = $lang === 'fr'
            ? $this->getFrenchWelcomeTemplate()
            : $this->getEnglishWelcomeTemplate();
        
        return $this->sendEmail($to, $subject, $body);
    }
    
    public function sendAppointmentConfirmation($data) {
        $lang = $data['lang'] ?? 'fr';
        $subject = $lang === 'fr'
            ? "Confirmation de rendez-vous - Slozw"
            : "Appointment confirmation - Slozw";
        
        $body = $lang === 'fr'
            ? $this->getFrenchAppointmentTemplate($data)
            : $this->getEnglishAppointmentTemplate($data);
        
        // Email au client
        $this->sendEmail($data['email'], $subject, $body);
        
        // Notification admin
        $adminSubject = $lang === 'fr'
            ? "Nouveau rendez-vous: {$data['name']}"
            : "New appointment: {$data['name']}";
        
        $adminBody = $lang === 'fr'
            ? "<h2>Nouveau rendez-vous planifié</h2>
               <p><strong>Client:</strong> {$data['name']}</p>
               <p><strong>Email:</strong> {$data['email']}</p>
               <p><strong>Téléphone:</strong> {$data['phone'] ?? 'Non fourni'}</p>
               <p><strong>Date:</strong> {$data['date']} à {$data['time']}</p>
               <p><strong>Service:</strong> {$data['service']}</p>
               <p><strong>Message:</strong> {$data['message'] ?? 'Aucun message'}</p>"
            : "<h2>New appointment scheduled</h2>
               <p><strong>Client:</strong> {$data['name']}</p>
               <p><strong>Email:</strong> {$data['email']}</p>
               <p><strong>Phone:</strong> {$data['phone'] ?? 'Not provided'}</p>
               <p><strong>Date:</strong> {$data['date']} at {$data['time']}</p>
               <p><strong>Service:</strong> {$data['service']}</p>
               <p><strong>Message:</strong> {$data['message'] ?? 'No message'}</p>";
        
        return $this->sendEmail(ADMIN_EMAIL, $adminSubject, $adminBody);
    }
    
    private function sendEmail($to, $subject, $body) {
        // Utilisation de PHPMailer ou fonction mail() native
        // Version simplifiée avec mail() native
        
        $headers = [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=utf-8',
            'From: ' . $this->from_name . ' <' . $this->from_email . '>',
            'Reply-To: ' . $this->from_email,
            'X-Mailer: PHP/' . phpversion()
        ];
        
        $fullBody = $this->getEmailTemplate($body);
        
        return mail($to, $subject, $fullBody, implode("\r\n", $headers));
    }
    
    private function getEmailTemplate($content) {
        return "
        <!DOCTYPE html>
        <html lang='fr'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Email Slozw</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; }
                .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .footer { text-align: center; margin-top: 30px; padding: 20px; color: #64748b; font-size: 0.9rem; }
                .btn { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>Slozw</h1>
                    <p>Créations Digitales</p>
                </div>
                <div class='content'>
                    $content
                </div>
                <div class='footer'>
                    <p>&copy; " . date('Y') . " Slozw. Tous droits réservés.</p>
                    <p><a href='https://slozw.com/privacy'>Politique de confidentialité</a></p>
                </div>
            </div>
        </body>
        </html>
        ";
    }
    
    private function getFrenchWelcomeTemplate() {
        return "
        <h2>Bienvenue dans la communauté Slozw !</h2>
        <p>Merci de vous être inscrit à notre newsletter. Vous recevrez :</p>
        <ul>
            <li>Des conseils digitaux exclusifs</li>
            <li>Nos dernières réalisations</li>
            <li>Des offres promotionnelles</li>
            <li>Des astuces pour votre business en ligne</li>
        </ul>
        <p>À très bientôt,</p>
        <p><strong>L'équipe Slozw</strong></p>
        <p>
            <a href='https://slozw.com' class='btn'>Visiter notre site</a>
        </p>
        ";
    }
    
    private function getEnglishWelcomeTemplate() {
        return "
        <h2>Welcome to the Slozw community!</h2>
        <p>Thank you for subscribing to our newsletter. You'll receive:</p>
        <ul>
            <li>Exclusive digital tips</li>
            <li>Our latest projects</li>
            <li>Promotional offers</li>
            <li>Tips for your online business</li>
        </ul>
        <p>See you soon,</p>
        <p><strong>The Slozw team</strong></p>
        <p>
            <a href='https://slozw.com/en' class='btn'>Visit our website</a>
        </p>
        ";
    }
    
    private function getFrenchAppointmentTemplate($data) {
        return "
        <h2>Rendez-vous confirmé !</h2>
        <p>Bonjour {$data['name']},</p>
        <p>Votre rendez-vous a été confirmé avec succès.</p>
        
        <div style='background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;'>
            <h3>Détails du rendez-vous :</h3>
            <p><strong>Date :</strong> {$data['date']}</p>
            <p><strong>Heure :</strong> {$data['time']}</p>
            <p><strong>Service :</strong> {$data['service']}</p>
            <p><strong>Votre message :</strong> {$data['message'] ?? 'Aucun message supplémentaire'}</p>
        </div>
        
        <p><strong>Modalités :</strong></p>
        <ul>
            <li>Le rendez-vous aura lieu par visioconférence</li>
            <li>Vous recevrez le lien de connexion 1h avant</li>
            <li>Durée estimée : 45 minutes</li>
            <li>Préparez vos questions et documents</li>
        </ul>
        
        <p>Pour toute modification, contactez-nous à contact@slozw.com</p>
        
        <p>À bientôt,</p>
        <p><strong>Slozw</strong></p>
        ";
    }
    
    private function getEnglishAppointmentTemplate($data) {
        return "
        <h2>Appointment confirmed!</h2>
        <p>Hello {$data['name']},</p>
        <p>Your appointment has been successfully confirmed.</p>
        
        <div style='background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;'>
            <h3>Appointment details:</h3>
            <p><strong>Date:</strong> {$data['date']}</p>
            <p><strong>Time:</strong> {$data['time']}</p>
            <p><strong>Service:</strong> {$data['service']}</p>
            <p><strong>Your message:</strong> {$data['message'] ?? 'No additional message'}</p>
        </div>
        
        <p><strong>Details:</strong></p>
        <ul>
            <li>The appointment will take place via video conference</li>
            <li>You will receive the connection link 1 hour before</li>
            <li>Estimated duration: 45 minutes</li>
            <li>Please prepare your questions and documents</li>
        </ul>
        
        <p>For any changes, contact us at contact@slozw.com</p>
        
        <p>See you soon,</p>
        <p><strong>Slozw</strong></p>
        ";
    }
}
?>
