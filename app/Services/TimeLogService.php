
<?php

namespace App\Services;

use App\Models\Task;
use App\Models\TimeLog;
use Carbon\Carbon;

class TimeLogService
{
    public function stopRunningTimer(int $userId): void
    {
        $running = TimeLog::where('user_id', $userId)
            ->whereNull('end_time')
            ->first();

        if ($running) {
            $running->end_time = Carbon::now();
            $running->duration = $running->end_time->diffInSeconds($running->start_time);
            $running->save();
        }
    }

    public function startTimer(Task $task, int $userId): void
    {
        $this->stopRunningTimer($userId);

        TimeLog::create([
            'task_id' => $task->id,
            'user_id' => $userId,
            'start_time' => Carbon::now(),
            'source' => 'auto',
        ]);
    }
}
