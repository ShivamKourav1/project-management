<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ScanController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/scan/write-ui', [ScanController::class, 'writeUi']);
Route::post('/scan/write', [ScanController::class, 'writeFiles']);
Route::post('/scan/write', [ScanController::class, 'writeFiles']);

Route::get('/scan/{path?}', [ScanController::class, 'scan'])
    ->where('path', '.*');

