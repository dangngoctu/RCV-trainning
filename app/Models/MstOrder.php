<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class MstOrder
 * 
 * @property int $order_id
 * @property string $order_shop
 * @property int $customer_id
 * @property float $total_price
 * @property int $payment_method
 * @property int $ship_charge
 * @property int $tax
 * @property Carbon $order_date
 * @property Carbon $shipment_date
 * @property Carbon $cancel_date
 * @property int $order_status
 * @property int $shipment_status
 * @property string|null $note_customer
 * @property string|null $note_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property MstCustomer $mst_customer
 * @property Collection|MstOrderDetail[] $mst_order_details
 *
 * @package App\Models
 */
class MstOrder extends Model
{
	protected $table = 'mst_order';
	protected $primaryKey = 'order_id';

	protected $casts = [
		'customer_id' => 'int',
		'total_price' => 'float',
		'payment_method' => 'int',
		'ship_charge' => 'int',
		'tax' => 'int',
		'order_status' => 'int',
		'shipment_status' => 'int'
	];

	protected $dates = [
		'order_date',
		'shipment_date',
		'cancel_date'
	];

	protected $fillable = [
		'order_shop',
		'customer_id',
		'total_price',
		'payment_method',
		'ship_charge',
		'tax',
		'order_date',
		'shipment_date',
		'cancel_date',
		'order_status',
		'shipment_status',
		'note_customer',
		'note_order'
	];

	public function mst_customer()
	{
		return $this->belongsTo(MstCustomer::class, 'customer_id');
	}

	public function mst_order_details()
	{
		return $this->hasMany(MstOrderDetail::class, 'order_id');
	}
}
