<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Models\Office;
use Inertia\Inertia;

// ── Visitor Routes ──────────────────────────────────────────
Route::get('/', function () {
    return Inertia::render('visitors/landingpage');
})->name('home');

Route::get('/directory', function () {
    return Inertia::render('visitors/directory');
})->name('directory');

Route::get('/map', function () {
    return Inertia::render('visitors/map');
})->name('map');

Route::get('/scan', function () {
    return Inertia::render('visitors/scan');
})->name('scan');

Route::get('/office/{officeId}', function (string $officeId) {
    $office = Office::find($officeId);
    abort_if(!$office, 404);
    return Inertia::render('visitors/office', [
        'office' => $office,
    ]);
})->name('office.show');

// ── Auth Routes ─────────────────────────────────────────────
Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');

// ── Admin Routes ─────────────────────────────────────────────
Route::prefix('admin')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard',     fn() => Inertia::render('admin/dashboard'))->name('admin.dashboard');
    Route::get('/offices',       fn() => Inertia::render('admin/offices'))->name('admin.offices');
    Route::get('/departments',   fn() => Inertia::render('admin/departments'))->name('admin.departments');
    Route::get('/floor-maps',    fn() => Inertia::render('admin/floor-maps'))->name('admin.floor-maps');
    Route::get('/nodes',         fn() => Inertia::render('admin/nodes'))->name('admin.nodes');
    Route::get('/qr-code',      fn() => Inertia::render('admin/qr-code'))->name('admin.qr-code');
    Route::get('/analytics',     fn() => Inertia::render('admin/analytics'))->name('admin.analytics');
    Route::get('/users',         fn() => Inertia::render('admin/users'))->name('admin.users');
    Route::get('/roles',         fn() => Inertia::render('admin/roles'))->name('admin.roles');
    Route::get('/notifications', fn() => Inertia::render('admin/notifications'))->name('admin.notifications');
    Route::get('/settings',      fn() => Inertia::render('admin/settings'))->name('admin.settings');
});

// ── Profile Routes ───────────────────────────────────────────
Route::middleware('auth')->group(function () {
    Route::get('/profile',    [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile',  [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';