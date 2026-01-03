<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ScanController;

Route::get('/pm/login', function () {
    return view('pm.login');
})->name('pm.login');

// Serve Project Management Tool at /pm
Route::get('/pm/{any?}', function () {
    return view('app'); // or 'pm.app' depending on your view name
})->where('any', '.*');

// Keep /scan/ tool accessible
Route::get('/scan/write-ui', [ScanController::class, 'writeUi']);
Route::post('/scan/write', [ScanController::class, 'writeFiles']);
Route::get('/scan/{path?}', [ScanController::class, 'scan'])
    ->where('path', '.*');