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
    //
    public function api_login(Request $request){
        $rules = [
            'email' => 'required|email|max:255',
            'password' => 'required|max:255'
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return $this->JsonExport(403, $validator->errors()->first());
        } else {
            try {
                $data = [];
                DB::beginTransaction();
                $credentials = [
                    'email' => $request->email,
                    'password' => $request->password
                ];
    
                if (!$token = auth('api')->attempt($credentials)) {
                    return $this->JsonExport(403, 'Invalid Email or Password');
                }

                $userData = auth('api')->user();
                if($request->has('remember_token') && !empty($request->remember_token)){
                    $data['remember_token'] = $request->remember_token;
                }
                $data['last_login_at'] = Carbon::now();

                $updateToken = $userData->update($data);
                if(!$updateToken){
                    return $this->JsonExport(403, 'Invalid Email or Password');
                }
                DB::commit();
                return $this->JsonExport(200, 'Success', $token);
            } catch (\Exception $e){
                DB::rollback();
                Log::error($e);
                return $this->JsonExport(500, 'Please contact with admin for help!');
            }
        }
    }

    public function api_logout(Request $request){
        
        try{
            if($request->header('Authorization')){
                $logout = JWTAuth::invalidate($request->header('Authorization'));
                if($logout){
                    return $this->JsonExport(200, 'Success');
                } else {
                    return $this->JsonExport(403, 'Token invalid');
                }
            } else {
                return $this->JsonExport(403, 'Token invalid');
            }
        } catch (\Exception $e){
            Log::error($e);
            return $this->JsonExport(500, 'Please contact with admin for help!');
        }
        
    }
}
