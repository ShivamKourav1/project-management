<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ScanController;
use App\Http\Controllers\Api\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::get('/', function () {
    return view('app');
});

Route::get('/scan/write-ui', [ScanController::class, 'writeUi']);
Route::post('/scan/write', [ScanController::class, 'writeFiles']);
Route::post('/scan/write', [ScanController::class, 'writeFiles']);

Route::get('/scan/{path?}', [ScanController::class, 'scan'])
    ->where('path', '.*');

