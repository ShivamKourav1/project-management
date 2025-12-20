<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $guarded = [];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function sprints()
    {
        return $this->hasMany(Sprint::class);
    }

    public function tasks()
    {
        return $this->hasManyThrough(Task::class, Sprint::class);
    }
}

