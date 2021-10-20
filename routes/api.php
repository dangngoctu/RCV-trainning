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
Route::post('login', 'Api\LoginController@api_login')->name('login');
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['middleware' => 'auth.jwt'], function () {
    Route::post('logout', 'Api\LoginController@api_logout')->name('api_logout');

    Route::group(['namespace' => 'Api', 'prefix' => 'user'], function () {
        Route::post('/', 'UserController@apiUserList')->name('api_user_list');
        Route::post('/detail', 'UserController@apiUserDetail')->name('api_user_detail');
        Route::post('/action', 'UserController@apiUserAction')->name('api_user_action');
    });
});
