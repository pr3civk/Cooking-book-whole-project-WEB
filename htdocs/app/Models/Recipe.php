<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'description',
        'ingredients',
        'instructions',
        'image',
        'cooking_time',
        'servings',
        'difficulty',
        'views_count',
    ];

    protected function casts(): array
    {
        return [
            'ingredients' => 'array',
            'cooking_time' => 'integer',
            'servings' => 'integer',
            'views_count' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }


    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }

    public function scopeWithCategory(Builder $query, ?int $categoryId): Builder
    {
        if ($categoryId) {
            return $query->where('category_id', $categoryId);
        }
        return $query;
    }

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if ($search) {
            return $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }
        return $query;
    }

    public function scopeFilterByDifficulty(Builder $query, ?string $difficulty): Builder
    {
        if ($difficulty && in_array($difficulty, ['easy', 'medium', 'hard'])) {
            return $query->where('difficulty', $difficulty);
        }
        return $query;
    }

    public function isLikedBy(?User $user): bool
    {
        if (!$user) {
            return false;
        }
        return $this->likes()->where('user_id', $user->id)->exists();
    }

    public function getLikesCountAttribute(): int
    {
        return $this->likes()->count();
    }

    public function getCommentsCountAttribute(): int
    {
        return $this->comments()->count();
    }
}
