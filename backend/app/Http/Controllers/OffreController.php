<?php

namespace App\Http\Controllers;

use App\Models\Offre;
use App\Models\Entreprise;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class OffreController extends Controller
{
    public function __construct(
        protected NotificationService $notificationService
    ) {}

    /**
     * Liste des offres avec filtres (Catalogue public ou filtré selon rôle).
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Offre::with(['entreprise', 'agentValidateur']);

        // Restrictions selon le profil
        if ($user && $user->hasRole('entreprise')) {
            $entrepriseId = $user->entreprise?->id;
            $query->where('entreprise_id', $entrepriseId);
        } elseif ($user && $user->hasRole('agent')) {
            // L'agent voit les offres de son portefeuille ou toutes s'il filtre
            if ($request->boolean('mon_portefeuille')) {
                $agentId = $user->agent?->id;
                $query->whereHas('entreprise', fn($q) => $q->where('agent_referent_id', $agentId));
            }
        } elseif ($user && $user->hasRole('de')) {
            // Le DE ne voit que les offres publiées
            $query->where('statut', 'publiee');
        }

        // Filtres de recherche
        if ($request->filled('statut')) {
            $query->where('statut', $request->input('statut'));
        }
        if ($request->filled('secteur')) {
            $query->whereHas('entreprise', fn($q) => $q->where('secteur_activite', $request->input('secteur')));
        }
        if ($request->filled('type_contrat')) {
            $query->where('type_contrat', $request->input('type_contrat'));
        }
        if ($request->filled('niveau_etudes')) {
            $query->where('niveau_etudes', $request->input('niveau_etudes'));
        }
        if ($request->filled('ville')) {
            $query->where('ville', 'like', '%' . $request->input('ville') . '%');
        }
        if ($request->filled('search')) {
            $s = $request->input('search');
            $query->where(function ($q) use ($s) {
                $q->where('intitule', 'like', "%{$s}%")
                  ->orWhere('description', 'like', "%{$s}%")
                  ->orWhere('reference', 'like', "%{$s}%");
            });
        }

        $offres = $query->orderBy('created_at', 'desc')->paginate($request->input('per_page', 15));

        return response()->json([
            'success' => true,
            'data'    => $offres,
        ]);
    }

    /**
     * Dépôt d'une nouvelle offre par une entreprise (ou son agent référent).
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'entreprise_id'           => 'nullable|exists:entreprises,id',
            'intitule'                => 'required|string|max:150',
            'description'             => 'required|string',
            'nombre_postes'           => 'required|integer|min:1',
            'type_contrat'            => 'required|in:CDI,CDD,Alternance,Stage,Interim',
            'niveau_etudes'           => 'required|in:Sans_diplome,CAP_BEP,Bac,Bac_2,Bac_3,Bac_5_plus',
            'competences_requises'    => 'required|array',
            'experience_requise_mois' => 'nullable|integer|min:0',
            'ville'                   => 'required|string|max:100',
            'code_postal'             => 'required|string|max:10',
            'teletravail'             => 'nullable|boolean',
            'remuneration_fourchette' => 'nullable|string|max:100',
            'date_limite'             => 'required|date|after:today',
        ]);

        $entrepriseId = $user->hasRole('entreprise') 
            ? $user->entreprise->id 
            : $validated['entreprise_id'];

        $reference = 'OFF-' . date('Y') . '-' . strtoupper(substr(uniqid(), -5));

        $offre = Offre::create([
            ...$validated,
            'entreprise_id' => $entrepriseId,
            'reference'     => $reference,
            'statut'        => 'en_validation',
        ]);

        // Notification à l'agent référent de l'entreprise
        $entreprise = Entreprise::with('agentReferent.utilisateur')->find($entrepriseId);
        if ($entreprise?->agentReferent?->utilisateur) {
            $this->notificationService->envoyer(
                $entreprise->agentReferent->utilisateur,
                'in_app',
                'Nouvelle offre à valider',
                "L'entreprise {$entreprise->raison_sociale} a déposé l'offre [{$offre->reference}] {$offre->intitule}."
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Offre créée avec succès et soumise pour validation.',
            'data'    => $offre,
        ], 201);
    }

    /**
     * Validation d'une offre par l'agent référent (Statut -> publiee).
     */
    public function valider(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $agent = $user->agent;

        $offre = Offre::with('entreprise.utilisateur')->findOrFail($id);

        $offre->update([
            'statut'              => 'publiee',
            'agent_validateur_id' => $agent?->id,
            'date_validation'     => now(),
            'motif_refus'         => null,
        ]);

        // Notification à l'entreprise
        if ($offre->entreprise?->utilisateur) {
            $this->notificationService->envoyer(
                $offre->entreprise->utilisateur,
                'email',
                'Votre offre a été validée et publiée !',
                "Votre offre [{$offre->reference}] '{$offre->intitule}' est désormais visible par l'ensemble des candidats au salon."
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'L offre a été validée et publiée.',
            'data'    => $offre,
        ]);
    }

    /**
     * Demande de modifications ou rejet avec motif par l'agent.
     */
    public function refuser(Request $request, int $id): JsonResponse
    {
        $request->validate(['motif' => 'required|string']);

        $offre = Offre::with('entreprise.utilisateur')->findOrFail($id);

        $offre->update([
            'statut'      => 'brouillon',
            'motif_refus' => $request->input('motif'),
        ]);

        if ($offre->entreprise?->utilisateur) {
            $this->notificationService->envoyer(
                $offre->entreprise->utilisateur,
                'email',
                'Modifications demandées sur votre offre',
                "L agent référent demande des ajustements sur l offre '{$offre->intitule}' : " . $request->input('motif')
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Demande de modifications transmise à l entreprise.',
            'data'    => $offre,
        ]);
    }
}
