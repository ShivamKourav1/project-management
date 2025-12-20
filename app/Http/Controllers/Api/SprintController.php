public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'start_date' => 'required|date',
        'end_date' => 'required|date|after_or_equal:start_date',
        'status' => 'sometimes|in:planned,active,completed,closed',
        'project_id' => 'required|exists:projects,id',  // Required now
    ]);

    $validated['created_by'] = Auth::id();
    $validated['status'] = $validated['status'] ?? 'planned';

    $sprint = Sprint::create($validated);

    return $sprint->load(['creator', 'project']);
}

