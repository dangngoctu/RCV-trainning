<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class MstProduct
 * 
 * @property int $product_id
 * @property string $product_name
 * @property string|null $product_image
 * @property float $product_price
 * @property int $is_sales
 * @property string $description
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Collection|MstOrderDetail[] $mst_order_details
 *
 * @package App\Models
 */
class MstProduct extends Model
{
	protected $table = 'mst_product';
	protected $primaryKey = 'product_id';

	protected $casts = [
		'product_price' => 'float',
		'is_sales' => 'int',
		'product_id' => 'string'
	];

	protected $fillable = [
		'product_id',
		'product_name',
		'product_image',
		'product_price',
		'is_sales',
		'description',
		'created_at',
		'updated_at'
	];

	public function mst_order_details()
	{
		return $this->hasMany(MstOrderDetail::class, 'product_id');
	}
}
