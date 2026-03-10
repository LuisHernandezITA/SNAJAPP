<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = new User();
        $user->name = "Admin";
        $user->email = "Admin@gmail.com";
        $user->email_verified_at = now();
        $user->password = "admin1234";
        $user->admin = true;
        $user->remember_token = "AdminProXxXx";
        $user->save();

        $user = new User();
    }
}
