<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AccessTokensController extends Controller
{
    public function index()
    {
        // Esto devuelve el primer token de la tabla de OAuth
        $accesstoken = DB::table('oauth_access_tokens')->first();
        return response()->json($accesstoken);
    }

    public function destroy()
    {
        // Borra todos los tokens (Cierra todas las sesiones del sistema)
        DB::table('oauth_access_tokens')->truncate();
        return response()->json(["message" => "Todos los registros de AccessTokens han sido eliminados"]);
    }
}