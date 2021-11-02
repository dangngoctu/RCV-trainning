<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class MstCustomer
 * 
 * @property int $customer_id
 * @property string $customer_name
 * @property string $email
 * @property string $phone
 * @property string $address
 * @property int $is_acive
 * @property string $description
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Collection|MstOrder[] $mst_orders
 *
 * @package App\Models
 */
class MstCustomer extends Model
{
	protected $table = 'mst_customer';
	protected $primaryKey = 'customer_id';

	protected $casts = [
		'is_active' => 'int'
	];

	protected $fillable = [
		'customer_name',
		'email',
		'tel_num',
		'address',
		'is_active',
		'description'
	];

	public function mst_orders()
	{
		return $this->hasMany(MstOrder::class, 'customer_id');
	}
}
