<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Status;
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
return Task::with(['status', 'priority', 'taskType', 'assignee', 'timeLogs', 'severity', 'sprint'])
->get();
}
public function store(Request $request)
{
$validated = $request->validate([
'title' => 'required|string|max:255',
'description' => 'nullable|string',
'task_type_id' => 'required|exists:task_types,id',
'severity_id' => 'nullable|exists:severities,id',
'assigned_to' => 'nullable|exists:users,id',
'deadline_at' => 'nullable|date',
'sprint_id' => 'nullable|exists:sprints,id',
]);
$validated['created_by'] = Auth::id();
$validated['status_id'] = Status::where('name', 'New')->first()->id ?? 1;
$task = Task::create($validated);
$this->priorityResolver->resolve($task);
\App\Models\TaskHistory::create([
'task_id'    => $task->id,
'event'      => 'Created',
'details'    => 'Created by ' . Auth::user()->name,
'changed_by' => Auth::id(),
]);
return $task->load(['status', 'priority', 'taskType', 'assignee', 'timeLogs', 'severity', 'sprint']);
}
public function update(Request $request, Task $task)
{
$validated = $request->validate([
'title'       => 'sometimes|string|max:255',
'description' => 'sometimes|nullable|string',
'sprint_id'   => 'sometimes|nullable|exists:sprints,id',
]);
$task->update($validated);
$this->priorityResolver->resolve($task);
\App\Models\TaskHistory::create([
'task_id'    => $task->id,
'event'      => 'Updated',
'details'    => 'Updated by ' . Auth::user()->name,
'changed_by' => Auth::id(),
]);
return $task->load(['status', 'priority', 'taskType', 'assignee', 'timeLogs', 'severity', 'sprint']);
}
} 