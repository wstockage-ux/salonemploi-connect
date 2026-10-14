<?php

namespace App\Services;

use App\Models\Insertion;
use App\Models\Agent;
use Illuminate\Support\Facades\DB;

class InsertionService
{
    /**
     * Calcule les indicateurs clés et taux d'insertion globaux.
     */
    public function getStatistiquesGlobales(): array
    {
        $totalInsertions = Insertion::count();
        $confirmes = Insertion::where('decision', 'embauche')->count();
        $enEssai = Insertion::where('decision', 'periode_essai')->count();

        // Taux de maintien à 1, 3 et 6 mois
        $maintien1m = Insertion::where('suivi_1m_statut', 'confirme_en_poste')->count();
        $maintien3m = Insertion::where('suivi_3m_statut', 'confirme_en_poste')->count();
        $maintien6m = Insertion::where('suivi_6m_statut', 'confirme_en_poste')->count();

        // Par secteur
        $parSecteur = DB::table('insertions')
            ->join('entreprises', 'insertions.entreprise_id', '=', 'entreprises.id')
            ->select('entreprises.secteur_activite', DB::raw('COUNT(insertions.id) as total'))
            ->groupBy('entreprises.secteur_activite')
            ->get();

        return [
            'total_dossiers'     => $totalInsertions,
            'embauches_fermes'   => $confirmes,
            'en_periode_essai'   => $enEssai,
            'taux_maintien_1m'   => $totalInsertions > 0 ? round(($maintien1m / $totalInsertions) * 100, 1) : 0,
            'taux_maintien_3m'   => $totalInsertions > 0 ? round(($maintien3m / $totalInsertions) * 100, 1) : 0,
            'taux_maintien_6m'   => $totalInsertions > 0 ? round(($maintien6m / $totalInsertions) * 100, 1) : 0,
            'repartition_secteur'=> $parSecteur,
        ];
    }

    /**
     * Récupère les relances d'insertion échues pour un agent.
     */
    public function getRelancesEchuesPourAgent(int $agentId): array
    {
        $dateNow = now()->toDateString();

        return Insertion::where('agent_id', $agentId)
            ->where(function ($q) use ($dateNow) {
                $q->where(function ($sq) use ($dateNow) {
                    $sq->where('suivi_1m_statut', 'a_relancer')
                       ->whereRaw('DATE_ADD(date_prise_poste, INTERVAL 30 DAY) <= ?', [$dateNow]);
                })->orWhere(function ($sq) use ($dateNow) {
                    $sq->where('suivi_3m_statut', 'a_relancer')
                       ->whereRaw('DATE_ADD(date_prise_poste, INTERVAL 90 DAY) <= ?', [$dateNow]);
                })->orWhere(function ($sq) use ($dateNow) {
                    $sq->where('suivi_6m_statut', 'a_relancer')
                       ->whereRaw('DATE_ADD(date_prise_poste, INTERVAL 180 DAY) <= ?', [$dateNow]);
                });
            })
            ->with(['demandeurEmploi', 'entreprise'])
            ->get()
            ->toArray();
    }
}
