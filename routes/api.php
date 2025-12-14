<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StatusController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TaskActionController;

Route::middleware(['web', 'auth'])->group(function () {

    Route::get('/me', function (Request $request) {
        return $request->user();
    });

    Route::get('/statuses', [StatusController::class, 'index']);
    Route::get('/tasks', [TaskController::class, 'index']);

    Route::post('/tasks/{task}/pick', [TaskActionController::class, 'pick']);
    Route::post('/tasks/{task}/assign', [TaskActionController::class, 'assign']);
    Route::post('/tasks/{task}/status', [TaskActionController::class, 'changeStatus']);
});
