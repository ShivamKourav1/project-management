<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StatusController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TaskActionController;

use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
Route::middleware('auth')->get('/me', function (Request $request) {
    return $request->user();
});

Route::middleware([EnsureFrontendRequestsAreStateful::class,'auth'])->group(function () {
    Route::get('/statuses', [\App\Http\Controllers\Api\StatusController::class, 'index']);
    Route::get('/tasks', [\App\Http\Controllers\Api\TaskController::class, 'index']);
    Route::post('/tasks/{task}/pick', [\App\Http\Controllers\Api\TaskActionController::class, 'pick']);
    Route::post('/tasks/{task}/assign', [\App\Http\Controllers\Api\TaskActionController::class, 'assign']);
    Route::post('/tasks/{task}/status', [\App\Http\Controllers\Api\TaskActionController::class, 'changeStatus']);
});
