<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BannerController extends Controller
{
    public function index()
    {
        // Usamos DB::table como en tu ejemplo de Category
        return DB::table('banners')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'image_url' => 'required|string',
            'alt_text' => 'required|string',
        ]);

        $banner = Banner::create([
            'image_url' => $request->image_url,
            'alt_text' => $request->alt_text,
            'link_url' => $request->link_url,
            'interval' => $request->interval ?? 2000,
        ]);

        return response()->json($banner, 201);
    }

    public function edit($id)
    {
        $banner = Banner::find($id);
        return $banner ? $banner : response()->json(['message' => 'Banner not found'], 404);
    }

    public function update(Request $request, $id)
    {
        $banner = Banner::find($id);

        if (!$banner) {
            return response()->json(['message' => 'Banner not found'], 404);
        }

        $banner->image_url = $request->input('image_url');
        $banner->alt_text = $request->input('alt_text');
        $banner->link_url = $request->input('link_url');
        $banner->interval = $request->input('interval');

        $banner->save();

        return response()->json(['message' => 'Successfully updated banner'], 200);
    }

    public function destroy($id)
    {
        $banner = Banner::find($id);

        if (!$banner) {
            return response()->json(['message' => 'Banner not found'], 404);
        }

        $banner->delete();

        return response()->json(['message' => 'Successfully deleted banner'], 200);
    }
}