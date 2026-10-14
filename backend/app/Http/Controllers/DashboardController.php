<?php

namespace App\Http\Controllers;

use App\Models\Entreprise;
use App\Models\Offre;
use App\Models\DemandeurEmploi;
use App\Models\Candidature;
use App\Models\Entretien;
use App\Models\Insertion;
use App\Models\Agent;
use App\Models\Objectif;
use App\Services\InsertionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function __construct(
        protected InsertionService $insertionService
    ) {}

    /**
     * Tableau de bord Administrateur / Coordination Globale.
     * Cibles : 50 entreprises, 1 000 offres, 4 000 DE, entonnoir et classement des 15 agents.
     */
    public function coordination(): JsonResponse
    {
        $nbEntreprises = Entreprise::count();
        $nbOffres = Offre::count();
        $nbDemandeurs = DemandeurEmploi::count();
        $nbCandidatures = Candidature::count();
        $nbEntretiens = Entretien::count();
        $nbInsertions = Insertion::whereIn('decision', ['embauche', 'periode_essai'])->count();

        // 1. Entonnoir de conversion global
        $funnel = [
            'offres'        => $nbOffres,
            'candidatures'  => $nbCandidatures,
            'entretiens'    => $nbEntretiens,
            'embauches'     => $nbInsertions,
        ];

        // 2. Progression et classement des 15 agents
        $agents = Agent::with('objectif')->get()->map(function ($agt) {
            $offresCount = Offre::whereHas('entreprise', fn($q) => $q->where('agent_referent_id', $agt->id))->count();
            $deCount = DemandeurEmploi::where('agent_referent_id', $agt->id)->count();
            $insertionsCount = Insertion::where('agent_id', $agt->id)->count();

            $cibleOffres = $agt->objectif?->cible_offres ?: 70;
            $cibleInsertions = $agt->objectif?->cible_insertions ?: 50;

            $pctOffres = round(($offresCount / $cibleOffres) * 100, 1);
            $pctInsertions = round(($insertionsCount / $cibleInsertions) * 100, 1);

            return [
                'id'              => $agt->id,
                'matricule'       => $agt->matricule,
                'nom_complet'     => $agt->nom_complet,
                'pole'            => $agt->pole_affectation,
                'offres_collectees' => $offresCount,
                'cible_offres'    => $cibleOffres,
                'pct_offres'      => $pctOffres,
                'insertions'      => $insertionsCount,
                'cible_insertions'=> $cibleInsertions,
                'pct_insertions'  => $pctInsertions,
                'score_global_pct'=> round(($pctOffres + $pctInsertions) / 2, 1),
            ];
        })->sortByDesc('score_global_pct')->values();

        // 3. Alertes temps réel
        $alertes = [];
        $offresSansCandidats = Offre::where('statut', 'publiee')
            ->doesntHave('candidatures')
            ->count();

        if ($offresSansCandidats > 0) {
            $alertes[] = [
                'type'    => 'warning',
                'titre'   => 'Offres sans candidat',
                'message' => "{$offresSansCandidats} offre(s) publiée(s) n'ont reçu aucune candidature.",
            ];
        }

        $offresEnAttente = Offre::where('statut', 'en_validation')->count();
        if ($offresEnAttente > 0) {
            $alertes[] = [
                'type'    => 'info',
                'titre'   => 'Offres en attente de validation',
                'message' => "{$offresEnAttente} offre(s) sont en attente d'approbation par les agents référents.",
            ];
        }

        return response()->json([
            'success' => true,
            'data'    => [
                'jauges' => [
                    'entreprises' => ['actuel' => $nbEntreprises, 'cible' => 50, 'pct' => round(($nbEntreprises / 50) * 100, 1)],
                    'offres'      => ['actuel' => $nbOffres, 'cible' => 1000, 'pct' => round(($nbOffres / 1000) * 100, 1)],
                    'demandeurs'  => ['actuel' => $nbDemandeurs, 'cible' => 4000, 'pct' => round(($nbDemandeurs / 4000) * 100, 1)],
                    'insertions'  => ['actuel' => $nbInsertions, 'cible' => 750, 'pct' => round(($nbInsertions / 750) * 100, 1)],
                ],
                'funnel'    => $funnel,
                'agents'    => $agents,
                'alertes'   => $alertes,
                'statistiques_insertion' => $this->insertionService->getStatistiquesGlobales(),
            ],
        ]);
    }

    /**
     * Tableau de bord personnel Agent.
     */
    public function agent(Request $request): JsonResponse
    {
        $agent = $request->user()->agent;

        if (!$agent) {
            return response()->json(['success' => false, 'message' => 'Profil agent introuvable.'], 403);
        }

        $agent->load('objectif');

        $nbEntreprises = Entreprise::where('agent_referent_id', $agent->id)->count();
        $nbOffres = Offre::whereHas('entreprise', fn($q) => $q->where('agent_referent_id', $agent->id))->count();
        $nbDE = DemandeurEmploi::where('agent_referent_id', $agent->id)->count();
        $nbInsertions = Insertion::where('agent_id', $agent->id)->count();

        // Tâches du jour
        $offresAValider = Offre::whereHas('entreprise', fn($q) => $q->where('agent_referent_id', $agent->id))
            ->where('statut', 'en_validation')
            ->with('entreprise')
            ->get();

        $entretiensDuJour = Entretien::whereDate('date_heure_debut', today())
            ->whereHas('candidature.demandeurEmploi', fn($q) => $q->where('agent_referent_id', $agent->id))
            ->with(['candidature.demandeurEmploi', 'candidature.offre.entreprise'])
            ->get();

        $relances = $this->insertionService->getRelancesEchuesPourAgent($agent->id);

        return response()->json([
            'success' => true,
            'data'    => [
                'agent' => [
                    'nom_complet' => $agent->nom_complet,
                    'matricule'   => $agent->matricule,
                    'pole'        => $agent->pole_affectation,
                ],
                'objectifs' => [
                    'entreprises' => ['actuel' => $nbEntreprises, 'cible' => $agent->objectif?->cible_entreprises ?? 4],
                    'offres'      => ['actuel' => $nbOffres, 'cible' => $agent->objectif?->cible_offres ?? 70],
                    'demandeurs'  => ['actuel' => $nbDE, 'cible' => $agent->objectif?->cible_mer ?? 270],
                    'insertions'  => ['actuel' => $nbInsertions, 'cible' => $agent->objectif?->cible_insertions ?? 50],
                ],
                'taches_du_jour' => [
                    'offres_a_valider'    => $offresAValider,
                    'entretiens_du_jour'  => $entretiensDuJour,
                    'relances_a_effectuer'=> $relances,
                ],
            ],
        ]);
    }
}
