import { Trash2, Clock, Flame } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useFavorites } from '@/context/FavoritesContext';
import { Logo } from '@/components/Logo';

const DIFFICULTY_MAP = {
  facile: { key: 'easy', emoji: '🟢', class: 'badge-easy' },
  media: { key: 'medium', emoji: '🟡', class: 'badge-medium' },
  difficile: { key: 'hard', emoji: '🔴', class: 'badge-hard' },
  easy: { key: 'easy', emoji: '🟢', class: 'badge-easy' },
  medium: { key: 'medium', emoji: '🟡', class: 'badge-medium' },
  hard: { key: 'hard', emoji: '🔴', class: 'badge-hard' },
};

export const FavoritesScreen = ({ onSelectRecipe }) => {
  const { t, language } = useLanguage();
  const { favorites, removeFavorite } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-5">
        <div className="text-7xl mb-4 animate-float">💔</div>
        <h2 className="text-xl font-display font-bold text-foreground mb-2">{t('no_favorites')}</h2>
        <p className="text-sm text-muted-foreground text-center font-medium">{t('no_favorites_desc')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full pb-28">
      {/* Header - Cartoon Style */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-wiggle">❤️</span>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">{t('favorites')}</h1>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              {favorites.length} {favorites.length === 1 
                ? (language === 'it' ? 'ricetta salvata' : 'saved recipe')
                : (language === 'it' ? 'ricette salvate' : 'saved recipes')
              }
            </p>
          </div>
        </div>
      </div>

      {/* Favorites List - Cartoon Style */}
      <div className="px-5 space-y-3">
        {favorites.map((recipe, index) => {
          const difficultyInfo = DIFFICULTY_MAP[recipe.difficulty?.toLowerCase()] || DIFFICULTY_MAP.medium;
          
          return (
            <div
              key={recipe.id}
              className="card-cartoon p-4 animate-bounce-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-3">
                <Logo size={48} className="flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => onSelectRecipe(recipe)}
                    className="text-left w-full"
                  >
                    <h3 className="font-display font-bold text-foreground truncate">{recipe.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1 font-medium">
                      {recipe.description}
                    </p>
                  </button>
                  
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <div className="inline-flex items-center gap-1 text-xs font-bold bg-tertiary/20 px-2 py-0.5 rounded-full border border-tertiary/50">
                      <Clock className="w-3 h-3 text-foreground" />
                      <span className="text-foreground">{recipe.prep_time} {t('minutes')}</span>
                    </div>
                    <div className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${difficultyInfo.class}`}>
                      <span>{difficultyInfo.emoji}</span>
                      {t(difficultyInfo.key)}
                    </div>
                    {recipe.calories && (
                      <div className="inline-flex items-center gap-1 text-xs font-bold bg-destructive/10 px-2 py-0.5 rounded-full border border-destructive/30">
                        <Flame className="w-3 h-3 text-destructive" />
                        <span className="text-foreground">{recipe.calories} {t('calories')}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => removeFavorite(recipe.id)}
                  className="w-10 h-10 rounded-xl bg-destructive/10 border-2 border-destructive/30 flex items-center justify-center text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
