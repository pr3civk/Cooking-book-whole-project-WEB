<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Like;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $recipes = Recipe::all();

        $comments = [
            'Świetny przepis! Na pewno spróbuję.',
            'Robiłam wczoraj, wyszło pyszne!',
            'Dodałam trochę więcej czosnku i było idealne.',
            'Moja rodzina uwielbia to danie.',
            'Łatwe i szybkie do przygotowania.',
            'Super pomysł na obiad.',
            'Czy można zamienić masło na oliwę?',
            'Dziękuję za przepis!',
            'Robię to regularnie, zawsze wychodzi.',
            'Polecam dodać trochę chili.',
            'Fantastyczny smak!',
            'Idealne na niedzielny obiad.',
            'Moje dzieci to uwielbiają.',
            'Prosty i smaczny przepis.',
            'Właśnie przygotowuję!',
        ];

        // Add comments to recipes
        foreach ($recipes as $recipe) {
            $maxComments = min(5, $users->count());
            $numComments = rand(0, $maxComments);
            $usedUsers = [];

            for ($i = 0; $i < $numComments; $i++) {
                $availableUsers = $users->whereNotIn('id', $usedUsers);
                if ($availableUsers->isEmpty()) {
                    break;
                }
                $user = $availableUsers->random();
                $usedUsers[] = $user->id;

                Comment::create([
                    'user_id' => $user->id,
                    'recipe_id' => $recipe->id,
                    'content' => $comments[array_rand($comments)],
                ]);
            }
        }

        // Add likes to recipes
        foreach ($recipes as $recipe) {
            $numLikes = rand(0, $users->count());
            if ($numLikes > 0) {
                $likedUsers = $users->random($numLikes);
                foreach ($likedUsers as $user) {
                    Like::create([
                        'user_id' => $user->id,
                        'recipe_id' => $recipe->id,
                    ]);
                }
            }
        }
    }
}
