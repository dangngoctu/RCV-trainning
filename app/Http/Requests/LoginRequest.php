<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use App\Http\Controllers\Controller;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'email' => 'required|email|max:255',
            'password' => 'required|max:255'
        ];
    }

    public function messages()
    {
        return [
            'email.required' => config('constant.validation.login.email_required'),
            'email.email' => config('constant.validation.login.email_type'),
            'email.max' => config('constant.validation.login.email_max_255'),
            'password.required' => config('constant.validation.login.password_required'),
            'password.max' => config('constant.validation.login.password_max_255'),
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        return Controller::JsonExport(403, $validator->errors()->first());
    }
}
