<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agent extends Model
{
    use HasFactory;

    protected $table = 'agents';

    protected $fillable = [
        'utilisateur_id',
        'matricule',
        'nom',
        'prenom',
        'telephone_pro',
        'pole_affectation',
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id');
    }

    public function objectif()
    {
        return $this->hasOne(Objectif::class, 'agent_id');
    }

    public function entreprises()
    {
        return $this->hasMany(Entreprise::class, 'agent_referent_id');
    }

    public function demandeursEmploi()
    {
        return $this->hasMany(DemandeurEmploi::class, 'agent_referent_id');
    }

    public function offresValidees()
    {
        return $this->hasMany(Offre::class, 'agent_validateur_id');
    }

    public function misesEnRelation()
    {
        return $this->hasMany(MiseEnRelation::class, 'agent_initiateur_id');
    }

    public function coachings()
    {
        return $this->hasMany(Coaching::class, 'agent_id');
    }

    public function insertions()
    {
        return $this->hasMany(Insertion::class, 'agent_id');
    }

    public function getNomCompletAttribute(): string
    {
        return "{$this->prenom} {$this->nom}";
    }
}
