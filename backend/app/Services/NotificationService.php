<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\Utilisateur;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Envoie une notification (Email, SMS ou In-App).
     * En mode sandbox : journalise, enregistre en base et simule l'envoi.
     * Prêt à basculer vers Twilio / Brevo via configuration .env.
     */
    public function envoyer(Utilisateur $destinataire, string $canal, string $titre, string $message): Notification
    {
        $notification = Notification::create([
            'utilisateur_id' => $destinataire->id,
            'canal'          => $canal,
            'titre'          => $titre,
            'message'        => $message,
            'statut'         => 'en_attente',
        ]);

        try {
            $driver = config('services.notifications.driver', 'sandbox');

            if ($driver === 'sandbox') {
                $this->simulerEnvoiSandbox($destinataire, $canal, $titre, $message);
            } elseif ($canal === 'sms' && $driver === 'twilio') {
                $this->envoyerSmsTwilio($destinataire->telephone, $message);
            } elseif ($canal === 'email' && $driver === 'brevo') {
                $this->envoyerEmailBrevo($destinataire->email, $titre, $message);
            }

            $notification->update([
                'statut'     => 'envoyee',
                'date_envoi' => now(),
            ]);
        } catch (\Throwable $e) {
            $notification->update([
                'statut'     => 'echec',
                'erreur_log' => $e->getMessage(),
            ]);
            Log::error("Échec de notification [{$canal}] à l'utilisateur {$destinataire->id}: " . $e->getMessage());
        }

        return $notification;
    }

    protected function simulerEnvoiSandbox(Utilisateur $destinataire, string $canal, string $titre, string $message): void
    {
        $cible = $canal === 'sms' ? $destinataire->telephone : $destinataire->email;
        Log::info("=== [NOTIF SANDBOX] Canal: {$canal} | Vers: {$cible} ===");
        Log::info("Titre: {$titre}");
        Log::info("Corps: {$message}");
        Log::info("======================================================");
    }

    protected function envoyerSmsTwilio(?string $telephone, string $message): void
    {
        if (empty($telephone)) {
            throw new \InvalidArgumentException("Numéro de téléphone manquant pour l'envoi SMS.");
        }
        // Implémentation prête pour le SDK Twilio / HTTP Client
        Log::info("Appel API Twilio SMS vers {$telephone}");
    }

    protected function envoyerEmailBrevo(string $email, string $titre, string $message): void
    {
        // Implémentation prête pour l'API Brevo / SMTP
        Log::info("Appel API Brevo Email vers {$email}");
    }
}
