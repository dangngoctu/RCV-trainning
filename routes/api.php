<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::post('login', 'Api\LoginController@apiLogin')->name('login');
// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::group(['middleware' => 'auth.jwt'], function () {
    Route::post('logout', 'Api\LoginController@apiLogout')->name('api_logout');

    Route::group(['namespace' => 'Api', 'prefix' => 'user'], function () {
        Route::post('/', 'UserController@apiUserList')->name('api_user_list');
        Route::post('/detail', 'UserController@apiUserDetail')->name('api_user_detail');
        Route::post('/action', 'UserController@apiUserAction')->name('api_user_action');
    });

    Route::group(['namespace' => 'Api', 'prefix' => 'customer'], function () {
        Route::post('/', 'CustomerController@apiCustomerList')->name('api_customer_list');
        Route::post('/detail', 'CustomerController@apiCustomerDetail')->name('api_customer_detail');
        Route::post('/action', 'CustomerController@apiCustomerAction')->name('api_customer_action');
        Route::post('/import', 'CustomerController@apiCustomerImport')->name('api_customer_import');
        Route::post('/export', 'CustomerController@apiCustomerExport')->name('api_customer_export');
    });

    Route::group(['namespace' => 'Api', 'prefix' => 'product'], function () {
        Route::post('/', 'ProductController@apiProductList')->name('api_product_list');
        Route::post('/detail', 'ProductController@apiProductDetail')->name('api_product_detail');
        Route::post('/action', 'ProductController@apiProductAction')->name('api_product_action');
    });
});
