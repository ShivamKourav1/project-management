<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    public function index()
    {
        return Project::with(['creator', 'sprints'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'sometimes|in:planning,active,on_hold,completed,archived',
        ]);

        $validated['created_by'] = Auth::id();

        $project = Project::create($validated);

        return $project->load('creator');
    }

    public function show(Project $project)
    {
        return $project->load(['creator', 'sprints.tasks']);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string',
            'start_date' => 'sometimes|nullable|date',
            'end_date' => 'sometimes|nullable|date',
            'status' => 'sometimes|in:planning,active,on_hold,completed,archived',
        ]);

        $project->update($validated);

        return $project->load('creator');
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return response()->noContent();
    }
}

