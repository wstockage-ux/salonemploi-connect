<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Offre extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'offres';

    protected $fillable = [
        'entreprise_id',
        'agent_validateur_id',
        'reference',
        'intitule',
        'description',
        'nombre_postes',
        'type_contrat',
        'niveau_etudes',
        'competences_requises',
        'experience_requise_mois',
        'ville',
        'code_postal',
        'teletravail',
        'remuneration_fourchette',
        'date_limite',
        'statut',
        'motif_refus',
        'date_validation',
    ];

    protected $casts = [
        'competences_requises' => 'array',
        'teletravail' => 'boolean',
        'date_limite' => 'date',
        'date_validation' => 'datetime',
        'nombre_postes' => 'integer',
        'experience_requise_mois' => 'integer',
    ];

    public function entreprise()
    {
        return $this->belongsTo(Entreprise::class, 'entreprise_id');
    }

    public function agentValidateur()
    {
        return $this->belongsTo(Agent::class, 'agent_validateur_id');
    }

    public function candidatures()
    {
        return $this->hasMany(Candidature::class, 'offre_id');
    }

    public function misesEnRelation()
    {
        return $this->hasMany(MiseEnRelation::class, 'offre_id');
    }

    public function insertions()
    {
        return $this->hasMany(Insertion::class, 'offre_id');
    }
}
