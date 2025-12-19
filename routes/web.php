<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ScanController;
use App\Http\Controllers\Api\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// Serve Project Management Tool at /pm (keeps your main landing page safe at root)
Route::get('/pm/{any?}', function () {
    return view('app');
})->where('any', '.*');

// Keep /scan/ tool accessible
Route::get('/scan/write-ui', [ScanController::class, 'writeUi']);
Route::post('/scan/write', [ScanController::class, 'writeFiles']);
Route::get('/scan/{path?}', [ScanController::class, 'scan'])
    ->where('path', '.*');
