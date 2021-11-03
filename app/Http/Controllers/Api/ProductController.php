<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models;
use Auth;
use Carbon\Carbon;
use Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Imports\CustomersImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Yajra\Datatables\Datatables;

class ProductController extends Controller
{
    /**
     * get data in table mst_product follow on filter
     * @param json $request from api
     * @return json $result
     */
    public function apiProductList(Request $request)
    {
        try {
            $data = new Models\MstProduct;
            if (!empty($request->name) && $request->has('name')) {
                $data = $data->where('product_name', 'LIKE', '%'.$request->name.'%');
            }

            if (!empty($request->is_sales) && $request->has('is_sales')) {
                $data = $data->where('is_sales', $request->is_sales);
            }

            if (!empty($request->price_from) && $request->has('price_from')) {
                $data = $data->where('product_price', '>=', $request->price_from);
            }

            if (!empty($request->price_to) && $request->has('price_to')) {
                $data = $data->where('product_price', '<=', $request->price_to);
            }

            $data = $data->select('product_id', 'product_name', 'product_price', 'is_sales', 'description');
            $data = Datatables::of($data)
                    ->addColumn('is_sales_show', function ($v) {
                        if ($v->is_sales == 1) {
                            return 'Đang bán';
                        } elseif ($v->is_sales == 2) {
                            return 'Đang hết hàng';
                        } else {
                            return 'Ngừng bán';
                        }
                    })
                    ->editColumn('description', function ($v) {
                        if (strlen($v->description) > 50) {
                            $string = mb_substr($v->description, 0, 50). '...';
                            return $string;
                        } else {
                            return $v->description;
                        }
                    })
                    ->rawColumns(['action'])
                    ->make(true);
            return $this->JsonExport(200, 'Thành công', $data->original);
        } catch (\Exception $e) {
            Log::error($e);
            return $this->JsonExport(200, 'Thành công', []);
        }
    }

    /**
     * get data detail of product
     * @param json $request id of product
     * @return json $result
     */
    public function apiProductDetail(Request $request)
    {
        $rules = [
            'id' => 'required'
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return $this->JsonExport(403, $validator->errors()->first());
        } else {
            try {
                $data = Models\MstProduct::where('product_id', $request->id)->first();
                if ($data) {
                    return $this->JsonExport(200, 'Thành công', $data);
                } else {
                    return $this->JsonExport(403, 'Sản phẩm không hợp lệ');
                }
            } catch (\Exception $e) {
                Log::error($e);
                return $this->JsonExport(500, 'Vui lòng liên hệ quản trị viên để được hỗ trợ!');
            }
        }
    }

    /**
     * CRUD customer
     * @param json $request id of product
     * @return json $result
     */
    public function apiProductAction(Request $request)
    {
        $rules = [
            'action' => 'required|in:update,create,delete',
            'product_name' => 'required|max:255|min:5',
            'product_price' => 'required|min:0|integer',
            'file' => 'max:2048',
            'is_sales' => 'required|in:0,1,2',
        ];

        if ($request->action != 'create') {
            $rules['id'] = 'required';
        }

        if ($request->action === 'delete') {
            $rules = [
                'id' => 'required',
            ];
        }

        $messages = [
            'id.required' => 'ID không được trống.',
            'product_name.required' => 'Tên không được trống.',
            'is_sales.required' => 'Trạng thái không được trống.',
            'product_name.max' => 'Tên tối đa 5 ký tự.',
            'product_name.min' => 'Tên tối thiểu 5 ký tự.',
            'product_price.integer' => 'Giá phải là số',
            'product_price.required' => 'Giá không được để trống',
            'product_price.min' => 'Giá không được âm',
            'file.mines' => 'File phải thuộc định dạng png, jpeg, jpg.',
            'file.max' => 'File tối đa 2MB.'
        ];

        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return $this->JsonExport(403, $validator->errors()->first());
        } else {
            try {
                DB::beginTransaction();
                $data = [];
                $dir_file = public_path('img/product');
                if (!File::exists($dir_file)) {
                    File::makeDirectory($dir_file, 0777, true, true);
                }

                if ($request->action === 'create' || $request->action === 'update') {
                    if (!empty($request->product_name) && $request->has('product_name')) {
                        $data['product_name'] = $request->product_name;
                    }
    
                    if (!empty($request->product_price) && $request->has('product_price')) {
                        $data['product_price'] = $request->product_price;
                    }
    
                    if (!empty($request->is_sales) && $request->has('is_sales')) {
                        $data['is_sales'] = $request->is_sales;
                    } else {
                        $data['is_sales'] = 0;
                    }
    
                    if (!empty($request->description) && $request->has('description')) {
                        $data['description'] = $request->description;
                    }
    
                    if ($request->has('file') && !empty($request->file) && $request->file != 'undefined') {
                        $product_image = 'productImage_'.time().'.'.$request->file->getClientOriginalExtension();
                        $data['product_image'] = $product_image;
                    }

                    if ($request->action === 'create') {
                        $last_request = Models\MstProduct::where('product_id', 'like', '%'.$request->product_name[0].'%')
                                        ->orderBy('product_id', 'desc')->first();
                        if ($last_request) {
                            $newId = (int)substr($last_request->product_id, 1)+1;
                        } else {
                            $newId = 1;
                        }

                        $newId = str_pad($newId, 9, "0", STR_PAD_LEFT);
                        $data['product_id'] = $request->product_name[0].$newId;
                        $action = Models\MstProduct::create($data);
                        if ($request->has('file') && !empty($request->file) && $request->file != 'undefined') {
                            $request->file->move($dir_file, $product_image);
                        }
                    } else {
                        $product = Models\MstProduct::where('product_id', $request->id)->first();
                        if ($product) {
                            if ($request->has('file') && !empty($request->file) && $request->file != 'undefined') {
                                if (!empty($product->product_image) && !empty($request->file) && $request->file != 'undefined') {
                                    @unlink(public_path('/img/product/'. $product->product_image));
                                }
                                $request->file->move($dir_file, $product_image);
                            }
                            $action = $product->update($data);
                        } else {
                            DB::rollback();
                            return $this->JsonExport(403, 'Sản phẩm không hợp lệ');
                        }
                    }
                } else {
                    $product = Models\MstProduct::where('product_id', $request->id)->first();

                    if ($product) {
                        if (!empty($product->product_image)) {
                            @unlink(public_path('/img/product/'. $product->product_image));
                        }
                        $action = $product->delete();
                    } else {
                        DB::rollback();
                        return $this->JsonExport(403, 'Sản phẩm không hợp lệ');
                    }
                }

                if ($action) {
                    DB::commit();
                    return $this->JsonExport(200, 'Thành công');
                } else {
                    DB::rollback();
                    return $this->JsonExport(403, 'Vui lòng kiểm tra lại dữ liệu.');
                }
            } catch (\Exception $e) {
                DB::rollback();
                Log::error($e);
                return $this->JsonExport(500, 'Vui lòng liên hệ quản trị viên để được hỗ trợ!');
            }
        }
    }
}
