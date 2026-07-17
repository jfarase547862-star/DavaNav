<?php

use App\Http\Controllers\Visitor\OfficeController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Models\Office;
use Inertia\Inertia;

const PROFILE_PATH = '/profile';

Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('login');

// ── Kiosk Routes ─────────────────────────────────────────────
Route::prefix('kiosk')->name('kiosk.')->group(function () {
    Route::get('/', function () {
        return Inertia::render('kiosk/kiosk-landingpage');
    })->name('home');

    Route::get('/kiosk-directory', function () {
        return Inertia::render('kiosk/kiosk-directory');
    })->name('directory');

    Route::get('/kiosk-offices', function () {
        return Inertia::render('kiosk/kiosk-offices');
    })->name('offices');

    Route::get('/kiosk-scan', function () {
        return Inertia::render('kiosk/kiosk-scan');
    })->name('scan');

  Route::get('/kiosk-map', function () {
    return Inertia::render('kiosk/kiosk-map');
})->name('map');

    Route::get('/office/{officeId}', [OfficeController::class, 'show'])
        ->name('office.show');
});

// ── Mobile Routes ────────────────────────────────────────────
Route::prefix('mobile')->name('mobile.')->group(function () {
    Route::get('/mobile-home', function () {
        return Inertia::render('mobile/mobile-home');
    })->name('mobile-home');

    Route::get('/mobile-scan', function () {
        return Inertia::render('mobile/mobile-scan');
    })->name('mobile-scan');

    Route::get('/mobile-search', function () {
        return Inertia::render('mobile/mobile-search');
    })->name('mobile-search');

    Route::get('/mobile-map', function () {
        return Inertia::render('mobile/mobile-map');
    })->name('mobile-map');

    Route::get('/mobile-navigation', function () {
        return Inertia::render('mobile/mobile-navigation');
    })->name('mobile-navigation');

    Route::get('/office/{officeId}', [OfficeController::class, 'show'])
        ->name('office.show');
});

Route::get('/navigate/{officeId}', function (string $officeId) {
    return Inertia::render('mobile/mobile-navigate', ['officeId' => $officeId]);
})->name('navigate');

Route::get('/accessibility/{officeId}', function (string $officeId) {
    return Inertia::render('mobile/mobile-navigate', ['officeId' => $officeId, 'mode' => 'accessibility']);
})->name('accessibility');

// ── Admin Routes ─────────────────────────────────────────────
Route::prefix('admin')->middleware('auth')->group(function () {
    Route::get('/admin-dashboard',     fn() => Inertia::render('admin/admin-dashboard'))->name('admin.dashboard');
    Route::get('/admin-offices',       fn() => Inertia::render('admin/admin-offices'))->name('admin.offices');
    Route::get('/admin-departments',   fn() => Inertia::render('admin/admin-departments'))->name('admin.departments');
    Route::get('/admin-floor-maps',    fn() => Inertia::render('admin/admin-floor-maps'))->name('admin.floor-maps');
    Route::get('/admin-nodes',         fn() => Inertia::render('admin/admin-nodes'))->name('admin.nodes');
    Route::get('/admin-qr-code',       fn() => Inertia::render('admin/admin-qr-code'))->name('admin.qr-code');
    Route::get('/admin-analytics',     fn() => Inertia::render('admin/admin-analytics'))->name('admin.analytics');
    Route::get('/admin-users',         fn() => Inertia::render('admin/admin-users'))->name('admin.users');
    Route::get('/admin-roles',         fn() => Inertia::render('admin/admin-roles'))->name('admin.roles');
    Route::get('/admin-notifications', fn() => Inertia::render('admin/admin-notifications'))->name('admin.notifications');
    Route::get('/admin-settings',      fn() => Inertia::render('admin/admin-settings'))->name('admin.settings');
    Route::get('/admin-reports',       fn() => Inertia::render('admin/admin-reports'))->name('admin.reports');    
    Route::get('/admin-scan-history',       fn() => Inertia::render('admin/admin-scan-history'))->name('admin.history');

});

// ── Superadmin Routes ────────────────────────────────────────
Route::prefix('superadmin')->middleware('auth')->group(function () {
    Route::get('/dashboard',       fn() => Inertia::render('superadmin/supadmin-dashboard'))->name('superadmin.dashboard');
    Route::get('/admin-accounts',  fn() => Inertia::render('superadmin/supadmin-admin-accounts'))->name('superadmin.admin-accounts');
    Route::get('/system-settings', fn() => Inertia::render('superadmin/supadmin-system-settings'))->name('superadmin.system-settings');
    Route::get('/database-schema', fn() => Inertia::render('superadmin/supadmin-database-schema'))->name('superadmin.database-schema');
    Route::get('/deployment',      fn() => Inertia::render('superadmin/supadmin-deployment'))->name('superadmin.deployment');
    Route::get('/performance',     fn() => Inertia::render('superadmin/supadmin-performance'))->name('superadmin.performance');
    Route::get('/backup-recovery', fn() => Inertia::render('superadmin/supadmin-backup-recovery'))->name('superadmin.backup-recovery');
    Route::get('/audit-logs',      fn() => Inertia::render('superadmin/supadmin-audit-logs'))->name('superadmin.audit-logs');
});

// ── Profile Routes ───────────────────────────────────────────
Route::middleware('auth')->group(function () {
    Route::get(PROFILE_PATH,    [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch(PROFILE_PATH,  [ProfileController::class, 'update'])->name('profile.update');
    Route::delete(PROFILE_PATH, [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';