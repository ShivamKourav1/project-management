<?php

namespace App\Services;

use App\Models\Priority;
use App\Models\Task;
use Carbon\Carbon;

class PriorityResolver
{
    /**
     * Resolve and set priority for the task based on rules
     */
    public function resolve(Task $task): void
    {
        // Base priority from task type or default Medium
        $priority = $task->taskType->defaultPriority 
            ?? Priority::where('name', 'Medium')->first();

        if (!$priority) {
            // Fallback if no priorities seeded
            $priority = Priority::first() ?? Priority::create([
                'name'   => 'Medium',
                'weight' => 2,
                'color'  => 'blue'
            ]);
        }

        // Task type specific overrides
        $typeName = $task->taskType->name ?? 'Task';
        if ($typeName === 'Exception') {
            $priority = Priority::where('name', 'Critical')->first() ?? $priority;
        } elseif ($typeName === 'Bug') {
            $priority = Priority::where('name', 'High')->first() ?? $priority;
        }

        // Deadline escalation
        if ($task->deadline_at) {
            $hoursLeft = Carbon::now()->diffInHours(Carbon::parse($task->deadline_at), false);

            if ($hoursLeft < 0) { // Overdue
                $priority = Priority::where('name', 'Critical')->first() ?? $priority;
            } elseif ($hoursLeft < 24) {
                $priority = Priority::where('name', 'High')->first() ?? $priority;
            }
        }

        // Save if changed
        if ($task->priority_id !== $priority->id) {
            $task->priority_id = $priority->id;
            $task->save();
        }
    }
}
