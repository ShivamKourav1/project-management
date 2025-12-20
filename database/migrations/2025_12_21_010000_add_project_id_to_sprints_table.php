<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('sprints', function (Blueprint $table) {
            $table->foreignId('project_id')->after('id')->constrained('projects')->onDelete('cascade');
            $table->index('project_id');
        });
    }

    public function down()
    {
        Schema::table('sprints', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
            $table->dropColumn('project_id');
        });
    }
};

