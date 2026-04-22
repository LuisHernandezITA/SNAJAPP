<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next)
{
    // Forzamos el guard de API para que use el Token que envía React
    $user = auth()->guard('api')->user();

    // Verificamos: ¿Existe? y ¿Su rol es 1? (usamos int para evitar fallos de tipo)
    if ($user && (int)$user->role === 1) {
        return $next($request);
    }

    return response()->json([
        'message' => 'Acceso denegado. Se requiere rol de administrador.',
        'debug' => [
            'identificado' => (bool)$user,
            'rol_encontrado' => $user ? $user->role : 'nulo'
        ]
    ], 403);
}
}
