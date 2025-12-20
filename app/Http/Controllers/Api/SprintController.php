<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sprint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SprintController extends Controller
{
    public function index()
    {
        return Sprint::with('creator')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'sometimes|in:planned,active,completed,closed',
        ]);

        $validated['created_by'] = Auth::id();
        $validated['status'] = $validated['status'] ?? 'planned';

        $sprint = Sprint::create($validated);

        return $sprint->load('creator');
    }

    public function show(Sprint $sprint)
    {
        return $sprint->load(['creator', 'tasks']);
    }

    public function update(Request $request, Sprint $sprint)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'status' => 'sometimes|in:planned,active,completed,closed',
        ]);

        $sprint->update($validated);

        return $sprint->load('creator');
    }

    public function destroy(Sprint $sprint)
    {
        $sprint->delete();

        return response()->noContent();
    }
} 