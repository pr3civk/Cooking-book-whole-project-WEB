<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Database\Seeder;

class RecipeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $categories = Category::all();

        $recipes = [
            [
                'title' => 'Jajecznica na maśle',
                'description' => 'Klasyczna jajecznica na maśle, idealna na śniadanie.',
                'ingredients' => ['3 jajka', '1 łyżka masła', 'sól', 'pieprz', 'szczypiorek'],
                'instructions' => "1. Rozbij jajka do miski i lekko roztrzep.\n2. Rozpuść masło na patelni.\n3. Wlej jajka i mieszaj na małym ogniu.\n4. Dopraw solą i pieprzem.\n5. Posyp szczypiorkiem.",
                'cooking_time' => 10,
                'servings' => 2,
                'difficulty' => 'easy',
                'category' => 'Śniadania',
            ],
            [
                'title' => 'Spaghetti Bolognese',
                'description' => 'Tradycyjny włoski makaron z sosem mięsnym.',
                'ingredients' => ['500g mielonej wołowiny', '400g makaronu spaghetti', '400g pomidorów z puszki', '1 cebula', '2 ząbki czosnku', 'oliwa', 'bazylia', 'sól', 'pieprz'],
                'instructions' => "1. Podsmaż cebulę i czosnek na oliwie.\n2. Dodaj mięso i smaż do zrumienienia.\n3. Wlej pomidory i gotuj 30 minut.\n4. Ugotuj makaron al dente.\n5. Podawaj makaron polany sosem.",
                'cooking_time' => 45,
                'servings' => 4,
                'difficulty' => 'medium',
                'category' => 'Obiady',
            ],
            [
                'title' => 'Sernik na zimno',
                'description' => 'Kremowy sernik bez pieczenia, idealny na lato.',
                'ingredients' => ['500g serka mascarpone', '200g herbatników', '100g masła', '200ml śmietanki 30%', '100g cukru pudru', '1 cytryna', 'żelatyna'],
                'instructions' => "1. Pokrusz herbatniki i wymieszaj z rozpuszczonym masłem.\n2. Wyłóż spód tortownicy.\n3. Ubij śmietankę z cukrem.\n4. Dodaj mascarpone i sok z cytryny.\n5. Dodaj rozpuszczoną żelatynę.\n6. Wylej na spód i schłódź 4 godziny.",
                'cooking_time' => 30,
                'servings' => 8,
                'difficulty' => 'medium',
                'category' => 'Desery',
            ],
            [
                'title' => 'Zupa pomidorowa',
                'description' => 'Domowa zupa pomidorowa z makaronem.',
                'ingredients' => ['1kg pomidorów', '1 litr bulionu', '1 cebula', '2 ząbki czosnku', 'bazylia', 'śmietana', 'makaron', 'sól', 'pieprz', 'cukier'],
                'instructions' => "1. Sparzyć pomidory i obrać ze skórki.\n2. Podsmaż cebulę i czosnek.\n3. Dodaj pomidory i gotuj 15 minut.\n4. Zmiksuj i dodaj bulion.\n5. Dopraw i podawaj z makaronem.",
                'cooking_time' => 40,
                'servings' => 6,
                'difficulty' => 'easy',
                'category' => 'Zupy',
            ],
            [
                'title' => 'Sałatka grecka',
                'description' => 'Świeża sałatka z fetą i oliwkami.',
                'ingredients' => ['2 ogórki', '4 pomidory', '1 cebula czerwona', '200g fety', '100g oliwek', 'oliwa', 'oregano', 'sól', 'pieprz'],
                'instructions' => "1. Pokrój ogórki, pomidory i cebulę.\n2. Dodaj oliwki i pokrojoną fetę.\n3. Polej oliwą.\n4. Posyp oregano.\n5. Dopraw solą i pieprzem.",
                'cooking_time' => 15,
                'servings' => 4,
                'difficulty' => 'easy',
                'category' => 'Sałatki',
            ],
            [
                'title' => 'Curry z warzywami',
                'description' => 'Aromatyczne wegańskie curry z mlekiem kokosowym.',
                'ingredients' => ['400ml mleka kokosowego', '2 łyżki pasty curry', '1 bakłażan', '1 papryka', '200g ciecierzycy', 'szpinak', 'ryż'],
                'instructions' => "1. Podsmaż pastę curry.\n2. Dodaj warzywa i smaż 5 minut.\n3. Wlej mleko kokosowe.\n4. Dodaj ciecierzycę i gotuj 15 minut.\n5. Dodaj szpinak i podawaj z ryżem.",
                'cooking_time' => 35,
                'servings' => 4,
                'difficulty' => 'medium',
                'category' => 'Wegańskie',
            ],
            [
                'title' => 'Naleśniki z dżemem',
                'description' => 'Puszyste naleśniki z ulubioną konfuturą.',
                'ingredients' => ['250g mąki', '2 jajka', '500ml mleka', 'szczypta soli', 'masło', 'dżem'],
                'instructions' => "1. Wymieszaj mąkę z jajkami.\n2. Stopniowo dodawaj mleko.\n3. Dodaj sól i odstaw na 30 minut.\n4. Smaż cienkie placki na maśle.\n5. Podawaj z dżemem.",
                'cooking_time' => 45,
                'servings' => 6,
                'difficulty' => 'easy',
                'category' => 'Śniadania',
            ],
            [
                'title' => 'Risotto z grzybami',
                'description' => 'Kremowe risotto z borowikami i parmezanem.',
                'ingredients' => ['300g ryżu arborio', '200g grzybów', '1 litr bulionu', '1 cebula', '100ml białego wina', '50g parmezanu', 'masło'],
                'instructions' => "1. Podsmaż cebulę i grzyby.\n2. Dodaj ryż i smaż 2 minuty.\n3. Wlej wino i odparuj.\n4. Stopniowo dodawaj bulion.\n5. Na koniec dodaj masło i parmezan.",
                'cooking_time' => 40,
                'servings' => 4,
                'difficulty' => 'hard',
                'category' => 'Obiady',
            ],
            [
                'title' => 'Smoothie owocowe',
                'description' => 'Orzeźwiający koktajl z mieszanką owoców.',
                'ingredients' => ['1 banan', '100g truskawek', '100g borówek', '200ml jogurtu', '100ml soku pomarańczowego', 'miód'],
                'instructions' => "1. Umyj owoce.\n2. Wrzuć wszystko do blendera.\n3. Miksuj przez 2 minuty.\n4. Dopraw miodem do smaku.\n5. Podawaj schłodzone.",
                'cooking_time' => 5,
                'servings' => 2,
                'difficulty' => 'easy',
                'category' => 'Napoje',
            ],
            [
                'title' => 'Pierogi ruskie',
                'description' => 'Tradycyjne pierogi z nadzieniem z ziemniaków i twarogu.',
                'ingredients' => ['500g mąki', '1 jajko', '250ml wody', '500g ziemniaków', '250g twarogu', '2 cebule', 'sól', 'pieprz'],
                'instructions' => "1. Przygotuj ciasto z mąki, jajka i wody.\n2. Ugotuj ziemniaki i rozgnieć.\n3. Wymieszaj z twarogiem i podsmażoną cebulą.\n4. Rozwałkuj ciasto i wycinaj kółka.\n5. Nakładaj farsz i zlepiaj.\n6. Gotuj w osolonej wodzie.",
                'cooking_time' => 90,
                'servings' => 6,
                'difficulty' => 'hard',
                'category' => 'Obiady',
            ],
            [
                'title' => 'Bruschetta z pomidorami',
                'description' => 'Włoska przekąska z chrupiącym chlebem i świeżymi pomidorami.',
                'ingredients' => ['1 bagietka', '4 pomidory', '2 ząbki czosnku', 'bazylia', 'oliwa', 'sól'],
                'instructions' => "1. Pokrój bagietkę w plastry.\n2. Opiecz na grillu lub patelni.\n3. Natrzyj czosnkiem.\n4. Pokrój pomidory w kostkę.\n5. Wyłóż na grzanki i polej oliwą.",
                'cooking_time' => 15,
                'servings' => 4,
                'difficulty' => 'easy',
                'category' => 'Przekąski',
            ],
            [
                'title' => 'Lasagne',
                'description' => 'Klasyczna włoska zapiekanka z mięsem i beszamelem.',
                'ingredients' => ['płaty lasagne', '500g mięsa mielonego', 'sos pomidorowy', 'beszamel', 'mozzarella', 'parmezan', 'cebula', 'czosnek'],
                'instructions' => "1. Przygotuj sos mięsny.\n2. Przygotuj beszamel.\n3. Układaj warstwami: płaty, mięso, beszamel.\n4. Posyp serem.\n5. Piecz 40 minut w 180°C.",
                'cooking_time' => 90,
                'servings' => 8,
                'difficulty' => 'hard',
                'category' => 'Obiady',
            ],
            [
                'title' => 'Hummus',
                'description' => 'Kremowa pasta z ciecierzycy z tahini.',
                'ingredients' => ['400g ciecierzycy', '3 łyżki tahini', '2 ząbki czosnku', 'sok z cytryny', 'oliwa', 'kumin', 'sól'],
                'instructions' => "1. Odcedź ciecierzycę.\n2. Zmiksuj z tahini i czosnkiem.\n3. Dodaj sok z cytryny.\n4. Dopraw kuminem i solą.\n5. Polej oliwą przed podaniem.",
                'cooking_time' => 10,
                'servings' => 6,
                'difficulty' => 'easy',
                'category' => 'Przekąski',
            ],
            [
                'title' => 'Kotlety schabowe',
                'description' => 'Klasyczne polskie kotlety w panierce.',
                'ingredients' => ['4 kotlety schabowe', 'mąka', '2 jajka', 'bułka tarta', 'sól', 'pieprz', 'olej do smażenia'],
                'instructions' => "1. Rozbij kotlety i dopraw.\n2. Obtocz w mące.\n3. Zamocz w rozmąconym jajku.\n4. Obtocz w bułce tartej.\n5. Smaż na złoty kolor.",
                'cooking_time' => 30,
                'servings' => 4,
                'difficulty' => 'easy',
                'category' => 'Obiady',
            ],
            [
                'title' => 'Tiramisu',
                'description' => 'Włoski deser kawowy z mascarpone.',
                'ingredients' => ['500g mascarpone', '4 jajka', '100g cukru', 'biszkopty', 'espresso', 'kakao', 'likier kawowy'],
                'instructions' => "1. Utrzeć żółtka z cukrem.\n2. Dodaj mascarpone.\n3. Ubij białka i delikatnie wmieszaj.\n4. Maczaj biszkopty w kawie.\n5. Układaj warstwami.\n6. Schłódź 4 godziny i posyp kakao.",
                'cooking_time' => 30,
                'servings' => 8,
                'difficulty' => 'medium',
                'category' => 'Desery',
            ],
            [
                'title' => 'Gazpacho',
                'description' => 'Hiszpańska zimna zupa pomidorowa.',
                'ingredients' => ['1kg pomidorów', '1 ogórek', '1 papryka', '2 ząbki czosnku', 'oliwa', 'ocet winny', 'sól', 'pieprz'],
                'instructions' => "1. Zblenduj wszystkie warzywa.\n2. Dodaj oliwę i ocet.\n3. Dopraw solą i pieprzem.\n4. Schłódź przez 2 godziny.\n5. Podawaj z grzankami.",
                'cooking_time' => 15,
                'servings' => 6,
                'difficulty' => 'easy',
                'category' => 'Zupy',
            ],
            [
                'title' => 'Quiche Lorraine',
                'description' => 'Francuska tarta z boczkiem i serem.',
                'ingredients' => ['ciasto kruche', '200g boczku', '200ml śmietanki', '3 jajka', '150g sera gruyere', 'gałka muszkatołowa', 'sól', 'pieprz'],
                'instructions' => "1. Wyłóż formę ciastem.\n2. Podsmaż boczek.\n3. Wymieszaj jajka ze śmietanką.\n4. Rozłóż boczek i ser na cieście.\n5. Zalej masą jajeczną.\n6. Piecz 35 minut w 180°C.",
                'cooking_time' => 60,
                'servings' => 8,
                'difficulty' => 'medium',
                'category' => 'Obiady',
            ],
            [
                'title' => 'Owsianka z owocami',
                'description' => 'Zdrowe śniadanie z płatkami owsianymi.',
                'ingredients' => ['100g płatków owsianych', '300ml mleka', 'banan', 'jagody', 'miód', 'cynamon', 'orzechy'],
                'instructions' => "1. Gotuj płatki w mleku 5 minut.\n2. Dodaj cynamon.\n3. Przełóż do miski.\n4. Dodaj pokrojone owoce.\n5. Polej miodem i posyp orzechami.",
                'cooking_time' => 10,
                'servings' => 1,
                'difficulty' => 'easy',
                'category' => 'Śniadania',
            ],
            [
                'title' => 'Makaron carbonara',
                'description' => 'Klasyczny włoski makaron z boczkiem i jajkiem.',
                'ingredients' => ['400g spaghetti', '200g guanciale', '4 żółtka', '100g pecorino', 'czarny pieprz'],
                'instructions' => "1. Ugotuj makaron al dente.\n2. Podsmaż boczek.\n3. Wymieszaj żółtka z serem.\n4. Połącz gorący makaron z boczkiem.\n5. Zdejmij z ognia i dodaj masę jajeczną.\n6. Wymieszaj szybko.",
                'cooking_time' => 25,
                'servings' => 4,
                'difficulty' => 'medium',
                'category' => 'Obiady',
            ],
            [
                'title' => 'Lemoniada domowa',
                'description' => 'Orzeźwiający napój z cytryn.',
                'ingredients' => ['4 cytryny', '150g cukru', '1 litr wody', 'mięta', 'kostki lodu'],
                'instructions' => "1. Wyciśnij sok z cytryn.\n2. Rozpuść cukier w ciepłej wodzie.\n3. Połącz z sokiem.\n4. Dodaj zimną wodę i lód.\n5. Udekoruj miętą.",
                'cooking_time' => 15,
                'servings' => 6,
                'difficulty' => 'easy',
                'category' => 'Napoje',
            ],
        ];

        foreach ($recipes as $recipeData) {
            $user = $users->random();
            $category = $categories->where('name', $recipeData['category'])->first();

            Recipe::create([
                'user_id' => $user->id,
                'category_id' => $category?->id,
                'title' => $recipeData['title'],
                'description' => $recipeData['description'],
                'ingredients' => $recipeData['ingredients'],
                'instructions' => $recipeData['instructions'],
                'cooking_time' => $recipeData['cooking_time'],
                'servings' => $recipeData['servings'],
                'difficulty' => $recipeData['difficulty'],
                'views_count' => rand(0, 500),
            ]);
        }
    }
}
