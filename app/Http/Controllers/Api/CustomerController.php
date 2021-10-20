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
use App\Imports\CustomersImport;
use Maatwebsite\Excel\Facades\Excel;

class CustomerController extends Controller
{
    public function __construct()
    {

    }

    public function apiCustomerList(Request $request){
        try {
            $data = new Models\MstCustomer;

            if(!empty($request->customer_name) && $request->has('customer_name')){
                $data = $data->where('customer_name', 'LIKE', '%'.$request->customer_name.'%');
            }

            if(!empty($request->email) && $request->has('email')){
                $data = $data->where('email', 'LIKE', '%'.$request->name.'%');
            }

            if(!empty($request->address) && $request->has('address')){
                $data = $data->where('address', 'LIKE', '%'.$request->address.'%');
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

    public function apiCustomerDetail(Request $request){
        $rules = [
            'id' => 'required|digits_between:1,10'
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return $this->JsonExport(403, $validator->errors()->first());
        } else {
            try{
                $data = Models\MstCustomer::where('customer_id', $request->id)->first();
                if($data){
                    return $this->JsonExport(200, 'Success', $data);
                } else {
                    return $this->JsonExport(403, 'Customer is not invalid');
                }
            } catch (\Exception $e){
                Log::error($e);
                return $this->JsonExport(500, 'Please contact with admin for help!');
            }
        }
    }

    public function apiCustomerAction(Request $request){
        $rules = [
            'action' => 'required|in:update,create',
            'customer_name' => 'required|max:255|min:5',
            'tel_num' => 'required|max:14|regex:/^([0-9\s\-\+\(\)]*)$/',
            'email' => 'required|max:255|email',
            'address' => 'required|max:255',
        ];
        if($request->action === "update"){
            $rules['id'] = 'required|digits_between:1,10';
        }
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return $this->JsonExport(403, $validator->errors()->first());
        } else {
            try {
                DB::beginTransaction();
                $data = [];
                if(!empty($request->customer_name) && $request->has('customer_name')){
                    $data['customer_name'] = $request->customer_name;
                }

                if(!empty($request->email) && $request->has('email')){
                    $data['email'] = $request->email;
                }

                if(!empty($request->address) && $request->has('address')){
                    $data['address'] = $request->address;
                }

                if(!empty($request->tel_num) && $request->has('tel_num')){
                    $data['tel_num'] = trim($request->tel_num);
                }

                if(!empty($request->is_active) && $request->has('is_active')){
                    $data['is_active'] = $request->is_active;
                } else {
                    $data['is_active'] = 0;
                }

                if($request->action === 'create'){
                    $action = Models\MstCustomer::insert($data);
                } else {
                    $customer = Models\MstCustomer::where('customer_id', $request->id)->first();
                    if($customer){
                        $action = $customer->update($data);
                    } else {
                        return $this->JsonExport(403, 'Customer is not invalid');
                    }
                }
                if($action){
                    DB::commit();
                    return $this->JsonExport(200, 'Success');
                } else {
                    DB::rollback();
                    return $this->JsonExport(403, 'Please review your data again.');
                }
            } catch (\Exception $e){
                DB::rollback();
                Log::error($e);
                return $this->JsonExport(500, 'Please contact with admin for help!');
            }
        }
    }

    public function apiCustomerImport(Request $request){
        $rules = [
            'import_file' => 'required|mimes:xlsx,xls',
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return $this->JsonExport(403, $validator->errors()->first());
        } else {
            try {
                $import = new CustomersImport();
                Excel::import($import, $request->import_file);
                if(count($import->getErrorRow()) > 0){
                    return $this->JsonExport(200, 'row '.implode( ',', $import->getErrorRow()). ' is error');
                } else {
                    return $this->JsonExport(200, 'Success');
                }
            } catch (\Exception $e){
                Log::error($e);
                return $this->JsonExport(500, 'Please contact with admin for help!');
            }
        }
    }
}
