<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sprint extends Model
{
    protected $guarded = [];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}

