<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Notifications\ResetPasswordNotification;
use App\UserEmail;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ResetPasswordController extends Controller
{
    use SendsPasswordResetEmails;

    public function forgot(Request $request)
    {
        $request->validate([
                'email' => 'required|email'
        ]);

        $email = UserEmail::whereEmail($request->email)->first();

        if (!$email) {
            throw new HttpException(404, 'Данный e-mail не найден');
        }

        $user = $email->user;

        if (!is_null($user)) {
            $passwordBroker = app('auth.password')->broker('user_emails');
            $token = $passwordBroker->getRepository()->create($email);
            Notification::route('mail', $request->email)
                    ->notify(new ResetPasswordNotification($token, $request->email));
            return response()->json('Мы направили на ваш email ссылку для восстановления пароля.', 200);
        }
    }

    public function reset(Request $request)
    {
        $request->validate([
                'email' => 'required|email',
                'token' => 'required|string',
                'password' => 'required|string|min:8|max:256'
        ]);

        $email = UserEmail::whereEmail($request->email)->first();
        $user = $email->user;
        if (is_null($user)) {
            throw new HttpException(404, 'Такого пользователя не существует.');
        }

        $resetData = DB::table('password_resets')->whereEmail($request->email)->first();
        if (is_null($resetData) || !Hash::check($request->token, $resetData->token)) {
            throw new HttpException(400, 'Предоставлен недействительный токен.');
        }

        try {
            $user->password = Hash::make($request->password);
            $user->setRememberToken(Str::random(64));
            $user->save();
            $passwordBroker = app('auth.password')->broker('user_emails');
            $passwordBroker->getRepository()->delete($email);
        } catch (\Exception $e) {
            throw new HttpException(500, 'Что-то пошло не так при изменении пароля.');
        }

        return response()->json('Пароль успешно изменен.', 200);
    }
}
