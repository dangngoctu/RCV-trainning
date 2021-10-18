<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMstProductTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('mst_product');
        
        Schema::create('mst_product', function (Blueprint $table) {
            $table->bigInteger('product_id', true)->unsigned();
            $table->string('product_name', 255);
            $table->string('product_image', 255)->nullable();
            $table->float('product_price')->default(0)->unsigned();
            $table->tinyInteger('is_sales')->default(1)->comment('0 : Dừng bán hoặc dừng sản xuất  , 1: Có hàng bán');
            $table->longtext('description');
            $table->index(['product_id']);
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
        Schema::dropIfExists('mst_product');
    }
}
