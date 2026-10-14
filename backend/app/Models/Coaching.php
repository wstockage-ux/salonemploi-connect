<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coaching extends Model
{
    use HasFactory;

    protected $table = 'coaching';

    protected $fillable = [
        'demandeur_emploi_id',
        'agent_id',
        'points_forts',
        'axes_amelioration',
        'note_simulation',
        'notes_confidentielles',
        'plan_action',
    ];

    protected $casts = [
        'note_simulation' => 'integer',
    ];

    public function demandeurEmploi()
    {
        return $this->belongsTo(DemandeurEmploi::class, 'demandeur_emploi_id');
    }

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }
}
