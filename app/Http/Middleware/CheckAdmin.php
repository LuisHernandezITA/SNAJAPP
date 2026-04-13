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
    public function handle(Request $request, Closure $next)
{
    // Verificamos si el usuario está autenticado por API
    if (auth()->guard('api')->check()) {
        $user = auth()->guard('api')->user();
        
        // Solo el role 1 (Admin) puede pasar a estas rutas
        if ($user->role == 1) {
            return $next($request);
        }
    }

    return response()->json(['message' => 'Acceso denegado: Se requieren permisos de administrador.'], 403);
}
}
