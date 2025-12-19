<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Status;

class StatusController extends Controller
{
    /**
     * Return all statuses (for Kanban columns)
     */
    public function index()
    {
        return Status::orderBy('order')->get();
    }
}
