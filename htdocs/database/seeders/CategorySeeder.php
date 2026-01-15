<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Śniadania', 'slug' => 'sniadania'],
            ['name' => 'Obiady', 'slug' => 'obiady'],
            ['name' => 'Kolacje', 'slug' => 'kolacje'],
            ['name' => 'Desery', 'slug' => 'desery'],
            ['name' => 'Przekąski', 'slug' => 'przekaski'],
            ['name' => 'Zupy', 'slug' => 'zupy'],
            ['name' => 'Sałatki', 'slug' => 'salatki'],
            ['name' => 'Wegetariańskie', 'slug' => 'wegetarianskie'],
            ['name' => 'Wegańskie', 'slug' => 'weganskie'],
            ['name' => 'Napoje', 'slug' => 'napoje'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
