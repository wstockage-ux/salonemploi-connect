<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OffreController;
use App\Http\Controllers\CandidatureController;
use App\Http\Controllers\MerController;
use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes — SalonEmploi Connect (v1)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // --- 1. Authentification Publique ---
    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/mot-de-passe-oublie', [AuthController::class, 'motDePasseOublie']);
    });

    // --- 2. Consultation des Offres d'emploi ---
    Route::get('/offres', [OffreController::class, 'index']);

    // --- 3. Routes Sécurisées (Sanctum) ---
    Route::middleware('auth:sanctum')->group(function () {

        // Session & Profil
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::post('/auth/consentement-rgpd', [AuthController::class, 'consentementRgpd']);

        // --- Rôle : Administrateur / Coordination ---
        Route::middleware('role:admin')->prefix('admin')->group(function () {
            Route::get('/dashboard', [DashboardController::class, 'coordination']);
            Route::get('/audit-connexions', function () {
                return response()->json([
                    'success' => true,
                    'data' => \App\Models\JournalConnexion::with('utilisateur')
                        ->orderBy('created_at', 'desc')
                        ->paginate(20),
                ]);
            });
        });

        // --- Rôle : Agent Opérationnel ---
        Route::middleware('role:agent')->prefix('agent')->group(function () {
            Route::get('/dashboard', [DashboardController::class, 'agent']);
            Route::put('/offres/{id}/valider', [OffreController::class, 'valider']);
            Route::put('/offres/{id}/refuser', [OffreController::class, 'refuser']);
            Route::get('/mer/suggestions/{offreId}', [MerController::class, 'suggererPourOffre']);
            Route::post('/mer', [MerController::class, 'creerMer']);
        });

        // --- Rôle : Entreprise Recruteur ---
        Route::middleware('role:entreprise')->prefix('entreprise')->group(function () {
            Route::post('/offres', [OffreController::class, 'store']);
            Route::put('/candidatures/{id}/statut', [CandidatureController::class, 'changerStatut']);
        });

        // --- Rôle : Demandeur d'Emploi ---
        Route::middleware('role:de')->prefix('candidat')->group(function () {
            Route::post('/postuler', [CandidatureController::class, 'postuler']);
            Route::get('/mes-candidatures', [CandidatureController::class, 'mesCandidatures']);
        });

        // Routes partagées
        Route::put('/candidatures/{id}/statut', [CandidatureController::class, 'changerStatut'])
            ->middleware('role:admin,agent,entreprise');
    });
});
