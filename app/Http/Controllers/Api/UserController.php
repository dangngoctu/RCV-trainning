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
    //
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
            return $this->JsonExport(200, 'Success', $data);
        } catch (\Exception $e){
            Log::error($e);
            return $this->JsonExport(200, 'Success', []);
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
                    return $this->JsonExport(200, 'Success', $data);
                } else {
                    return $this->JsonExport(403, 'User is not invalid');
                }
            } catch (\Exception $e){
                Log::error($e);
                return $this->JsonExport(500, 'Please contact with admin for help!');
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
            $rules['email'] = 'required|max:255|email';
            $rules['group_role'] = 'required';
        }

        if($request->has('password') && !empty($request->password)){
            $rules['password'] = 'same:re_password';
        }

        $validator = Validator::make($request->all(), $rules);
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
                        $checkUser = Models\MstUser::where('email', $request->email)->first();
                        if($checkUser){
                            return $this->JsonExport(403, 'Email is exits');
                        }
                        $data['email'] = $request->email;
                        $action = Models\MstUser::insert($data);
                    } else {
                        $action = Models\MstUser::where('id', $request->id)->update($data);
                    }
                } else {
                    $user = Models\MstUser::where('id', $request->id)->first();
                    if(!$user){
                        return $this->JsonExport(403, 'User is not invalid');
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
                    return $this->JsonExport(200, 'Success');
                } else {
                    DB::rollback();
                    return $this->JsonExport(403, 'Please review your data again.');
                }
            } catch (\Exception $e){
                Log::error($e);
                return $this->JsonExport(500, 'Please contact with admin for help!');
            }
        }
    }
}
