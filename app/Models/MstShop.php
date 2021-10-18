<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class MstShop
 * 
 * @property int $shop_id
 * @property string $shop_name
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Collection|MstOrderDetail[] $mst_order_details
 *
 * @package App\Models
 */
class MstShop extends Model
{
	protected $table = 'mst_shop';
	protected $primaryKey = 'shop_id';

	protected $fillable = [
		'shop_name'
	];

	public function mst_order_details()
	{
		return $this->hasMany(MstOrderDetail::class, 'shop_id');
	}
}
