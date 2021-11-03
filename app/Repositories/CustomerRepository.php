<?php

namespace App\Repositories;
use App\Models;

class CustomerRepository
{
    /**
     * Update data customer
     * @param array $request request filter
     * @return object $data
     */
    public function getListCustomer($request, $export = false)
    {
        $is_filter = false;
        $data = new Models\MstCustomer;

        if (!empty($request->customer_name) && $request->has('customer_name')) {
            $data = $data->where('customer_name', 'LIKE', '%'.$request->customer_name.'%');
            $is_filter = true;
        }

        if (!empty($request->email) && $request->has('email')) {
            $data = $data->where('email', 'LIKE', '%'.$request->email.'%');
            $is_filter = true;
        }

        if (!empty($request->address) && $request->has('address')) {
            $data = $data->where('address', 'LIKE', '%'.$request->address.'%');
            $is_filter = true;
        }

        if ($request->has('is_active') && $request->is_active != "") {
            $data = $data->where('is_active', $request->is_active);
            $is_filter = true;
        }

        if($export === true) {
            if ($is_filter === true) {
                $data = $data->get();
            } else {
                $data = $data->take(10)->get();
            }
        } else {
            $data = $data->select('customer_id', 'customer_name', 'email', 'tel_num', 'address', 'is_active')->get();
        }
        
        return $data;
    }

    /**
     * get data customer detail
     * @param int $id id of customer
     * @return object $data
     */
    public function getCustomerDetail($id)
    {
        return Models\MstCustomer::where('customer_id', $id)->first();
    }

    /**
     * check customer exist
     * @param string $email customer need to check
     * @param int $id id of customer
     * @return object $data
     */
    public function getCustomerMailExist($email, $id = null)
    {
        if($id != null){
            return Models\MstCustomer::where('email', $email)
                    ->where('customer_id', '!=', $id)->first();
        } else {
            return Models\MstCustomer::where('email', $email)->first();
        }
    }

    /**
     * create customer
     * @param array $data customer user create
     * @return object $data
     */
    public function createCustomer($data)
    {
        return Models\MstCustomer::create($data);
    }

    /**
     * Update data customer
     * @param int $id id of customer
     * @param array $data data update
     * @return object $data
     */
    public function updateCustomer($id, $data)
    {
        return Models\MstCustomer::where('customer_id', $id)->update($data);
    }
}