<?php

namespace App\Repositories;
use App\Models;

class ProductRepository
{
    /**
     * Update data product
     * @param array $request request filter
     * @return object $data
     */
    public function getListProduct($request)
    {
        $data = new Models\MstProduct;
        if (!empty($request->name) && $request->has('name')) {
            $data = $data->where('product_name', 'LIKE', '%'.$request->name.'%');
        }

        if ($request->is_sales != "" && $request->has('is_sales')) {
            $data = $data->where('is_sales', $request->is_sales);
        }

        if (!empty($request->price_from) && $request->has('price_from')) {
            $data = $data->where('product_price', '>=', $request->price_from);
        }

        if (!empty($request->price_to) && $request->has('price_to')) {
            $data = $data->where('product_price', '<=', $request->price_to);
        }

        $data = $data->orderBy('created_at')->select('product_id', 'product_name', 'product_price', 'is_sales', 'description')->get();
        return $data;
    }

    /**
     * get data product detail
     * @param int $id id of user
     * @return object $data
     */
    public function getProductDetail($id)
    {
        return Models\MstProduct::where('product_id', $id)->first();
    }

    /**
     * create product
     * @param array $data data product create
     * @return object $data
     */
    public function createProduct($data)
    {
        return Models\MstProduct::create($data);
    }

    /**
     * update product
     * @param int $id id of request
     * @param array $data data product update
     * @return object $data
     */
    public function updateProduct($id, $data)
    {
        return Models\MstProduct::where('product_id', $id)->update($data);
    }

    /**
     * update product
     * @param int $id id of request
     * @return object $data
     */
    public function deleteProduct($id)
    {
        return Models\MstProduct::where('product_id', $id)->delete();
    }

    /**
     * get the latest request have first char
     * @param array $data data product update
     * @return object $data
     */
    public function getRequestLatestFirstChar($name)
    {
        return Models\MstProduct::where('product_id', 'like', '%'.$name[0].'%')
        ->orderBy('product_id', 'desc')->first();
    }
}