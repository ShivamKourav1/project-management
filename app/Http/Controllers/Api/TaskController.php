<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $tasks = Task::query()
            ->with(['status', 'priority', 'severity', 'assignee', 'tags'])

            ->when($request->status_id, fn ($q) =>
                $q->where('status_id', $request->status_id)
            )
            ->when($request->assigned_to, fn ($q) =>
                $q->where('assigned_to', $request->assigned_to)
            )
            ->when($request->task_type_id, fn ($q) =>
                $q->where('task_type_id', $request->task_type_id)
            )
            ->when($request->severity_id, fn ($q) =>
                $q->where('severity_id', $request->severity_id)
            )
            ->when($request->priority_id, fn ($q) =>
                $q->where('priority_id', $request->priority_id)
            )
            ->when($request->tag_id, fn ($q) =>
                $q->whereHas('tags', fn ($t) =>
                    $t->where('tags.id', $request->tag_id)
                )
            )
            ->when($request->deadline === 'overdue', fn ($q) =>
                $q->whereNotNull('deadline_at')
                  ->where('deadline_at', '<', now())
            )
            ->when($request->deadline === 'today', fn ($q) =>
                $q->whereDate('deadline_at', now())
            )
            ->latest()
            ->paginate(20);

        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $task = Task::create([
            'title'        => $request->title,
            'description'  => $request->description,
            'task_type_id' => $request->task_type_id,
            'severity_id'  => $request->severity_id,
            'priority_id'  => $request->priority_id,
            'status_id'    => $request->status_id,
            'created_by'   => $request->user()->id,
            'assigned_to'  => $request->assigned_to,
            'deadline_at'  => $request->deadline_at,
        ]);

        if ($request->tags) {
            $task->tags()->sync($request->tags);
        }

        return response()->json($task, 201);
    }

    public function show(Task $task)
    {
        return response()->json(
            $task->load([
                'status',
                'priority',
                'severity',
                'assignee',
                'tags',
                'timeLogs',
                'histories',
                'statusTimelines'
            ])
        );
    }

    public function update(Request $request, Task $task)
    {
        $task->update($request->only([
            'title',
            'description',
            'severity_id',
            'priority_id',
            'deadline_at'
        ]));

        if ($request->tags) {
            $task->tags()->sync($request->tags);
        }

        return response()->json($task);
    }
}
