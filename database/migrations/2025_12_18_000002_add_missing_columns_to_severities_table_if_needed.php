
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * This adds level, is_blocking, color if they are missing
     */
    public function up(): void
    {
        Schema::table('severities', function (Blueprint $table) {
            if (!Schema::hasColumn('severities', 'level')) {
                $table->integer('level')->default(1)->after('name');
            }
            if (!Schema::hasColumn('severities', 'is_blocking')) {
                $table->boolean('is_blocking')->default(false)->after('level');
            }
            if (!Schema::hasColumn('severities', 'color')) {
                $table->string('color')->nullable()->after('is_blocking');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('severities', function (Blueprint $table) {
            $table->dropColumn(['level', 'is_blocking', 'color']);
        });
    }
};
