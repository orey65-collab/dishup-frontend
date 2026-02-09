import { Clock, ChevronRight, Flame } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Logo } from '@/components/Logo';

const DIFFICULTY_MAP = {
  facile: { key: 'easy', emoji: '🟢', class: 'badge-easy' },
  media: { key: 'medium', emoji: '🟡', class: 'badge-medium' },
  difficile: { key: 'hard', emoji: '🔴', class: 'badge-hard' },
  easy: { key: 'easy', emoji: '🟢', class: 'badge-easy' },
  medium: { key: 'medium', emoji: '🟡', class: 'badge-medium' },
  hard: { key: 'hard', emoji: '🔴', class: 'badge-hard' },
};

export const RecipeSelectionScreen = ({ recipes, onSelectRecipe, onBack }) => {
  const { t, language } = useLanguage();

  if (!recipes || recipes.length === 0) return null;

  return (
    <div className="flex flex-col min-h-full pb-8">
      {/* Header - Cartoon Style */}
      <div className="px-5 pt-6 pb-4">
        <button
          onClick={onBack}
          className="text-sm font-bold text-muted-foreground hover:text-foreground mb-3 flex items-center gap-1"
        >
          ← {language === 'it' ? 'Torna indietro' : 'Go back'}
        </button>
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-wiggle">🎉</span>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              {language === 'it' ? 'Scegli la tua ricetta!' : 'Choose your recipe!'}
            </h1>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              {language === 'it' 
                ? `${recipes.length} ricette create per te`
                : `${recipes.length} recipes created for you`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Recipe Cards - Cartoon Style */}
      <div className="px-5 space-y-4">
        {recipes.map((recipe, index) => {
          const difficultyInfo = DIFFICULTY_MAP[recipe.difficulty?.toLowerCase()] || DIFFICULTY_MAP.medium;
          
          return (
            <button
              key={index}
              onClick={() => onSelectRecipe(recipe)}
              className="w-full text-left card-cartoon p-4 animate-bounce-in group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex gap-4">
                {/* Recipe Icon - New Logo Style */}
                <div className="flex-shrink-0 group-hover:animate-wiggle">
                  <Logo size={56} />
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <h3 className="font-display font-bold text-foreground text-base leading-tight mb-2 group-hover:text-primary transition-colors">
                    {recipe.title}
                  </h3>
                  
                  {/* Meta badges - with BLACK text for readability */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <div className="inline-flex items-center gap-1 text-xs font-bold bg-tertiary/20 px-2 py-0.5 rounded-full border border-tertiary/50">
                      <Clock className="w-3 h-3 text-foreground" />
                      <span className="text-foreground">{recipe.prep_time} {t('minutes')}</span>
                    </div>
                    <div className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${difficultyInfo.class}`}>
                      <span>{difficultyInfo.emoji}</span>
                      {t(difficultyInfo.key)}
                    </div>
                    {/* Calories Badge */}
                    {recipe.calories && (
                      <div className="inline-flex items-center gap-1 text-xs font-bold bg-destructive/10 px-2 py-0.5 rounded-full border border-destructive/30">
                        <Flame className="w-3 h-3 text-destructive" />
                        <span className="text-foreground">{recipe.calories} {t('calories')}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Description */}
                  <p className="text-xs text-muted-foreground line-clamp-2 font-medium">
                    {recipe.description}
                  </p>
                </div>
                
                {/* Arrow */}
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Help text - Cartoon Style */}
      <div className="px-5 mt-6 text-center">
        <p className="text-sm text-muted-foreground font-medium flex items-center justify-center gap-2">
          <span>👆</span>
          {language === 'it' 
            ? 'Tocca una ricetta per vedere tutti i dettagli'
            : 'Tap a recipe to see all details'
          }
        </p>
      </div>
    </div>
  );
};
