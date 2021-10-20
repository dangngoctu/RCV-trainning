<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

/**
 * Class MstUser
 * 
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $verify_email
 * @property string $password
 * @property int $is_active
 * @property int $is_delete
 * @property Carbon|null $last_login_at
 * @property string|null $last_login_ip
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $remember_token
 *
 * @package App\Models
 */
class MstUser extends Authenticatable implements JWTSubject
{
	use Notifiable;
	
	protected $table = 'mst_users';

	protected $casts = [
		'is_active' => 'int',
		'is_delete' => 'int',
		'group_role' => 'int'
	];

	protected $dates = [
		'verify_email',
		'last_login_at'
	];

	protected $hidden = [
		'password',
		'remember_token'
	];

	protected $fillable = [
		'name',
		'email',
		'verify_email',
		'password',
		'is_active',
		'is_delete',
		'last_login_at',
		'last_login_ip',
		'remember_token'
	];

	public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
	}
}
