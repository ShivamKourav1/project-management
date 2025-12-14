
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('statuses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category'); // queue, active, inactive, terminal
            $table->unsignedBigInteger('user_type_id')->nullable();
            $table->boolean('auto_start_timer')->default(false);
            $table->boolean('auto_stop_timer')->default(false);
            $table->boolean('implies_picked')->default(false);
            $table->unsignedTinyInteger('order')->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('statuses');
    }
};
