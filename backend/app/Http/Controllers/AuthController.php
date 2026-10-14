<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use App\Models\JournalConnexion;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(
        protected NotificationService $notificationService
    ) {}

    /**
     * Authentification unique et génération du jeton Sanctum.
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email'    => 'required|string',
            'password' => 'required|string',
        ]);

        $identifiant = trim($validated['email']);

        // Recherche par email OU par numéro DE OU par matricule agent
        $user = Utilisateur::with(['role', 'agent', 'entreprise', 'demandeurEmploi'])
            ->where('email', $identifiant)
            ->orWhereHas('agent', fn($q) => $q->where('matricule', $identifiant))
            ->orWhereHas('demandeurEmploi', fn($q) => $q->where('numero_de', $identifiant))
            ->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            JournalConnexion::create([
                'utilisateur_id' => $user?->id,
                'email_tente'    => $identifiant,
                'adresse_ip'     => (string) $request->ip(),
                'user_agent'     => substr((string) $request->userAgent(), 0, 255),
                'statut'         => 'echec',
                'motif_echec'    => 'Identifiants ou mot de passe incorrects',
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Identifiant ou mot de passe incorrect.',
            ], 401);
        }

        if (!$user->actif) {
            JournalConnexion::create([
                'utilisateur_id' => $user->id,
                'email_tente'    => $identifiant,
                'adresse_ip'     => (string) $request->ip(),
                'user_agent'     => substr((string) $request->userAgent(), 0, 255),
                'statut'         => 'echec',
                'motif_echec'    => 'Compte désactivé',
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Ce compte a été désactivé par la coordination.',
            ], 403);
        }

        $user->update([
            'derniere_connexion_at' => now(),
        ]);

        JournalConnexion::create([
            'utilisateur_id' => $user->id,
            'email_tente'    => $identifiant,
            'adresse_ip'     => (string) $request->ip(),
            'user_agent'     => substr((string) $request->userAgent(), 0, 255),
            'statut'         => 'succes',
        ]);

        // Création du token d'accès avec rôle
        $token = $user->createToken('salonemploi_token', [$user->role->code])->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie.',
            'data'    => [
                'token' => $token,
                'user'  => $this->formatUserResponse($user),
            ],
        ]);
    }

    /**
     * Déconnexion sécurisée et révocation des jetons.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Session terminée avec succès.',
        ]);
    }

    /**
     * Profil de l'utilisateur connecté.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load(['role', 'agent', 'entreprise', 'demandeurEmploi']);

        return response()->json([
            'success' => true,
            'data'    => $this->formatUserResponse($user),
        ]);
    }

    /**
     * Enregistrement du consentement RGPD lors de la 1ère connexion.
     */
    public function consentementRgpd(Request $request): JsonResponse
    {
        $user = $request->user();

        $user->update([
            'consentement_rgpd' => true,
            'date_consentement' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Consentement RGPD enregistré avec succès.',
        ]);
    }

    /**
     * Réinitialisation de mot de passe par Email ou SMS.
     */
    public function motDePasseOublie(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'identifiant' => 'required|string',
            'canal'       => 'required|in:email,sms',
        ]);

        $user = Utilisateur::where('email', $validated['identifiant'])
            ->orWhere('telephone', $validated['identifiant'])
            ->first();

        if ($user) {
            $canal = $validated['canal'];
            $titre = "Réinitialisation de mot de passe SalonEmploi Connect";
            $message = "Code de réinitialisation temporaire : " . rand(100000, 999999) . ". Valable 15 minutes.";

            $this->notificationService->envoyer($user, $canal, $titre, $message);
        }

        return response()->json([
            'success' => true,
            'message' => 'Si ce compte existe, les instructions de réinitialisation ont été envoyées.',
        ]);
    }

    protected function formatUserResponse(Utilisateur $user): array
    {
        $profil = null;
        if ($user->hasRole('agent')) {
            $profil = $user->agent;
        } elseif ($user->hasRole('entreprise')) {
            $profil = $user->entreprise;
        } elseif ($user->hasRole('de')) {
            $profil = $user->demandeurEmploi;
        }

        return [
            'id'                => $user->id,
            'email'             => $user->email,
            'telephone'         => $user->telephone,
            'role'              => $user->role->code,
            'role_libelle'      => $user->role->libelle,
            'consentement_rgpd' => $user->consentement_rgpd,
            'date_consentement' => $user->date_consentement,
            'profil'            => $profil,
        ];
    }
}
