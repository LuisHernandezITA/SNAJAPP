<?php

namespace App\Http\Controllers;

use App\Models\AccessTokens;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AccessTokensController extends Controller
{
    public function index()
    {
        $accesstoken = DB::table('oauth_access_tokens')->first();
        return $accesstoken;
    }

    public function destroy()
{
 
    \DB::table('oauth_access_tokens')->truncate();

    return "Todos los registros de AccessTokens han sido eliminados";
}
}
