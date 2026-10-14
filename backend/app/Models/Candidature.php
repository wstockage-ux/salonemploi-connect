<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidature extends Model
{
    use HasFactory;

    protected $table = 'candidatures';

    protected $fillable = [
        'offre_id',
        'demandeur_emploi_id',
        'type_origine',
        'lettre_motivation',
        'statut',
        'motif_refus',
        'date_candidature',
    ];

    protected $casts = [
        'date_candidature' => 'datetime',
    ];

    public function offre()
    {
        return $this->belongsTo(Offre::class, 'offre_id');
    }

    public function demandeurEmploi()
    {
        return $this->belongsTo(DemandeurEmploi::class, 'demandeur_emploi_id');
    }

    public function entretiens()
    {
        return $this->hasMany(Entretien::class, 'candidature_id');
    }
}
