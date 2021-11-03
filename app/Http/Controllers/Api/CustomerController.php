<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models;
use Carbon\Carbon;
use Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Imports\CustomersImport;
use App\Exports\CustomersExport;
use Maatwebsite\Excel\Facades\Excel;

class CustomerController extends Controller
{
    /**
     * get data in table mst_customer follow on filter
     * @param json $request from api
     * @return json $result
     */
    public function apiCustomerList(Request $request)
    {
        try {
            $data = new Models\MstCustomer;

            if (!empty($request->customer_name) && $request->has('customer_name')) {
                $data = $data->where('customer_name', 'LIKE', '%'.$request->customer_name.'%');
            }

            if (!empty($request->email) && $request->has('email')) {
                $data = $data->where('email', 'LIKE', '%'.$request->email.'%');
            }

            if (!empty($request->address) && $request->has('address')) {
                $data = $data->where('address', 'LIKE', '%'.$request->address.'%');
            }

            if ($request->has('is_active') && $request->is_active != "") {
                $data = $data->where('is_active', $request->is_active);
            }

            $data = $data->select('customer_id', 'customer_name', 'email', 'tel_num', 'address', 'is_active')->get();
            return $this->JsonExport(200, config('constant.success'), $data);
        } catch (\Exception $e) {
            Log::error($e);
            return $this->JsonExport(200, config('constant.success'), []);
        }
    }

    /**
     * get data detail of customer
     * @param json $request from api
     * @return json $result
     */
    public function apiCustomerDetail(Request $request)
    {
        $rules = [
            'id' => 'required|digits_between:1,10'
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return $this->JsonExport(403, $validator->errors()->first());
        } else {
            try {
                $data = Models\MstCustomer::where('customer_id', $request->id)->first();
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
     * CRUD customer
     * @param json $request from api
     * @return json $result
     */
    public function apiCustomerAction(Request $request)
    {
        $rules = [
            'action' => 'required|in:update,create',
            'customer_name' => 'required|max:255|min:5',
            'tel_num' => 'required|max:14|regex:/^([0-9\s\-\+\(\)]*)$/',
            'address' => 'required|max:255',
        ];
        if ($request->action === "update") {
            $rules['id'] = 'required|digits_between:1,10';
            $rules['email'] = 'required|max:255|email';
        } else {
            $rules['email'] = 'required|max:255|email|unique:mst_customer,email';
        }

        $messages = [
            'id.required' => config('constant.validation.customer.id_required'),
            'action.required' => config('constant.validation.customer.action_required'),
            'customer_name.required' => config('constant.validation.customer.name_required'),
            'customer_name.max' => config('constant.validation.customer.name_max_255'),
            'customer_name.min' => config('constant.validation.customer.name_min_5'),
            'email.required' => config('constant.validation.customer.email_required'),
            'email.unique' => config('constant.validation.customer.email_unique'),
            'email.max' => config('constant.validation.customer.email_max_255'),
            'email.email' => config('constant.validation.customer.email_type'),
            'tel_num.required' => config('constant.validation.customer.phone_required'),
            'tel_num.max' => config('constant.validation.customer.phone_max'),
            'tel_num.regex' => config('constant.validation.customer.phone_type'),
            'address.required' => config('constant.validation.customer.address_required'),
            'address.max' => config('constant.validation.customer.address_max'),
        ];
        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return $this->JsonExport(403, $validator->errors()->first());
        } else {
            try {
                DB::beginTransaction();
                $data = [];
                if (!empty($request->customer_name) && $request->has('customer_name')) {
                    $data['customer_name'] = $request->customer_name;
                }

                if (!empty($request->email) && $request->has('email')) {
                    $data['email'] = $request->email;
                }

                if (!empty($request->address) && $request->has('address')) {
                    $data['address'] = $request->address;
                }

                if (!empty($request->tel_num) && $request->has('tel_num')) {
                    $data['tel_num'] = trim($request->tel_num);
                }

                if (!empty($request->is_active) && $request->has('is_active')) {
                    if ($request->is_active === true) {
                        $data['is_active'] = 1;
                    } else {
                        $data['is_active'] = 0;
                    }
                } else {
                    $data['is_active'] = 0;
                }

                if ($request->action === 'create') {
                    $checkMail = Models\MstCustomer::where('email', $request->email)->first();
                    if ($checkMail) {
                        return $this->JsonExport(403, config('constant.email_exist'));
                    }

                    $action = Models\MstCustomer::create($data);
                } else {
                    $checkMail = Models\MstCustomer::where('email', $request->email)
                                ->where('customer_id', '!=', $request->id)->first();
                    if ($checkMail) {
                        return $this->JsonExport(403, config('constant.email_exist'));
                    }

                    $customer = Models\MstCustomer::where('customer_id', $request->id)->first();
                    if ($customer) {
                        $action = $customer->update($data);
                    } else {
                        return $this->JsonExport(403, config('constant.error_403'));
                    }
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

    /**
     * import customer
     * @param json $request from api
     * @return json $result
     */
    public function apiCustomerImport(Request $request)
    {
        $rules = [
            'import_file' => 'required|mimes:xlsx,xls',
        ];
        $messages = [
            'import_file.required' => config('constant.validation.customer.file_required'),
            'import_file.mimes' => config('constant.validation.customer.file_type_csv'),
        ];
        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return $this->JsonExport(403, $validator->errors()->first());
        } else {
            try {
                $import = new CustomersImport();
                Excel::import($import, $request->import_file);
                if (count($import->getErrorRow()) > 0) {
                    return $this->JsonExport(200, 'row '.implode(',', $import->getErrorRow()). ' is error');
                } else {
                    return $this->JsonExport(200, config('constant.success'));
                }
            } catch (\Exception $e) {
                Log::error($e);
                return $this->JsonExport(500, config('constant.error_500'));
            }
        }
    }

    /**
     * export customer
     * @param json $request from api
     * @return json $result
     */
    public function apiCustomerExport(Request $request)
    {
        try {
            $data = new Models\MstCustomer;
            $is_filter = false;

            if (!empty($request->customer_name) && $request->has('customer_name')) {
                $data = $data->where('customer_name', 'LIKE', '%'.$request->customer_name.'%');
                $is_filter = true;
            }

            if (!empty($request->email) && $request->has('email')) {
                $data = $data->where('email', 'LIKE', '%'.$request->name.'%');
                $is_filter = true;
            }

            if (!empty($request->address) && $request->has('address')) {
                $data = $data->where('address', 'LIKE', '%'.$request->address.'%');
                $is_filter = true;
            }

            if (!empty($request->is_active) && $request->has('is_active')) {
                $data = $data->where('is_active', $request->is_active);
                $is_filter = true;
            }

            if ($is_filter === true) {
                $data = $data->get();
            } else {
                $data = $data->take(10)->get();
            }
           
            return Excel::download(new CustomersExport($data), 'CustomersExport-'.Carbon::now()
                    ->format('Y-m-d').'.xlsx');
        } catch (\Exception $e) {
            Log::error($e);
            return $this->JsonExport(500, config('constant.error_500'));
        }
    }
}
