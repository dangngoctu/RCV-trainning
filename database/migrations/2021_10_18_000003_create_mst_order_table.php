<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMstOrderTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('mst_order');

        Schema::create('mst_order', function (Blueprint $table) {
            $table->bigInteger('order_id', true)->unsigned();
            $table->string('order_shop', 40);
            $table->bigInteger('customer_id')->unsigned();
            $table->float('total_price');
            $table->tinyInteger('payment_method')->comment('1: COD , 2: PayPal , 3:GMO');
            $table->integer('ship_charge');
            $table->integer('tax');
            $table->date('order_date');
            $table->date('shipment_date');
            $table->date('cancel_date');
            $table->tinyInteger('order_status')->default(1);
            $table->tinyInteger('shipment_status')->default(1);
            $table->string('note_customer', 255)->nullable();
            $table->string('note_order', 255)->nullable();
            $table->index(['order_id']);
            $table->timestamps();

            $table->foreign('customer_id')->references('customer_id')->on('mst_customer');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('mst_order');
    }
}
