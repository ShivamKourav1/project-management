<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $guarded = [];

    public function status()      { return $this->belongsTo(Status::class); }
    public function priority()    { return $this->belongsTo(Priority::class); }
    public function severity()    { return $this->belongsTo(Severity::class); }
    public function taskType()    { return $this->belongsTo(TaskType::class); }
    public function assignee()    { return $this->belongsTo(User::class, 'assigned_to'); }
    public function tags()        { return $this->belongsToMany(Tag::class); }
    public function timeLogs()    { return $this->hasMany(TimeLog::class); }
    public function histories()   { return $this->hasMany(TaskHistory::class); }
    public function statusTimelines() { return $this->hasMany(StatusTimeline::class); }
    public function sprint()      { return $this->belongsTo(Sprint::class); }
} 