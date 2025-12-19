
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TaskActionController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\StatusController;

// Auth
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('tasks', TaskController::class)->only(['index', 'store', 'update']);
    Route::post('tasks/{task}/pick', [TaskActionController::class, 'pick']);
    Route::post('tasks/{task}/assign', [TaskActionController::class, 'assign']);
    Route::post('tasks/{task}/status', [TaskActionController::class, 'changeStatus']);
    Route::get('/users', [UserController::class, 'index']);

    Route::get('/statuses', [StatusController::class, 'index']);
// });
