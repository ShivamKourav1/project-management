<?php
namespace App\Services;

use App\Models\TimeLog;
use Carbon\Carbon;

class TimeLogService
{
    /**
     * Stop any currently running timer for the given user
     *
     * @param int $userId
     * @return void
     */
    public function stopRunningTimer(int $userId): void
    {
        $activeLog = TimeLog::where('user_id', $userId)
                           ->whereNull('end_time')
                           ->first();

        if ($activeLog) {
            $activeLog->end_time = Carbon::now();

            // Use the correct column name based on your migration (duration_seconds or duration)
            if (isset($activeLog->getAttributes()['duration_seconds'])) {
                $activeLog->duration_seconds = Carbon::now()->diffInSeconds($activeLog->start_time);
            } elseif (isset($activeLog->getAttributes()['duration'])) {
                $activeLog->duration = Carbon::now()->diffInSeconds($activeLog->start_time);
            }

            $activeLog->save();
        }
    }

    /**
     * Start a timer for a task and user.
     * Automatically stops any previous running timer.
     *
     * @param int $taskId
     * @param int $userId
     * @return void
     */
    public function startTimer(int $taskId, int $userId): void
    {
        $this->stopRunningTimer($userId);

        TimeLog::create([
            'task_id'          => $taskId,
            'user_id'          => $userId,
            'start_time'       => Carbon::now(),
            'end_time'         => null,
            'duration_seconds' => 0, // or 'duration' => 0 if your column is named duration
            'source'           => 'auto',
        ]);
    }
}
