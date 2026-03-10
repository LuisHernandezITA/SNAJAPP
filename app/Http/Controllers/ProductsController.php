<?php

namespace App\Http\Controllers;

use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProductsController extends Controller
{
    public function index()
    {
        $products = DB::table('products')->get();
        return $products;
    }

    public function newest()
{
    $products = DB::table('products')
    ->orderBy('id', 'desc') // ORDERS DESC
    ->take(6) // ONLY 6 PRODUCTS
    ->get();

    return $products;
}

    public function show(Request $request)
    {
        $product = Products::where('id', $request->id) -> get();

        if ($product) {
            return $product;
        } else {
            return response()->json(['message' => 'Product not found'], 404);
        }
    }

    public function store(Request $request)
    {
        $products = Products::create([
            'name' => $request->name,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'price' => $request->price,
            'available_stock' => $request->available_stock,
            'images' => $request->images,
            'addition_date' => Carbon::now(),
            'available' => $request->available
        ]);
    
        $products->save();

        return $products;
    }

    public function edit(Request $request)
{
    $product = Products::find($request->id);

    if ($product) {
        return $product;
    } else {
        return response()->json(['message' => 'Product not found'], 404);
    }
}

    public function update(Request $request, $id)
    {
        $product = Products::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $product->name = $request->input('name');
        $product->description = $request->input('description');
        $product->category_id = $request->input('category_id');
        $product->price = $request->input('price');
        $product->available_stock = $request->input('available_stock');
        $product->images = $request->input('images');
        $product->addition_date = $request->input('addition_date');
        $product->available = $request->input('available');

        $product->save();

        return response()->json(['message' => 'Succesfully updated product'], 200);
    }

    public function destroy($id)
    {
        $product = Products::find($id);

    if (!$product) {
        return response()->json(['message' => 'Product not found'], 404);
    }

    // DELETES IN SHOPPING CART TOO
    $product->shoppingCart()->delete();

    $product->delete();

    return response()->json(['message' => 'Succesfully deleted product'], 200);
    }
}
