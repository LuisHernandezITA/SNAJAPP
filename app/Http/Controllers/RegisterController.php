<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class RegisterController extends ResponseController
{
    public function register(Request $request)
{
    $validator = Validator::make($request->all(), [
        'full_name'    => 'required|string|max:255',
        'email'        => 'required|email|unique:users',
        'password'     => 'required|min:6',
        'c_password'   => 'required|same:password',
        'state'        => 'required',
        'municipality' => 'required',
        'phone_number' => 'nullable|string', // Agregamos esta línea
    ]);

    if($validator->fails()){
    // Esto te dirá exactamente qué campo falta o está mal
    return response()->json([
        'success' => false,
        'message' => 'Error de validación detallado',
        'errors'  => $validator->errors()->toArray() 
    ], 422);
}

    $user = User::create([
        'full_name'    => $request->full_name,
        'email'        => $request->email,
        'password'     => Hash::make($request->password),
        'state'        => $request->state,
        'municipality' => $request->municipality,
        'phone_number' => $request->phone_number, // Y esta también
        'role'         => 0,
    ]);

    $success['token'] = $user->createToken('MyApp')->accessToken;
    $success['full_name'] = $user->full_name;

    return response()->json(['success' => true, 'user' => $success]);
}

    public function login(Request $request)
    {
        $user_id = $request->input('user_id');

        if ($user_id) {
            $user = User::find($user_id);
            if ($user) {
                Auth::loginUsingId($user->id);
                $token = $user->createToken('MyApp')->accessToken;

                return response()->json([
                    'success' => true,
                    'message' => 'User login successfully.',
                    'user' => [
                        'user_id' => $user->id,
                        'full_name' => $user->full_name,
                        'role' => $user->role,
                        'token' => $token
                    ]
                ]);
            }
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        } else {
            // Login con credenciales
            if(Auth::attempt(['email' => $request->email, 'password' => $request->password])){
                $user = Auth::user();
                $token = $user->createToken('MyApp')->accessToken;

                return response()->json([
                    'success' => true,
                    'message' => 'User login successfully.',
                    'user' => [
                        'user_id' => $user->id,
                        'full_name' => $user->full_name,
                        'role' => $user->role,
                        'token' => $token
                    ]
                ]);
            }
            return response()->json(['success' => false, 'message' => 'Unauthorised'], 401);
        }
    }
}