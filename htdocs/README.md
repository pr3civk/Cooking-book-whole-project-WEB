# Cooking Book API

API REST dla aplikacji książki kucharskiej.

## Wymagania

- PHP 8.2+
- Composer
- MySQL
- Node.js (opcjonalnie)

Trzeba plik htdocs wrzucić do folderu www wxampp

## Instalacja

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan l5-swagger:generate
```

## Uruchomienie

```bash
php artisan serve
```

Dokumentacja API: `http://localhost:8000/api/documentation`

## Funkcjonalności

- Autoryzacja (rejestracja, logowanie, reset hasła)
- Przepisy (CRUD, wyszukiwanie, filtrowanie, sortowanie)
- Komentarze
- Polubienia
- Kategorie
- Panel administratora
- Weryfikacja email
- Upload obrazów

## Stack

- Laravel 12
- Laravel Sanctum
- MySQL
- Swagger/OpenAPI (l5-swagger)

## Testy

```bash
php artisan test
```

## Licencja

MIT
