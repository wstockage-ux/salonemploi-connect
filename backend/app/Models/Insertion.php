<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Insertion extends Model
{
    use HasFactory;

    protected $table = 'insertions';

    protected $fillable = [
        'demandeur_emploi_id',
        'entreprise_id',
        'offre_id',
        'agent_id',
        'decision',
        'type_contrat',
        'intitule_poste',
        'date_prise_poste',
        'salaire_brut_mensuel',
        'suivi_1m_statut',
        'suivi_1m_date',
        'suivi_3m_statut',
        'suivi_3m_date',
        'suivi_6m_statut',
        'suivi_6m_date',
        'notes_suivi',
    ];

    protected $casts = [
        'date_prise_poste' => 'date',
        'suivi_1m_date' => 'date',
        'suivi_3m_date' => 'date',
        'suivi_6m_date' => 'date',
        'salaire_brut_mensuel' => 'float',
    ];

    public function demandeurEmploi()
    {
        return $this->belongsTo(DemandeurEmploi::class, 'demandeur_emploi_id');
    }

    public function entreprise()
    {
        return $this->belongsTo(Entreprise::class, 'entreprise_id');
    }

    public function offre()
    {
        return $this->belongsTo(Offre::class, 'offre_id');
    }

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }
}
