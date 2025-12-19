<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Status;
use App\Services\TaskPickService;
use App\Services\TaskAssignmentService;
use App\Services\StatusTransitionService;
use Illuminate\Http\Request;

class TaskActionController extends Controller
{
    public function pick(Task $task, Request $request)
    {
        app(TaskPickService::class)
            ->pick($task, $request->user());

        return response()->json(['message' => 'Task picked']);
    }

    public function assign(Task $task, Request $request)
    {
        app(TaskAssignmentService::class)
            ->assign($task, $request->assigned_to, $request->user()->id);

        return response()->json(['message' => 'Task assigned']);
    }

    public function changeStatus(Task $task, Request $request)
    {
        $status = Status::findOrFail($request->status_id);

        app(StatusTransitionService::class)
            ->transition($task, $status, $request->user()->id);

        return response()->json(['message' => 'Status updated']);
    }
}
