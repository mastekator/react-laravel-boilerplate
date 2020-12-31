<?php

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
Route::post('/login', 'Auth\LoginController@login')->name('login');
Route::post('/register', 'Auth\RegisterController@register')->name('register');
Route::post('/forgot', 'Auth\ResetPasswordController@forgot')->name('password.forgot');
Route::post('/reset', 'Auth\ResetPasswordController@reset')->name('password.reset');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', 'Auth\LoginController@user');
    Route::post('/logout', 'Auth\LoginController@logout')->name('logout');

    Route::put('/users/passwordreset', 'UserController@passwordReset');
});
