
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Services\PriorityResolver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    protected $priorityResolver;

    public function __construct(PriorityResolver $priorityResolver)
    {
        $this->priorityResolver = $priorityResolver;
    }

    public function index()
    {
        return Task::with(['status', 'priority', 'taskType', 'assignee', 'tags', 'time_logs', 'severity'])
            ->get();
    }

    public function store(Request $request)
    {
        // ... (existing code unchanged)
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string',
        ]);

        $task->update($validated);

        // Re-resolve priority if deadline changed (add later if needed)
        $this->priorityResolver->resolve($task);

        \App\Models\TaskHistory::create([
            'task_id'    => $task->id,
            'event'      => 'Updated',
            'details'    => 'Updated by ' . Auth::user()->name,
            'changed_by' => Auth::id(),
        ]);

        return $task->load(['status', 'priority', 'taskType', 'assignee', 'tags', 'time_logs', 'severity']);
    }
}
