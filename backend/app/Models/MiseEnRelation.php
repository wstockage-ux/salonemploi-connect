<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MiseEnRelation extends Model
{
    use HasFactory;

    protected $table = 'mises_en_relation';

    protected $fillable = [
        'offre_id',
        'demandeur_emploi_id',
        'agent_initiateur_id',
        'score_matching',
        'detail_score',
        'statut',
        'commentaire_agent',
    ];

    protected $casts = [
        'score_matching' => 'float',
        'detail_score' => 'array',
    ];

    public function offre()
    {
        return $this->belongsTo(Offre::class, 'offre_id');
    }

    public function demandeurEmploi()
    {
        return $this->belongsTo(DemandeurEmploi::class, 'demandeur_emploi_id');
    }

    public function agentInitiateur()
    {
        return $this->belongsTo(Agent::class, 'agent_initiateur_id');
    }
}
