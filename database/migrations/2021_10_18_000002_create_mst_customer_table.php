<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMstCustomerTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('mst_customer');
        
        Schema::create('mst_customer', function (Blueprint $table) {
            $table->bigInteger('customer_id', true)->unsigned();
            $table->string('customer_name', 255);
            $table->string('email', 255)->unique();
            $table->string('tel_num', 14);
            $table->string('address', 255);
            $table->tinyInteger('is_active')->default(1)->comment('1: active, 2 inactive');
            $table->longtext('description')->nullable();
            $table->index(['customer_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('mst_customer');
    }
}
