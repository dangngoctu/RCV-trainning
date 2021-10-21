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

class ProductController extends Controller
{
    public function __construct()
    {
        
    }

    public function apiProductList(Request $request){
        try{
            $data = new Models\MstProduct;

            if(!empty($request->name) && $request->has('name')){
                $data = $data->where('product_name', 'LIKE', '%'.$request->name.'%');
            }

            if(!empty($request->is_sales) && $request->has('is_sales')){
                $data = $data->where('is_sales', $request->is_sales);
            }

            if(!empty($request->price_from) && $request->has('price_from')){
                $data = $data->where('product_price', '>=', $request->price_from);
            }

            if(!empty($request->price_to) && $request->has('price_to')){
                $data = $data->where('product_price', '<=', $request->price_to);
            }

            $data = $data->select('product_id', 'product_name', 'product_price', 'is_sales', 'description')->get();
            return $this->JsonExport(200, 'Thành công', $data);
        } catch (\Exception $e){
            Log::error($e);
            return $this->JsonExport(200, 'Thành công', []);
        }
    }
}
