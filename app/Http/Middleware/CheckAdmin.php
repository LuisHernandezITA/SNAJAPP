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
    // Verificamos si el usuario autenticado tiene el campo admin en 1 (o true)
    if (auth()->user() && auth()->user()->admin == 1) {
        return $next($request);
    }

    return response()->json(['message' => 'No tienes permisos de administrador.'], 403);
}
}
