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
    public function __construct()
    {
        
    }

    public function apiLogin(Request $request){
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
                    return $this->JsonExport(403, 'Invalid Email or Password');
                }

                $userData = auth('api')->user();
                $data['last_login_at'] = Carbon::now();
                $clientIP = $_SERVER['HTTP_CLIENT_IP'] 
                ?? $_SERVER["HTTP_CF_CONNECTING_IP"] 
                ?? $_SERVER['HTTP_X_FORWARDED'] 
                ?? $_SERVER['HTTP_X_FORWARDED_FOR'] 
                ?? $_SERVER['HTTP_FORWARDED'] 
                ?? $_SERVER['HTTP_FORWARDED_FOR'] 
                ?? $_SERVER['REMOTE_ADDR'] 
                ?? '0.0.0.0';

                $data['last_login_ip'] = $clientIP;
                $data['last_login_at'] = Carbon::now();

                if($request->has('remember_token') && !empty($request->remember_token)){
                    $data['remember_token'] = $token;
                } else {
                    $data['remember_token'] = null;
                }

                $updateToken = $userData->update($data);
                if(!$updateToken){
                    return $this->JsonExport(403, 'Invalid Email or Password');
                }
                $result = [
                    'token' => $token,
                    'name' => $userData->name
                ];
                DB::commit();
                return $this->JsonExport(200, 'Thành công', $result);
            } catch (\Exception $e){
                DB::rollback();
                Log::error($e);
                return $this->JsonExport(500, 'Vui lòng liên hệ quản trị viên để được hỗ trợ!');
            }
        }
    }

    public function apiLogout(Request $request){
        
        try{
            if($request->header('Authorization')){
                $logout = JWTAuth::invalidate($request->header('Authorization'));
                if($logout){
                    return $this->JsonExport(200, 'Thành công');
                } else {
                    return $this->JsonExport(403, 'Token invalid');
                }
            } else {
                return $this->JsonExport(403, 'Token invalid');
            }
        } catch (\Exception $e){
            Log::error($e);
            return $this->JsonExport(500, 'Vui lòng liên hệ quản trị viên để được hỗ trợ!');
        }
        
    }
}
