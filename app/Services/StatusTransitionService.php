
<?php

namespace App\Services;

use App\Models\Task;
use App\Models\Status;
use App\Models\StatusTimeline;
use App\Models\TaskHistory;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class StatusTransitionService
{
    public function transition(Task $task, Status $toStatus, int $userId)
    {
        DB::transaction(function () use ($task, $toStatus, $userId) {

            $fromStatus = $task->status;

            // Stop timer if required
            if ($fromStatus?->auto_start_timer) {
                app(TimeLogService::class)->stopRunningTimer($userId);
            }

            // Start timer if required
            if ($toStatus->auto_start_timer) {
                app(TimeLogService::class)->startTimer($task, $userId);
                $task->started_at ??= now();
            }

            // Picked logic
            if ($toStatus->implies_picked && !$task->picked_at) {
                $task->picked_at = now();
            }

            // Completion logic
            if ($toStatus->category === 'terminal' && $toStatus->name === 'Done') {
                $task->completed_at = now();
            }

            $task->status_id = $toStatus->id;
            $task->save();

            // Status timeline
            StatusTimeline::create([
                'task_id' => $task->id,
                'from_status_id' => $fromStatus?->id,
                'to_status_id' => $toStatus->id,
                'changed_by' => $userId,
                'changed_at' => Carbon::now(),
            ]);

            // History
            TaskHistory::create([
                'task_id' => $task->id,
                'action' => 'Status Changed',
                'old_value' => $fromStatus?->name,
                'new_value' => $toStatus->name,
                'performed_by' => $userId,
            ]);
        });
    }
}
