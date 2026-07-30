<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// maps to user_activity_logs table, written by AuthController on login, logout, register
class UserActivityLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'action',
        'ip_address',
        'user_agent',
    ];

    // reads users table, used when accessing the user who triggered the log entry
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
