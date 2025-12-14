
<?php

namespace App\Services;

use App\Models\Task;
use App\Models\Status;
use App\Models\User;

class TaskPickService
{
    public function pick(Task $task, User $user)
    {
        // If user was working on something else → move it to inactive
        if ($user->id === auth()->id()) {
            app(TimeLogService::class)->stopRunningTimer($user->id);
        }

        // Determine correct active status based on user type
        $status = Status::where('user_type_id', $user->user_type_id)
            ->where('category', 'active')
            ->firstOrFail();

        app(StatusTransitionService::class)
            ->transition($task, $status, $user->id);
    }
}
