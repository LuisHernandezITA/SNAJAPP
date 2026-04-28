<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Listado de usuarios (Para la tabla principal del Admin)
     */
    public function index()
    {
        return response()->json(User::all(), 200);
    }

    /**
     * Registro de nuevo usuario (Store)
     * Puede ser usado por el registro público o por el Admin
     */
    public function store(Request $request)
    {
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
                'message' => 'Error de validación',
                'errors'  => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'full_name'    => $request->full_name,
            'email'        => $request->email,
            'password'     => Hash::make($request->password),
            'state'        => $request->state,
            'municipality' => $request->municipality,
            'phone_number' => $request->phone_number,
            'role'         => $request->role ?? 0, // Si el admin lo crea, puede asignar rol
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Usuario creado exitosamente',
            'user'    => $user
        ], 201);
    }

    /**
     * Devuelve la información para el Modal de edición (React)
     */
    public function edit($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }
        return response()->json($user, 200);
    }

    /**
     * Actualización desde el panel de Admin
     */
    public function updateAdmin(Request $request, $id)
{
    $user = User::find($id);
    if (!$user) return response()->json(['message' => 'Usuario no encontrado'], 404);

    // Actualizamos TODOS los campos provenientes de la migración
    $user->update($request->only([
        'full_name', 'email', 'phone_number', 'role',
        'dob', 'address', 'state', 'municipality',
        'section', 'voter_key', 'curp', 'ocr_id',
        'id_card_front', 'id_card_back'
    ]));

    return response()->json(['success' => true, 'message' => 'Usuario actualizado', 'user' => $user]);
}

    /**
     * Eliminar usuario
     */
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $user->delete();
        return response()->json(['success' => true, 'message' => 'Usuario eliminado']);
    }

    /**
     * Mostrar perfil y generar token (Hidratación de sesión)
     */
    public function show($id) {
        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'Not found'], 404);

        $token = $user->createToken('Personal Access Token')->accessToken; 
        
        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    /**
     * Update para datos específicos del OCR (Uso del cliente)
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'User not found'], 404);

        $user->update($request->only([
            'dob', 'address', 'section', 'voter_key', 
            'curp', 'ocr_id', 'id_card_front', 'id_card_back'
        ]));

        return response()->json(['success' => true, 'user' => $user]);
    }
}