<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models;
use Validator;
use Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * get data in table mst_user follow filter
     * @param json $request request from api
     * @return json $result
     */
    public function apiUserList(Request $request)
    {
        try {
            $data = Models\MstUser::where('is_delete', 0);

            if (!empty($request->name) && $request->has('name')) {
                $data = $data->where('name', 'LIKE', '%'.$request->name.'%');
            }

            if (!empty($request->email) && $request->has('email')) {
                $data = $data->where('email', 'LIKE', '%'.$request->email.'%');
            }

            if (!empty($request->group_role) && $request->has('group_role')) {
                $data = $data->where('group_role', $request->group_role);
            }

            if ($request->has('is_active') && $request->is_active != "") {
                $data = $data->where('is_active', $request->is_active);
            }

            $data = $data->select('id', 'name', 'email', 'group_role', 'is_active', 'is_delete')->get();
            return $this->JsonExport(200, config('constant.success'), $data);
        } catch (\Exception $e) {
            Log::error($e);
            return $this->JsonExport(200, config('constant.success'), []);
        }
    }

    /**
     * get data detail of user
     * @param json $request id of user
     * @return json $result
     */
    public function apiUserDetail(Request $request)
    {
        $rules = [
            'id' => 'required|digits_between:1,10'
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return $this->JsonExport(403, $validator->errors()->first());
        } else {
            try {
                $data = Models\MstUser::where('id', $request->id)->first();
                if ($data) {
                    return $this->JsonExport(200, config('constant.success'), $data);
                } else {
                    return $this->JsonExport(403, config('constant.error_403'));
                }
            } catch (\Exception $e) {
                Log::error($e);
                return $this->JsonExport(500, config('constant.error_500'));
            }
        }
    }

    /**
     * CRUD user
     * @param json $request from api
     * @return json $result
     */
    public function apiUserAction(Request $request)
    {
        $rules = [
            'action' => 'required|in:update,create,delete,disable'
        ];

        if ($request->action != 'create') {
            $rules['id'] = 'required|digits_between:1,10';
        }

        if ($request->action === 'create' || $request->action === 'update') {
            $rules['name'] = 'required|max:255|min:5';
            $rules['group_role'] = 'required';
            if ($request->action === "update") {
                $rules['email'] = 'required|max:255|email|min:5';
                if ($request->has('password') && !empty($request->password)) {
                    $rules['password'] = 'same:re_password';
                }
            } else {
                $rules['email'] = 'required|max:255|email|unique:mst_users,email';
                $rules['password'] = 'required|same:re_password';
            }
        }

        $messages = [
            'id.required' => config('constant.validation.user.id_required'),
            'name.required' => config('constant.validation.user.name_required'),
            'name.max' => config('constant.validation.user.name_max_255'),
            'name.min' => config('constant.validation.user.name_min_5'),
            'group_role.required' => config('constant.validation.user.id_required'),
            'email.required' => config('constant.validation.user.email_required'),
            'email.unique' => config('constant.validation.user.email_unique'),
            'email.max' => config('constant.validation.user.email_max_255'),
            'email.min' => config('constant.validation.user.email_min_5'),
            'email.email' => config('constant.validation.user.email_type'),
            'password.required' => config('constant.validation.user.password_required'),
            'password.same' => config('constant.validation.user.password_same'),
        ];

        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return $this->JsonExport(403, $validator->errors()->first());
        } else {
            try {
                DB::beginTransaction();
                $data = [];
                if ($request->action === 'update' || $request->action === 'create') {
                    if ($request->has('name') && !empty($request->name)) {
                        $data['name'] = $request->name;
                    }

                    if ($request->has('group_role') && !empty($request->group_role)) {
                        $data['group_role'] = $request->group_role;
                    }

                    if ($request->has('password') && !empty($request->password)) {
                        $data['password'] = Hash::make($request->password);
                    } else {
                        if ($request->action === 'create') {
                            $data['password'] = config('constant.default_password')?
                            Hash::make(config('constant.default_password')):Hash::make(123456);
                        }
                    }

                    if ($request->has('is_active')) {
                        if ($request->is_active === true) {
                            $data['is_active'] = 1;
                        } else {
                            $data['is_active'] = 0;
                        }
                    } else {
                        $data['is_active'] = 0;
                    }

                    if ($request->action === 'create') {
                        $checkUser = Models\MstUser::where('email', $request->email)->first();
                        if ($checkUser) {
                            return $this->JsonExport(403, config('constant.email_exist'));
                        }
                        $data['email'] = $request->email;
                        $data['remember_token'] = null;
                        $action = Models\MstUser::create($data);
                    } else {
                        $checkUser = Models\MstUser::where('email', $request->email)
                                    ->where('id', '!=', $request->id)->first();
                        if ($checkUser) {
                            return $this->JsonExport(403, config('constant.email_exist'));
                        }

                        $action = Models\MstUser::where('id', $request->id)->update($data);
                    }
                } else {
                    $user = Models\MstUser::where('id', $request->id)->first();
                    if (!$user) {
                        return $this->JsonExport(403, config('constant.error_403'));
                    }

                    if ($request->action === 'delete') {
                        $data['is_delete'] = 1;
                    } else {
                        if ($user->is_active == 1) {
                            $data['is_active'] = 0;
                        } else {
                            $data['is_active'] = 1;
                        }
                    }
                    $action = $user->update($data);
                }
                if ($action) {
                    DB::commit();
                    return $this->JsonExport(200, config('constant.success'));
                } else {
                    DB::rollback();
                    return $this->JsonExport(403, config('constant.error_403'));
                }
            } catch (\Exception $e) {
                DB::rollback();
                Log::error($e);
                return $this->JsonExport(500, config('constant.error_500'));
            }
        }
    }
}
