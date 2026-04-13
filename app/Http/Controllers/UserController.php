<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * Listado de usuarios
     */
    public function index()
    {
        return response()->json(User::all(), 200);
    }

    /**
     * Registro de nuevo usuario (Store)
     */
    public function store(Request $request)
    {
        // 1. Validar los datos que vienen de React
        $validator = Validator::make($request->all(), [
            'full_name'    => 'required|string|max:255',
            'email'        => 'required|string|email|max:255|unique:users',
            'password'     => 'required|string|min:6',
            'state'        => 'required|string',
            'municipality' => 'required|string',
            'phone_number' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors'  => $validator->errors()
            ], 422);
        }

        // 2. Crear el usuario con la nueva estructura
        $user = User::create([
            'full_name'    => $request->full_name,
            'email'        => $request->email,
            'password'     => Hash::make($request->password), // Encriptación vital
            'state'        => $request->state,
            'municipality' => $request->municipality,
            'phone_number' => $request->phone_number,
            'role'         => 0, // 0 = Juvenil por defecto
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User created successfully',
            'user'    => $user
        ], 201);
    }

    /**
     * Mostrar un usuario específico
     */
   public function show($id) {
    $user = User::find($id);
    // Creamos un token nuevo en cada 'show' (hidratación)
    $token = $user->createToken('Personal Access Token')->accessToken; 
    
    return response()->json([
        'user' => $user,
        'token' => $token
    ]);
}

    /**
     * Update: Ideal para cuando el OCR extraiga los datos después
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Aquí actualizamos los campos del OCR
        $user->update($request->only([
            'dob', 'address', 'section', 'voter_key', 
            'curp', 'ocr_id', 'id_card_front', 'id_card_back'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Profile updated with OCR data',
            'user'    => $user
        ]);
    }

    public function token(){
        return csrf_token();
    }
}