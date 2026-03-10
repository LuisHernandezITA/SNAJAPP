<?php

namespace App\Http\Controllers;

use App\Models\Music;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MusicController extends Controller
{
    /**
     * Obtener todas las canciones (para tu lista en React)
     */
    public function index()
    {
        // Usando DB::table como en tus otros controladores
        return DB::table('music')->get();
    }

    /**
     * Guardar una nueva canción
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre'   => 'required|string',
            'artista'  => 'required|string',
            'urlmusic' => 'required|string',
            'image'    => 'required|string',
        ]);

        $music = Music::create([
            'nombre'   => $request->nombre,
            'artista'  => $request->artista,
            'etiqueta' => $request->etiqueta, // Es nullable en migración
            'urlmusic' => $request->urlmusic,
            'image'    => $request->image,
        ]);

        return response()->json($music, 201);
    }

    /**
     * Obtener una canción específica para editar
     */
    public function edit($id)
    {
        $music = Music::find($id);
        return $music ? $music : response()->json(['message' => 'Song not found'], 404);
    }

    /**
     * Actualizar los datos de la canción
     */
    public function update(Request $request, $id)
    {
        $music = Music::find($id);

        if (!$music) {
            return response()->json(['message' => 'Song not found'], 404);
        }

        $music->nombre   = $request->input('nombre');
        $music->artista  = $request->input('artista');
        $music->etiqueta = $request->input('etiqueta');
        $music->urlmusic = $request->input('urlmusic');
        $music->image    = $request->input('image');

        $music->save();

        return response()->json(['message' => 'Successfully updated music'], 200);
    }

    /**
     * Eliminar una canción
     */
    public function destroy($id)
    {
        $music = Music::find($id);

        if (!$music) {
            return response()->json(['message' => 'Song not found'], 404);
        }

        $music->delete();

        return response()->json(['message' => 'Successfully deleted music'], 200);
    }
}