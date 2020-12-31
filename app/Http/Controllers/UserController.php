<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\HttpException;

class UserController extends Controller
{
    /**
     * Собственноручное восстановление пароля.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function passwordReset(Request $request)
    {
        $request->validate([
                'password' => 'required|max:255|min:8',
                'newPassword' => 'required|max:255|min:8',
                'repeatNewPassword' => 'required|max:255|min:8'
        ]);
        if ($request->newPassword !== $request->repeatNewPassword) {
            throw new HttpException(400, 'Неправильно повторен новый пароль.');
        }
        $user = $request->user();

        if (!Hash::check($request->password, $user->password)){
            throw new HttpException(400, 'Неверный текущий пароль.');
        }

        $user->update([
                'password' => Hash::make($request->newPassword)
        ]);
        $user->setRememberToken(Str::random(64));
        return response()->json(true, 200);
    }
}
