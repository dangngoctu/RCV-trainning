<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMstOrderdetailTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('mst_order_detail');

        Schema::create('mst_order_detail', function (Blueprint $table) {
            $table->bigInteger('order_id')->unsigned();
            $table->bigInteger('detail_line')->unsigned();
            $table->primary(['order_id', 'detail_line']);
            $table->string('product_id', 20);
            $table->float('price_buy');
            $table->integer('quantity')->unsigned();
            $table->bigInteger('shop_id')->unsigned();
            $table->bigInteger('receiver_id')->unsigned();
            $table->index(['order_id']);
            $table->timestamps();
            $table->foreign('order_id')->references('order_id')->on('mst_order');
            $table->foreign('shop_id')->references('shop_id')->on('mst_shop');
            $table->foreign('product_id')->references('product_id')->on('mst_product');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('mst_order_detail');
    }
}
