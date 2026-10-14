<?php

namespace App\Http\Middleware;

use App\Models\JournalConnexion;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuditLogMiddleware
{
    /**
     * Enregistre l'activité sensible dans les logs ou le journal.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Si la requête concerne une tentative de connexion ou action d'authentification
        if ($request->is('api/v1/auth/login') && $request->isMethod('POST')) {
            $user = $request->user();
            $status = $response->getStatusCode() === 200 ? 'succes' : 'echec';
            $motif = $status === 'echec' ? 'Identifiants ou mot de passe incorrects' : null;

            JournalConnexion::create([
                'utilisateur_id' => $user ? $user->id : null,
                'email_tente'    => (string) $request->input('email', 'anonyme'),
                'adresse_ip'     => (string) $request->ip(),
                'user_agent'     => substr((string) $request->userAgent(), 0, 255),
                'statut'         => $status,
                'motif_echec'    => $motif,
                'created_at'     => now(),
            ]);
        }

        return $response;
    }
}
