<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DemandeurEmploi extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'demandeurs_emploi';

    protected $fillable = [
        'utilisateur_id',
        'agent_referent_id',
        'numero_de',
        'nom',
        'prenom',
        'date_naissance',
        'adresse',
        'ville',
        'code_postal',
        'rayon_mobilite_km',
        'niveau_etudes',
        'filiere_formation',
        'experience_annees',
        'competences',
        'types_contrats_recherches',
        'statut_recherche',
        'cv_path',
        'cv_nom_original',
        'lettre_motivation_defaut',
    ];

    protected $casts = [
        'date_naissance' => 'date',
        'competences' => 'array',
        'types_contrats_recherches' => 'array',
        'rayon_mobilite_km' => 'integer',
        'experience_annees' => 'integer',
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id');
    }

    public function agentReferent()
    {
        return $this->belongsTo(Agent::class, 'agent_referent_id');
    }

    public function candidatures()
    {
        return $this->hasMany(Candidature::class, 'demandeur_emploi_id');
    }

    public function misesEnRelation()
    {
        return $this->hasMany(MiseEnRelation::class, 'demandeur_emploi_id');
    }

    public function coachings()
    {
        return $this->hasMany(Coaching::class, 'demandeur_emploi_id');
    }

    public function insertions()
    {
        return $this->hasMany(Insertion::class, 'demandeur_emploi_id');
    }

    public function getNomCompletAttribute(): string
    {
        return "{$this->prenom} {$this->nom}";
    }
}
