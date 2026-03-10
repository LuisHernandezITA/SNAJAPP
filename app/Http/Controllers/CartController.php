<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function addToCart(Request $request)
    {
        $productId = $request->input('product_id');
        $quantity = $request->input('quantity');

        $cart = Cart::where('user_id', $request->user()->id)->first();
        if (!$cart) {
            $cart = new Cart();
            $cart->user_id = $request->user()->id;
        }

        $cart->products()->attach($productId, ['quantity' => $quantity]);
        $cart->save();

        return response()->json([
            'status' => 'success',
        ]);
    }

    public function removeFromCart(Request $request)
    {
        $productId = $request->input('product_id');

        $cart = Cart::where('user_id', $request->user()->id)->first();
        if ($cart) {
            $cart->products()->detach($productId);
        }

        return response()->json([
            'status' => 'success',
        ]);
    }

    public function updateQuantity(Request $request)
    {
        $productId = $request->input('product_id');
        $quantity = $request->input('quantity');

        $cart = Cart::where('user_id', $request->user()->id)->first();
        if ($cart) {
            $cart->products()->updateExistingPivot($productId, ['quantity' => $quantity]);
        }

        return response()->json([
            'status' => 'success',
        ]);
    }
}
