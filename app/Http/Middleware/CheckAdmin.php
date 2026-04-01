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
    // Cambiamos 'admin' por 'role' para que coincida con tu lógica de 3 roles
    if (auth()->check() && auth()->user()->role == 1) {
        return $next($request);
    }

    return response()->json(['message' => 'No tienes permisos de administrador.'], 403);
}
}
