# Cooking Book - Instrukcja Projektu

Aplikacja webowa do zarządzania przepisami kulinarnymi z panelem administracyjnym.

## Struktura Projektu

Projekt składa się z dwóch głównych części:

- **`client/`** - Frontend (React + Vite + TypeScript)
- **`htdocs/`** - Backend (Laravel 12 + PHP) -> trzeba wrzucic plik do odpowiednieogo miejsca w folderze XAMPP

## Instrukcje

Szczegółowe instrukcje instalacji i uruchomienia znajdują się w odpowiednich folderach:

- Instrukcje dla frontendu: `client/README.md`
- Instrukcje dla backendu: `htdocs/README.md`

## Technologie

### Frontend
React 19, TypeScript, Vite, React Router 7, TanStack Query, Tailwind CSS 4, Radix UI, Shadcn UI

### Backend
Laravel 12, PHP 8.2+, Laravel Sanctum, MySQL, L5-Swagger

## Funkcjonalności

- Autoryzacja (rejestracja, logowanie, reset hasła)
- Przepisy (CRUD, wyszukiwanie, filtrowanie, sortowanie)
- Komentarze do przepisów
- System polubień
- Kategorie przepisów
- Panel administratora
- Upload i zarządzanie obrazami

## Licencja
MIT
