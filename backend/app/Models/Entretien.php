<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entretien extends Model
{
    use HasFactory;

    protected $table = 'entretiens';

    protected $fillable = [
        'candidature_id',
        'date_heure_debut',
        'date_heure_fin',
        'modalite',
        'lieu_ou_lien',
        'statut',
        'compte_rendu',
        'rappel_envoye',
    ];

    protected $casts = [
        'date_heure_debut' => 'datetime',
        'date_heure_fin' => 'datetime',
        'rappel_envoye' => 'boolean',
    ];

    public function candidature()
    {
        return $this->belongsTo(Candidature::class, 'candidature_id');
    }
}
