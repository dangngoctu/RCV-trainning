<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models;
use Auth;
use Carbon\Carbon;
use Validator;
use Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function __construct()
    {
        
    }
    
    public function apiUserList(Request $request){
        try {
            $data = Models\MstUser::where('is_delete', 0);

            if(!empty($request->name) && $request->has('name')){
                $data = $data->where('name', 'LIKE', '%'.$request->name.'%');
            }

            if(!empty($request->email) && $request->has('email')){
                $data = $data->where('email', 'LIKE', '%'.$request->name.'%');
            }

            if(!empty($request->group_role) && $request->has('group_role')){
                $data = $data->where('group_role', $request->group_role);
            }

            if(!empty($request->is_active) && $request->has('is_active')){
                $data = $data->where('is_active', $request->is_active);
            }

            $data = $data->get();
            return $this->JsonExport(200, 'Thành công', $data);
        } catch (\Exception $e){
            Log::error($e);
            return $this->JsonExport(200, 'Thành công', []);
        }
    }

    public function apiUserDetail(Request $request){
        $rules = [
            'id' => 'required|digits_between:1,10'
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return $this->JsonExport(403, $validator->errors()->first());
        } else {
            try{
                $data = Models\MstUser::where('id', $request->id)->first();
                if($data){
                    return $this->JsonExport(200, 'Thành công', $data);
                } else {
                    return $this->JsonExport(403, 'Người dùng không hợp lệ');
                }
            } catch (\Exception $e){
                Log::error($e);
                return $this->JsonExport(500, 'Vui lòng liên hệ quản trị viên để được hỗ trợ!');
            }
        }
    }

    public function apiUserAction(Request $request){
        $rules = [
            'action' => 'required|in:update,create,delete,disable'
        ];

        if($request->action != 'create') {
            $rules['id'] = 'required|digits_between:1,10';
        } 

        if($request->action === 'create' || $request->action === 'update'){
            $rules['name'] = 'required|max:255';
            $rules['group_role'] = 'required';
            if($request->action === "update"){
                $rules['email'] = 'required|max:255|email|unique:mst_users,email';

                if($request->has('password') && !empty($request->password)){
                    $rules['password'] = 'same:re_password';
                }
            }
            else {
                $rules['email'] = 'required|max:255|email';
                $rules['password'] = 'required|same:re_password';
            }
        }

        $messages = [
            'id.required' => 'ID không được trống.',
            'name.required' => 'Tên không được trống.',
            'name.max' => 'Tên tối đa 255 ký tự.',
            'group_role.required' => 'Nhóm không được trống.',
            'email.required' => 'Email không được trống.',
            'email.unique' => 'Email không được trùng.',
            'email.max' => 'Email tối đa 255 ký tự.',
            'email.email' => 'Email không đúng định dạng.',
            'password.required' => 'Mật khẩu không được trống.',
            'password.same' => 'Xác nhận mật khẩu không trùng khớp',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return $this->JsonExport(403, $validator->errors()->first());
        } else {
            try {
                DB::beginTransaction();
                $data = [];
                if ($request->action === 'update' || $request->action === 'create') {
                    if($request->has('name') && !empty($request->name)){
                        $data['name'] = $request->name;
                    }

                    if($request->has('group_role') && !empty($request->group_role)){
                        $data['group_role'] = $request->group_role;
                    }

                    if($request->has('password') && !empty($request->password)){
                        $data['password'] = Hash::make($request->password);
                    } else {
                        if ($request->action === 'create') {
                            $data['password'] = config('constant.default_password')?Hash::make(config('constant.default_password')):Hash::make(123456);
                        }
                    }

                    if($request->has('is_active')){
                        $data['is_active'] = $request->is_active;
                    }

                    if($request->action === 'create') {
                        $checkUser = Models\MstUser::where('email', $request->email)->where('id', '!=', $request->id)->first();
                        if($checkUser){
                            return $this->JsonExport(403, 'Email không được trùng.');
                        }
                        $data['email'] = $request->email;
                        $action = Models\MstUser::insert($data);
                    } else {
                        $checkUser = Models\MstUser::where('email', $request->email)->first();
                        if($checkUser){
                            return $this->JsonExport(403, 'Email không được trùng.');
                        }

                        $action = Models\MstUser::where('id', $request->id)->update($data);
                    }
                } else {
                    $user = Models\MstUser::where('id', $request->id)->first();
                    if(!$user){
                        return $this->JsonExport(403, 'Người dùng không hợp lệ');
                    }

                    if($request->action === 'delete'){
                        $data['is_delete'] = 1;
                    } else {
                        if($user->is_active == 1){
                            $data['is_active'] = 0;
                        } else {
                            $data['is_active'] = 1;
                        }
                    }
                    $action = $user->update($data);
                }
                if($action){
                    DB::commit();
                    return $this->JsonExport(200, 'Thành công');
                } else {
                    DB::rollback();
                    return $this->JsonExport(403, 'Vui lòng kiểm tra lại dữ liệu.');
                }
            } catch (\Exception $e){
                Log::error($e);
                return $this->JsonExport(500, 'Vui lòng liên hệ quản trị viên để được hỗ trợ!');
            }
        }
    }
}
