<?php

namespace App\Http\Controllers\Auth;

use App\Buyer;
use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Notifications\RegisterNotification;
use App\Notifications\UserRegistryNotification;
use App\User;
use App\UserEmail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Hash;


class RegisterController extends Controller
{
    public function register(RegisterRequest $request)
    {
        User::validationPhone($request->phone);
        $user = User::create([
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
        ]);

        UserEmail::create([
                'user_id' => $user->id,
                'email' => $request->email,
                'priority' => UserEmail::MAIN_EMAIL
        ]);

        Buyer::create([
                'user_id' => $user->id,
                'entity' => $request->entity,
                'city' => $request->city,
                'inn' => $request->inn,
        ]);

        User::notifyStaff(new RegisterNotification($request->entity, $request->phone, $request->email));
        Notification::route('mail', $request->email)->notify(new UserRegistryNotification($request->phone, $request->password));
        return $user->createToken($user->phone)->plainTextToken;
    }
}
