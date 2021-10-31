<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('mst_users');
        
        Schema::create('mst_users', function (Blueprint $table) {
            $table->bigInteger('id', true)->unsigned();
            $table->string('name');
            $table->string('email', 255)->unique();
            $table->timestamp('verify_email')->nullable();
            $table->string('password');
            $table->tinyInteger('is_active')->default(1)->comment('0: Không hoạt động , 1 : Hoạt động');
            $table->tinyInteger('is_delete')->default(0)->comment('0: Bình thường , 1 : Đã xóa');
            $table->timestamp('last_login_at')->nullable();
            $table->string('last_login_ip')->nullable();
            $table->string('group_role', 50)->nullable();
            $table->index(['email']);
            $table->timestamps();
            $table->longtext('remember_token')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('mst_users');
    }
}
