<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class MstOrderDetail
 * 
 * @property int $order_id
 * @property int $detail_line
 * @property int $product_id
 * @property float $price_buy
 * @property int $quantity
 * @property int $shop_id
 * @property int $receiver_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property MstOrder $mst_order
 * @property MstProduct $mst_product
 * @property MstShop $mst_shop
 *
 * @package App\Models
 */
class MstOrderDetail extends Model
{
	protected $table = 'mst_order_detail';
	protected $primaryKey = ['order_id', 'detail_line'];
	public $incrementing = false;

	protected $casts = [
		'order_id' => 'int',
		'detail_line' => 'int',
		'product_id' => 'int',
		'price_buy' => 'float',
		'quantity' => 'int',
		'shop_id' => 'int',
		'receiver_id' => 'int'
	];

	protected $fillable = [
		'product_id',
		'price_buy',
		'quantity',
		'shop_id',
		'receiver_id'
	];

	public function mst_order()
	{
		return $this->belongsTo(MstOrder::class, 'order_id');
	}

	public function mst_product()
	{
		return $this->belongsTo(MstProduct::class, 'product_id');
	}

	public function mst_shop()
	{
		return $this->belongsTo(MstShop::class, 'shop_id');
	}
}
