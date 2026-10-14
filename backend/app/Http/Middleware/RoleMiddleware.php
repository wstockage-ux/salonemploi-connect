<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Vérifie si l'utilisateur connecté possède l'un des rôles autorisés.
     * Exemple d'utilisation dans les routes : ->middleware('role:admin,agent')
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié.',
            ], 401);
        }

        if (!$user->actif) {
            return response()->json([
                'success' => false,
                'message' => 'Ce compte a été désactivé par l administration.',
            ], 403);
        }

        $userRole = $user->role ? $user->role->code : null;

        if (!in_array($userRole, $roles, true)) {
            return response()->json([
                'success' => false,
                'message' => 'Accès refusé : privilèges insuffisants pour cette ressource.',
            ], 403);
        }

        return $next($request);
    }
}
