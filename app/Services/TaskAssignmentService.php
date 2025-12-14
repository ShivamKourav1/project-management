
<?php

namespace App\Services;

use App\Models\Task;
use App\Models\Status;
use App\Models\TaskHistory;

class TaskAssignmentService
{
    public function assign(Task $task, int $toUserId, int $byUserId)
    {
        $task->assigned_to = $toUserId;
        $task->save();

        // Determine "To be X" status
        $status = Status::where('user_type_id', optional($task->assignee)->user_type_id)
            ->where('category', 'queue')
            ->first();

        if ($status) {
            app(StatusTransitionService::class)
                ->transition($task, $status, $byUserId);
        }

        TaskHistory::create([
            'task_id' => $task->id,
            'action' => 'Assigned',
            'old_value' => null,
            'new_value' => 'Assigned to user ID ' . $toUserId,
            'performed_by' => $byUserId,
        ]);
    }
}
