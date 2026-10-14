<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Objectif extends Model
{
    use HasFactory;

    protected $table = 'objectifs';

    protected $fillable = [
        'agent_id',
        'annee',
        'cible_entreprises',
        'cible_offres',
        'cible_mer',
        'cible_insertions',
    ];

    protected $casts = [
        'annee' => 'integer',
        'cible_entreprises' => 'integer',
        'cible_offres' => 'integer',
        'cible_mer' => 'integer',
        'cible_insertions' => 'integer',
    ];

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }
}
