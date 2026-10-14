<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entreprise extends Model
{
    use HasFactory;

    protected $table = 'entreprises';

    protected $fillable = [
        'utilisateur_id',
        'agent_referent_id',
        'raison_sociale',
        'siret',
        'secteur_activite',
        'adresse',
        'ville',
        'code_postal',
        'contact_nom',
        'contact_prenom',
        'contact_fonction',
        'contact_telephone',
        'contact_email',
        'description',
        'logo_path',
        'stand_numero',
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id');
    }

    public function agentReferent()
    {
        return $this->belongsTo(Agent::class, 'agent_referent_id');
    }

    public function offres()
    {
        return $this->hasMany(Offre::class, 'entreprise_id');
    }

    public function insertions()
    {
        return $this->hasMany(Insertion::class, 'entreprise_id');
    }
}
