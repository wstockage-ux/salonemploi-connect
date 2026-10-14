<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Utilisateur extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $table = 'utilisateurs';

    protected $fillable = [
        'role_id',
        'email',
        'telephone',
        'password',
        'actif',
        'email_verified_at',
        'telephone_verified_at',
        'consentement_rgpd',
        'date_consentement',
        'derniere_connexion_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'telephone_verified_at' => 'datetime',
        'date_consentement' => 'datetime',
        'derniere_connexion_at' => 'datetime',
        'actif' => 'boolean',
        'consentement_rgpd' => 'boolean',
        'password' => 'hashed',
    ];

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function agent()
    {
        return $this->hasOne(Agent::class, 'utilisateur_id');
    }

    public function entreprise()
    {
        return $this->hasOne(Entreprise::class, 'utilisateur_id');
    }

    public function demandeurEmploi()
    {
        return $this->hasOne(DemandeurEmploi::class, 'utilisateur_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'utilisateur_id');
    }

    public function journalConnexions()
    {
        return $this->hasMany(JournalConnexion::class, 'utilisateur_id');
    }

    public function hasRole(string $roleCode): bool
    {
        return $this->role && $this->role->code === $roleCode;
    }
}
