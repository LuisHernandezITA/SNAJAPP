<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    public function index()
    {
        $category = DB::table('category')->get();
        return $category;
    }

    public function store(Request $request)
    {
        // Validamos que al menos el nombre venga en la petición
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category = Category::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return response()->json($category, 201);
    }

    public function edit($id)
    {
        $category = Category::find($id);

        if ($category) {
            return $category;
        } else {
            return response()->json(['message' => 'Category not found'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $category->name = $request->input('name');
        $category->description = $request->input('description');

        $category->save();

        return response()->json(['message' => 'Successfully updated category'], 200);
    }

    public function destroy($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        // NOTA: Si una categoría tiene productos, esto podría dar error de llave foránea.
        // Laravel lo manejará según cómo hayas configurado tu migración.
        $category->delete();

        return response()->json(['message' => 'Successfully deleted category'], 200);
    }
}
