<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JournalConnexion extends Model
{
    use HasFactory;

    protected $table = 'journal_connexions';

    public $timestamps = false;

    protected $fillable = [
        'utilisateur_id',
        'email_tente',
        'adresse_ip',
        'user_agent',
        'statut',
        'motif_echec',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id');
    }
}
