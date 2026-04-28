<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\AccessTokensController;
use App\Http\Controllers\ProductColorsController;
use App\Http\Controllers\ProductSizesController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ColorController;
use App\Http\Controllers\SizeController;
use App\Http\Controllers\ShoppingCartController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\MusicController;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


// --- 1. RUTAS PÚBLICAS (Cualquier visitante las ve) ---
Route::post('register', [RegisterController::class, 'register']);
Route::post('login', [RegisterController::class, 'login']);

Route::get('/products_index', [ProductsController::class, 'index']);
Route::get('/products_newest', [ProductsController::class, 'newest']);
Route::post('/products_show', [ProductsController::class, 'show']);

Route::get('/category_index', [CategoryController::class, 'index']);
Route::get('/color_index', [ColorController::class, 'index']);
Route::get('/size_index', [SizeController::class, 'index']);
Route::get('/banners_index', [BannerController::class, 'index']);
Route::get('/music_index', [MusicController::class, 'index']);

Route::post('/getProductSizes', [ProductSizesController::class, 'getProductSizes']);
Route::post('/getProductColors', [ProductColorsController::class, 'getProductColors']);


// --- 2. RUTAS PARA USUARIOS NORMALES (Clientes logueados) ---
Route::middleware(['auth:api'])->group(function () {
    
    // Perfil de usuario y Tokens de sesión
    Route::get('/user_show/{id}', [UserController::class, 'show']);
    Route::get('/accesstokens_index', [AccessTokensController::class, 'index']);
    Route::delete('/accesstokens/destroy', [AccessTokensController::class, 'destroy']);

    // Carrito de compras
    Route::post('/addcart', [ShoppingCartController::class, 'addToCart']);
    Route::post('/getProductsInCart', [ShoppingCartController::class, 'getProductsInCart']);
    Route::post('/updateQuantity', [ShoppingCartController::class, 'updateQuantity']);
    Route::post('/removeProductFromCart', [ShoppingCartController::class, 'removeProductFromCart']);
});


// --- 3. RUTAS EXCLUSIVAS PARA ADMINISTRADORES ---
// Requieren estar logueados Y ser admin (Middleware isAdmin)
Route::middleware(['auth:api', 'isAdmin'])->group(function () {

    // Gestión de Usuarios
    Route::get('/user_index', [UserController::class, 'index']);

    // CRUD Categorías
    Route::get('categories/{id}/edit', [CategoryController::class, 'edit']);
    Route::post('categories_store', [CategoryController::class, 'store']);
    Route::put('categories_update/{id}', [CategoryController::class, 'update']);
    Route::delete('categories_destroy/{id}', [CategoryController::class, 'destroy']);

    // CRUD Users
    Route::get('/user_edit/{id}', [UserController::class, 'edit']);        // <--- LA QUE TE FALTA (Devuelve datos para el form)
    Route::post('/user_store', [UserController::class, 'store']);          // Crear nuevo (si el admin lo requiere)
    Route::put('/user_update_admin/{id}', [UserController::class, 'updateAdmin']); // La acción de guardar cambios
    Route::delete('/user_destroy/{id}', [UserController::class, 'destroy']);

    // CRUD Banners
    Route::get('banners/{id}/edit', [BannerController::class, 'edit']);
    Route::post('banners_store', [BannerController::class, 'store']);
    Route::put('banners_update/{id}', [BannerController::class, 'update']);
    Route::delete('banners_destroy/{id}', [BannerController::class, 'destroy']);

    // CRUD Music
    Route::post('/music_store', [MusicController::class, 'store']);
    Route::get('/music_edit/{id}', [MusicController::class, 'edit']);
    Route::put('/music_update/{id}', [MusicController::class, 'update']);
    Route::delete('/music_destroy/{id}', [MusicController::class, 'destroy']);

    // CRUD Productos (Completo)
    Route::get('/products/{id}/edit', [ProductsController::class, 'edit']);
    Route::post('/products_store', [ProductsController::class, 'store']); 
    Route::put('/products_update/{id}', [ProductsController::class, 'update']); 
    Route::delete('/products_destroy/{id}', [ProductsController::class, 'destroy']);

    // Gestión de Atributos de Producto (Colores y Tallas)
    Route::post('/productcolors_store', [ProductColorsController::class, 'store']);
    Route::delete('/productcolors_destroy/{id}', [ProductColorsController::class, 'destroy']);
    Route::post('/productsizes_store', [ProductSizesController::class, 'store']);
    Route::delete('/productsizes_destroy/{id}', [ProductSizesController::class, 'destroy']);
});


//Route::middleware('auth:api')->get('/index', 'app\Http\Controllers\UserController@index');

/*Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});Nuevo comentado*/
