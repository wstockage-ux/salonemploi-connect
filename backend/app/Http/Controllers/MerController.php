<?php

namespace App\Http\Controllers;

use App\Models\Offre;
use App\Models\DemandeurEmploi;
use App\Models\MiseEnRelation;
use App\Services\MatchingEngineService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MerController extends Controller
{
    public function __construct(
        protected MatchingEngineService $matchingEngine,
        protected NotificationService $notificationService
    ) {}

    /**
     * Moteur de Matching automatique : suggestions des meilleurs DE pour une offre donnée.
     */
    public function suggererPourOffre(int $offreId): JsonResponse
    {
        $offre = Offre::with('entreprise')->findOrFail($offreId);

        // Récupération des demandeurs d'emploi en recherche active
        $demandeurs = DemandeurEmploi::where('statut_recherche', 'actif')
            ->with('utilisateur')
            ->get();

        $resultats = [];

        foreach ($demandeurs as $de) {
            $calcul = $this->matchingEngine->calculerScore($offre, $de);

            // On ne retient que les profils ayant un score pertinent (> 40%) pour la proposition
            if ($calcul['score_total'] >= 40.0) {
                $resultats[] = [
                    'demandeur'    => [
                        'id'                => $de->id,
                        'nom_complet'       => $de->nom_complet,
                        'ville'             => $de->ville,
                        'niveau_etudes'     => $de->niveau_etudes,
                        'competences'       => $de->competences,
                        'experience_annees' => $de->experience_annees,
                    ],
                    'score_matching' => $calcul['score_total'],
                    'est_eligible'   => $calcul['est_eligible'],
                    'details'        => $calcul['details'],
                ];
            }
        }

        // Tri décroissant par score
        usort($resultats, fn($a, $b) => $b['score_matching'] <=> $a['score_matching']);

        return response()->json([
            'success' => true,
            'offre'   => [
                'id'                   => $offre->id,
                'intitule'             => $offre->intitule,
                'entreprise'           => $offre->entreprise->raison_sociale,
                'competences_requises' => $offre->competences_requises,
            ],
            'total_candidats_evalues' => count($demandeurs),
            'suggestions'             => array_slice($resultats, 0, 20),
        ]);
    }

    /**
     * L'agent valide et initie la mise en relation formelle.
     */
    public function creerMer(Request $request): JsonResponse
    {
        $agent = $request->user()->agent;

        $validated = $request->validate([
            'offre_id'            => 'required|exists:offres,id',
            'demandeur_emploi_id' => 'required|exists:demandeurs_emploi,id',
            'commentaire_agent'   => 'nullable|string',
        ]);

        $offre = Offre::with('entreprise.utilisateur')->findOrFail($validated['offre_id']);
        $de = DemandeurEmploi::with('utilisateur')->findOrFail($validated['demandeur_emploi_id']);

        // Calcul du score à date
        $calcul = $this->matchingEngine->calculerScore($offre, $de);

        $mer = MiseEnRelation::updateOrCreate(
            [
                'offre_id'            => $offre->id,
                'demandeur_emploi_id' => $de->id,
            ],
            [
                'agent_initiateur_id' => $agent?->id,
                'score_matching'      => $calcul['score_total'],
                'detail_score'        => $calcul['details'],
                'statut'              => 'proposee',
                'commentaire_agent'   => $validated['commentaire_agent'] ?? null,
            ]
        );

        // Notifications
        if ($de->utilisateur) {
            $this->notificationService->envoyer(
                $de->utilisateur,
                'email',
                'Votre conseiller vous propose une offre adaptée !',
                "Une mise en relation a été établie pour le poste '{$offre->intitule}' chez {$offre->entreprise->raison_sociale} (Score de correspondance : {$calcul['score_total']}%)."
            );
        }

        if ($offre->entreprise?->utilisateur) {
            $this->notificationService->envoyer(
                $offre->entreprise->utilisateur,
                'email',
                'Nouveau profil suggéré par votre agent référent',
                "L agent {$agent?->nom_complet} vous a recommandé le candidat {$de->nom_complet} avec un score d adéquation de {$calcul['score_total']}%."
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Mise en relation créée avec succès.',
            'data'    => $mer,
        ], 201);
    }
}
