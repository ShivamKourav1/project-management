<?php

namespace App\Services;

use App\Models\Task;
use App\Models\Status;
use App\Models\User;

class TaskAssignmentService
{
    /**
     * Assign task to new user – automation:
     * - Set status to queue status of new assignee's type (e.g. To be Developed)
     * - Stop timer of previous assignee
     * - Clear picked/started timestamps
     *
     * @param Task $task
     * @param int $newAssigneeId
     * @param int $changedById
     * @return void
     */
    public function assign(Task $task, int $newAssigneeId, int $changedById): void
    {
        $newAssignee = User::findOrFail($newAssigneeId);
        $changedBy   = User::findOrFail($changedById);

        $queueStatus = Status::where('user_type_id', $newAssignee->user_type_id)
                            ->where('category', 'queue')
                            ->firstOrFail();

        // Stop timer of previous assignee if any
        if ($task->assigned_to) {
            app(TimeLogService::class)->stopRunningTimer($task->assigned_to);
        }

        app(StatusTransitionService::class)->transition(
            $task,
            $queueStatus,
            $changedById,
            'Assigned',
            "Assigned to {$newAssignee->name} by {$changedBy->name}"
        );

        $task->assigned_to = $newAssignee->id;
        $task->picked_at   = null;
        $task->started_at  = null;
        $task->save();
    }
}
