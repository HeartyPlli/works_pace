<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('show_journal')->default(true);
            $table->boolean('signup_pending')->default(false);
            $table->boolean('can_manage_accounts')->default(false);
        });

        $officers = DB::table('users')->where('role', 'officer');
        $ownerId = (clone $officers)->where('email', 'officer@example.com')->value('id')
            ?? $officers->orderBy('id')->value('id');

        if ($ownerId !== null) {
            DB::table('users')->where('id', $ownerId)->update(['can_manage_accounts' => true]);
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['show_journal', 'signup_pending', 'can_manage_accounts']);
        });
    }
};
