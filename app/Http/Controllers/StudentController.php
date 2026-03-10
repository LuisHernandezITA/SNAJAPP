<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $student = Student::create([
            'name' => $request->name,
            'last_name' => $request->last_name,
            'control' => $request->control,
            'email' => $request->email,
            'semester' => $request->semester,
            'program_id' => $request->program_id
        ]);
        $student->save();

        return $request;
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request)
    {
        //$student = Student::find($request->id);
        $student = Student::where('name', $request->name)
        -> Orwhere('last_name', $request->last_name)
        -> get();

        return $student;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request)
    {
        $student = Student::where('name', $request->name)
        -> Orwhere('last_name', $request->last_name)
        -> get();

        return $student;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $student = Student::find($request->id);
        
        $student -> name = $request->name;
        $student -> last_name = $request->last_name;
        $student -> control = $request->control;
        $student -> email = $request->email;
        $student -> semester = $request->semester;
        
        $student->save();

        return $student;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $nombre = $request->input("name");
        $student = Student::where('control', $request->control)
        ->delete();

        return $nombre." ha sido eliminado"; 
        
    }

    public function token(){
        return csrf_token();
    }

}
