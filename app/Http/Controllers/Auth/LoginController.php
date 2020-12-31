<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpKernel\Exception\HttpException;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
                'phone' => 'required',
                'password' => 'required|min:8',
        ]);

        User::validationPhone($request->phone);

        $user = User::where('phone', $request->phone)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw new HttpException(400, 'Учетные данные не соответствуют нашим.');
        }

        return $user->createToken($user->phone)->plainTextToken;
    }

    public function logout(Request $request): void
    {
        $request->user()->tokens()->delete();
    }

    public function user()
    {
        return json_encode(new UserResource(Auth::user()));
    }
}
