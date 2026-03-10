<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ShoppingCart; 
use App\Models\Products;
use Exception;

class ShoppingCartController extends Controller
{
    /**
     * Añadir producto al carrito
     * Ahora recibe todo por Request (Body JSON)
     */
    public function addToCart(Request $request)
    {
        try {
            $user_id = $request->input('user_id');
            $product_id = $request->input('product_id');
            $quantity = $request->input('quantity', 1);

            // Verificamos si ya existe para no duplicar filas, solo sumar cantidad
            $item = ShoppingCart::where('user_id', $user_id)
                ->where('product_id', $product_id)
                ->first();

            if ($item) {
                $item->quantity += $quantity;
                $item->save();
            } else {
                $item = ShoppingCart::create([
                    'user_id' => $user_id,
                    'product_id' => $product_id,
                    'quantity' => $quantity,
                ]);
            }

            return response()->json(['status' => 'success', 'item' => $item]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Actualizar cantidad (La que usa tu Cart.jsx)
     */
    public function updateQuantity(Request $request)
    {
        try {
            $user_id = $request->input('user_id');
            $product_id = $request->input('product_id');
            $newQuantity = $request->input('quantity');

            $cartItem = ShoppingCart::where('user_id', $user_id)
                ->where('product_id', $product_id)
                ->first();

            if ($cartItem) {
                if ($newQuantity > 0) {
                    $cartItem->update(['quantity' => $newQuantity]);
                    return response()->json(['message' => 'Cantidad actualizada']);
                } else {
                    $cartItem->delete();
                    return response()->json(['message' => 'Producto eliminado']);
                }
            }

            return response()->json(['error' => 'No encontrado'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Eliminar producto por completo
     */
    public function removeProductFromCart(Request $request) 
    {
        $user_id = $request->input('user_id');
        $product_id = $request->input('product_id');

        ShoppingCart::where('user_id', $user_id)
            ->where('product_id', $product_id)
            ->delete();

        return response()->json(['message' => 'Producto eliminado del carrito']);
    }

    /**
     * Obtener productos (Corregido para leer la columna quantity)
     */
    public function getProductsInCart(Request $request)
    {
        $user_id = $request->input('user_id'); 

        $cartItems = ShoppingCart::where('user_id', $user_id)->get();

        if ($cartItems->isNotEmpty()) {
            $productIds = $cartItems->pluck('product_id');
            $products = Products::whereIn('id', $productIds)->get();

            $products = $products->map(function ($product) use ($cartItems) {
                // Buscamos la cantidad real guardada en la columna 'quantity'
                $pivot = $cartItems->where('product_id', $product->id)->first();
                $product->quantity = $pivot ? $pivot->quantity : 0;
                return $product;
            });

            return response()->json($products, 200);
        }

        return response()->json([], 200); 
    }
}