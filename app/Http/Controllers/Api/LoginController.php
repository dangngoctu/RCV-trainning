<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use JWTAuth;
use App\Models;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\DB;
use Validator;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class LoginController extends Controller
{
    /**
     * Create token, update data to table user
     * @param json $request request form api
     * @return json $data
     */
    public function apiLogin(Request $request)
    {
        $rules = [
            'email' => 'required|email|max:255',
            'password' => 'required|max:255'
        ];

        $messages = [
            'email.required' => 'Email không được trống.',
            'email.email' => 'Email không đúng định dạng.',
            'email.max' => 'Email tối đa 255 ký tự.',
            'password.required' => 'Mật khẩu không được trống.',
            'password.max' => 'Mật khẩu tối đa 255 ký tự.',
        ];
        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return $this->JsonExport(403, $validator->errors()->first());
        } else {
            try {
                DB::beginTransaction();
                $data = [];
                $credentials = [
                    'email' => $request->email,
                    'password' => $request->password,
                    'is_active' => 1,
                    'is_delete' => 0
                ];

                if (!$token = auth('api')->attempt($credentials)) {
                    return $this->JsonExport(403, config('constant.login_403'));
                }

                $userData = auth('api')->user();
                $data['last_login_at'] = Carbon::now();
                $clientIP = $this->ClientIP();

                $data['last_login_ip'] = $clientIP;
                $data['last_login_at'] = Carbon::now();

                if ($request->has('remember_token') && !empty($request->remember_token)) {
                    $data['remember_token'] = $token;
                } else {
                    $data['remember_token'] = null;
                }

                $updateToken = $userData->update($data);

                if (!$updateToken) {
                    return $this->JsonExport(403, config('constant.login_403'));
                }
                $result = [
                    'token' => $token,
                    'name' => $userData->name
                ];
                DB::commit();
                return $this->JsonExport(200, config('constant.success'), $result);
            } catch (\Exception $e) {
                DB::rollback();
                Log::error($e);
                return $this->JsonExport(500, config('constant.error_500'));
            }
        }
    }

    /**
     * Remove token
     * @param json $request request form api
     * @return string $result
     */
    public function apiLogout(Request $request)
    {
        try {
            if ($request->header('Authorization')) {
                $logout = JWTAuth::invalidate($request->header('Authorization'));
                if ($logout) {
                    return $this->JsonExport(200, config('constant.success'));
                } else {
                    return $this->JsonExport(403, config('constant.error_403'));
                }
            } else {
                return $this->JsonExport(403, config('constant.error_403'));
            }
        } catch (\Exception $e) {
            Log::error($e);
            return $this->JsonExport(500, config('constant.error_500'));
        }
    }
}
