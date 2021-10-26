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
                $data = $data->where('email', 'LIKE', '%'.$request->email.'%');
            }

            if(!empty($request->address) && $request->has('address')){
                $data = $data->where('address', 'LIKE', '%'.$request->address.'%');
            }

            if(!empty($request->is_active) && $request->has('is_active')){
                $data = $data->where('is_active', $request->is_active);
            }

            $data = $data->select('customer_id', 'customer_name', 'email', 'tel_num', 'address', 'is_active')->get();
            return $this->JsonExport(200, 'Thành công', $data);
        } catch (\Exception $e){
            Log::error($e);
            return $this->JsonExport(200, 'Thành công', []);
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
                    return $this->JsonExport(200, 'Thành công', $data);
                } else {
                    return $this->JsonExport(403, 'Khách hàng không hợp lệ');
                }
            } catch (\Exception $e){
                Log::error($e);
                return $this->JsonExport(500, 'Vui lòng liên hệ quản trị viên để được hỗ trợ!');
            }
        }
    }

    public function apiCustomerAction(Request $request){
        $rules = [
            'action' => 'required|in:update,create',
            'customer_name' => 'required|max:255|min:5',
            'tel_num' => 'required|max:14|regex:/^([0-9\s\-\+\(\)]*)$/',
            'address' => 'required|max:255',
        ];
        if($request->action === "update"){
            $rules['id'] = 'required|digits_between:1,10';
            $rules['email'] = 'required|max:255|email';
        } else {
            $rules['email'] = 'required|max:255|email|unique:mst_customer,email';
        }

        $messages = [
            'id.required' => 'ID không được trống.',
            'action.required' => 'Action không được trống.',
            'customer_name.required' => 'Tên không được trống.',
            'customer_name.max' => 'Tên tối đa 255 ký tự.',
            'customer_name.min' => 'Tên tối thiểu 5 ký tự.',
            'email.required' => 'Email không được trống.',
            'email.unique' => 'Email không được trùng.',
            'email.max' => 'Email tối đa 255 ký tự.',
            'email.email' => 'Email không đúng định dạng.',
            'tel_num.required' => 'Điện thoại không được trống.',
            'tel_num.max' => 'Điện thoại tối đa 14 số.',
            'tel_num.regex' => 'Điện thoại không đúng định dạng.',
            'tel_num.required' => 'Điện thoại không được trống.',
            'address.required' => 'Địa chỉ không được trống.',
            'address.max' => 'Địa chỉ tối đa 255 số.',
        ];
        $validator = Validator::make($request->all(), $rules, $messages);
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
                    $checkMail = Models\MstCustomer::where('email', $request->email)->first();
                    if($checkMail){
                        return $this->JsonExport(403, 'Email đã tồn tại');
                    }

                    $action = Models\MstCustomer::create($data);
                } else {
                    $checkMail = Models\MstCustomer::where('email', $request->email)->where('id', '!=', $request->id)->first();
                    if($checkMail){
                        return $this->JsonExport(403, 'Email đã tồn tại');
                    }

                    $customer = Models\MstCustomer::where('customer_id', $request->id)->first();
                    if($customer){
                        $action = $customer->update($data);
                    } else {
                        return $this->JsonExport(403, 'Khách hàng không hợp lệ');
                    }
                }
                if($action){
                    DB::commit();
                    return $this->JsonExport(200, 'Thành công');
                } else {
                    DB::rollback();
                    return $this->JsonExport(403, 'Vui lòng kiểm tra lại dữ liệu.');
                }
            } catch (\Exception $e){
                DB::rollback();
                Log::error($e);
                return $this->JsonExport(500, 'Vui lòng liên hệ quản trị viên để được hỗ trợ!');
            }
        }
    }

    public function apiCustomerImport(Request $request){
        $rules = [
            'import_file' => 'required|mimes:xlsx,xls',
        ];
        $messages = [
            'import_file.required' => 'File không được trống.',
            'import_file.mimes' => 'File phải thuộc định dạng xlsx, xls.',
        ];
        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return $this->JsonExport(403, $validator->errors()->first());
        } else {
            try {
                $import = new CustomersImport();
                Excel::import($import, $request->import_file);
                if(count($import->getErrorRow()) > 0){
                    return $this->JsonExport(200, 'row '.implode( ',', $import->getErrorRow()). ' is error');
                } else {
                    return $this->JsonExport(200, 'Thành công');
                }
            } catch (\Exception $e){
                Log::error($e);
                return $this->JsonExport(500, 'Vui lòng liên hệ quản trị viên để được hỗ trợ!');
            }
        }
    }

    public function apiCustomerExport(Request $request){
        try {
            $data = new Models\MstCustomer;
            $is_filter = false;

            if(!empty($request->customer_name) && $request->has('customer_name')){
                $data = $data->where('customer_name', 'LIKE', '%'.$request->customer_name.'%');
                $is_filter = true;
            }

            if(!empty($request->email) && $request->has('email')){
                $data = $data->where('email', 'LIKE', '%'.$request->name.'%');
                $is_filter = true;
            }

            if(!empty($request->address) && $request->has('address')){
                $data = $data->where('address', 'LIKE', '%'.$request->address.'%');
                $is_filter = true;
            }

            if(!empty($request->is_active) && $request->has('is_active')){
                $data = $data->where('is_active', $request->is_active);
                $is_filter = true;
            }

            if($is_filter === true){
                $data = $data->get();
            } else {
                $data = $data->take(10)->get();
            }
           
            return Excel::download(new CustomersExport($data), 'CustomersExport-'.Carbon::now()->format('Y-m-d').'.xlsx');
        } catch (\Exception $e){
            Log::error($e);
            return $this->JsonExport(500, 'Vui lòng liên hệ quản trị viên để được hỗ trợ!');
        }
    }
}
