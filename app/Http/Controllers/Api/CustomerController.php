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
}
