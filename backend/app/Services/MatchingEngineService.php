<?php

namespace App\Services;

use App\Models\Offre;
use App\Models\DemandeurEmploi;

class MatchingEngineService
{
    public const SEUIL_PRECONISATION = 65.0;

    protected array $hierarchieEtudes = [
        'Sans_diplome' => 1,
        'CAP_BEP'      => 2,
        'Bac'          => 3,
        'Bac_2'        => 4,
        'Bac_3'        => 5,
        'Bac_5_plus'   => 6,
    ];

    /**
     * Calcule le score de correspondance MER complet entre une offre et un demandeur d'emploi.
     * Pondérations :
     * - Compétences : 50%
     * - Mobilité / Localisation : 25%
     * - Niveau d'études : 15%
     * - Type de contrat : 10%
     */
    public function calculerScore(Offre $offre, DemandeurEmploi $demandeur): array
    {
        $scoreCompetences = $this->calculerScoreCompetences($offre, $demandeur);
        $scoreMobilite    = $this->calculerScoreMobilite($offre, $demandeur);
        $scoreEtudes      = $this->calculerScoreEtudes($offre, $demandeur);
        $scoreContrat     = $this->calculerScoreContrat($offre, $demandeur);

        $totalScore = round($scoreCompetences + $scoreMobilite + $scoreEtudes + $scoreContrat, 2);

        return [
            'score_total' => $totalScore,
            'est_eligible' => $totalScore >= self::SEUIL_PRECONISATION,
            'details' => [
                'competences' => round($scoreCompetences, 2),
                'mobilite'    => round($scoreMobilite, 2),
                'etudes'      => round($scoreEtudes, 2),
                'contrat'     => round($scoreContrat, 2),
            ],
        ];
    }

    /**
     * Compétences : pondération max 50 points
     */
    protected function calculerScoreCompetences(Offre $offre, DemandeurEmploi $demandeur): float
    {
        $requises = is_array($offre->competences_requises) ? $offre->competences_requises : [];
        $possedees = is_array($demandeur->competences) ? $demandeur->competences : [];

        if (empty($requises)) {
            return 50.0;
        }

        $requisesNorm = array_map('mb_strtolower', array_map('trim', $requises));
        $possedeesNorm = array_map('mb_strtolower', array_map('trim', $possedees));

        $communes = array_intersect($requisesNorm, $possedeesNorm);
        $ratio = count($communes) / count($requisesNorm);

        return $ratio * 50.0;
    }

    /**
     * Mobilité / Localisation : pondération max 25 points
     */
    protected function calculerScoreMobilite(Offre $offre, DemandeurEmploi $demandeur): float
    {
        // Si même code postal ou même ville
        if (strcasecmp($offre->ville, $demandeur->ville) === 0 || $offre->code_postal === $demandeur->code_postal) {
            return 25.0;
        }

        // Si même département (2 premiers chiffres du code postal)
        $depOffre = substr($offre->code_postal, 0, 2);
        $depDE    = substr($demandeur->code_postal, 0, 2);

        if ($depOffre === $depDE) {
            // Dans le même département, on vérifie le rayon de mobilité
            if ($demandeur->rayon_mobilite_km >= 20) {
                return 22.0;
            }
            return 18.0;
        }

        // Si télétravail possible
        if ($offre->teletravail) {
            return 23.0;
        }

        // Département limitrophe ou mobilité étendue (>= 30 km)
        if ($demandeur->rayon_mobilite_km >= 30) {
            return 14.0;
        }

        return 5.0;
    }

    /**
     * Niveau d'études : pondération max 15 points
     */
    protected function calculerScoreEtudes(Offre $offre, DemandeurEmploi $demandeur): float
    {
        $niveauRequis   = $this->hierarchieEtudes[$offre->niveau_etudes] ?? 1;
        $niveauCandidat = $this->hierarchieEtudes[$demandeur->niveau_etudes] ?? 1;

        if ($niveauCandidat >= $niveauRequis) {
            return 15.0;
        }

        // 1 niveau en dessous
        if ($niveauCandidat === ($niveauRequis - 1)) {
            return 9.0;
        }

        // 2 niveaux en dessous
        if ($niveauCandidat === ($niveauRequis - 2)) {
            return 4.0;
        }

        return 0.0;
    }

    /**
     * Type de contrat : pondération max 10 points
     */
    protected function calculerScoreContrat(Offre $offre, DemandeurEmploi $demandeur): float
    {
        $contratsRecherches = is_array($demandeur->types_contrats_recherches) ? $demandeur->types_contrats_recherches : [];

        if (empty($contratsRecherches)) {
            return 7.0; // Neutre
        }

        foreach ($contratsRecherches as $contrat) {
            if (strcasecmp($contrat, $offre->type_contrat) === 0) {
                return 10.0;
            }
        }

        // Si le DE cherche un CDD et que l'offre est un CDI
        if ($offre->type_contrat === 'CDI' && in_array('CDD', $contratsRecherches)) {
            return 8.0;
        }

        return 2.0;
    }
}
