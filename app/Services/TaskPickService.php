<?php
namespace App\Services;

use App\Models\Task;
use App\Models\Status;
use App\Models\StatusTimeline;
use App\Models\TaskHistory;

class TaskPickService
{
    /**
     * Pick a task – full automation:
     * - If user has an active task → move it to inactive status and stop timer
     * - Set this task to user's active status (e.g. Developing)
     * - Update timestamps and start timer if required
     *
     * @param Task $task
     * @param \App\Models\User $user
     * @return void
     */
    public function pick(Task $task, \App\Models\User $user): void
    {
        $userTypeId = $user->user_type_id;

        // 1. Handle current active task (switch logic)
        $currentActiveTask = Task::where('assigned_to', $user->id)
            ->whereHas('status', function ($query) {
                $query->where('category', 'active');
            })
            ->first();

        if ($currentActiveTask && $currentActiveTask->id !== $task->id) {
            $inactiveStatus = Status::where('user_type_id', $userTypeId)
                                   ->where('category', 'inactive')
                                   ->firstOrFail();

            app(StatusTransitionService::class)->transition(
                $currentActiveTask,
                $inactiveStatus,
                $user->id,
                'Paused',
                'Paused while switching to another task'
            );

            app(TimeLogService::class)->stopRunningTimer($user->id);
        }

        // 2. Set new task to active status
        $activeStatus = Status::where('user_type_id', $userTypeId)
                             ->where('category', 'active')
                             ->firstOrFail();

        app(StatusTransitionService::class)->transition(
            $task,
            $activeStatus,
            $user->id,
            'Picked & Started',
            "Started working by {$user->name}"
        );

        // Update task metadata
        $task->assigned_to = $user->id;
        $task->picked_at   = now();
        $task->started_at  = now();
        $task->save();

        // 3. Auto-start timer if status has auto_start_timer = true
        if ($activeStatus->auto_start_timer) {
            app(TimeLogService::class)->startTimer($task->id, $user->id);
        }
    }
}
