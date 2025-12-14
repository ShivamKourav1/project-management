
<?php

namespace App\Services;

use App\Models\Task;
use App\Models\Priority;
use Carbon\Carbon;

class PriorityResolver
{
    public function resolve(Task $task): void
    {
        if ($task->severity) {
            $priority = Priority::orderBy('weight', 'desc')
                ->where('weight', '>=', $task->severity->level)
                ->first();
        }

        if ($task->deadline_at && Carbon::parse($task->deadline_at)->diffInHours() < 24) {
            $priority = Priority::where('name', 'Critical')->first();
        }

        if (isset($priority)) {
            $task->priority_id = $priority->id;
            $task->save();
        }
    }
}
