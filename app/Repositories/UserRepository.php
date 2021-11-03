<?php

namespace App\Repositories;
use App\Models;

class UserRepository
{

    /**
     * Update data user
     * @param array $request request filter
     * @return object $data
     */
    public function getListUser($request){
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
        return $data;
    }
    
    /**
     * Update data user
     * @param int $id id of user
     * @param array $data data update
     * @return object $data
     */
    public function updateUser($id, $data)
    {
        return Models\MstUser::where('id', $id)->update($data);
    }

    /**
     * Get data user detail
     * @param int $id id of user
     * @return object $data
     */
    public function getUserDetail($id)
    {
        return Models\MstUser::where('id', $id)->first();
    }

    /**
     * check email exist
     * @param string $email email need to check
     * @param int $id id of user
     * @return object $data
     */
    public function getUserMailExist($email, $id = null)
    {
        if($id != null){
            return Models\MstUser::where('email', $email)
                    ->where('id', '!=', $id)->first();
        } else {
            return Models\MstUser::where('email', $email)->first();
        }
    }

    /**
     * create user
     * @param array $data data user create
     * @return object $data
     */
    public function createUser($data)
    {
        return Models\MstUser::create($data);
    }
}