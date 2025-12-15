
<?php

namespace App\Services;

use App\Models\Task;
use App\Models\Priority;
use Carbon\Carbon;

class PriorityResolver
{
    /**
     * Automatically set the best priority based on:
     * - Task type defaults
     * - Deadline proximity / overdue
     *
     * @param Task $task
     * @return void
     */
    public function resolve(Task $task): void
    {
        // Base: task type default or Medium
        $priority = $task->taskType->defaultPriority 
            ?? Priority::where('name', 'Medium')->firstOrFail();

        // Task type overrides
        $typeName = $task->taskType->name;
        if ($typeName === 'Exception') {
            $priority = Priority::where('name', 'Critical')->firstOrFail();
        } elseif ($typeName === 'Bug') {
            $priority = Priority::where('name', 'High')->firstOrFail();
        }

        // Deadline escalation
        if ($task->deadline_at) {
            $hoursLeft = Carbon::now()->diffInHours(Carbon::parse($task->deadline_at), false);

            if ($hoursLeft < 0) {
                $priority = Priority::where('name', 'Critical')->firstOrFail();
            } elseif ($hoursLeft < 24) {
                $priority = Priority::where('name', 'High')->firstOrFail();
            }
        }

        $task->priority_id = $priority->id;
        $task->save();
    }
}
