
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('status_timelines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained();
            $table->foreignId('from_status_id')->nullable()->constrained('statuses');
            $table->foreignId('to_status_id')->constrained('statuses');
            $table->foreignId('changed_by')->constrained('users');
            $table->timestamp('changed_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('status_timelines');
    }
};
