import { useState } from 'react';
import { ArrowLeft, Clock, Users, Heart, ChevronRight, ChevronLeft, Check, Flame, Wine, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { useLanguage } from '@/context/LanguageContext';
import { useFavorites } from '@/context/FavoritesContext';
import { usePantry } from '@/context/PantryContext';
import { toast } from 'sonner';

const DIFFICULTY_MAP = {
  facile: { key: 'easy', emoji: '🟢', class: 'badge-easy' },
  media: { key: 'medium', emoji: '🟡', class: 'badge-medium' },
  difficile: { key: 'hard', emoji: '🔴', class: 'badge-hard' },
  easy: { key: 'easy', emoji: '🟢', class: 'badge-easy' },
  medium: { key: 'medium', emoji: '🟡', class: 'badge-medium' },
  hard: { key: 'hard', emoji: '🔴', class: 'badge-hard' },
};

export const RecipeScreen = ({ recipe, onBack }) => {
  const { t, language } = useLanguage();
  const { addFavorite, isFavorite } = useFavorites();
  const { clearPantry } = usePantry();
  const [currentStep, setCurrentStep] = useState(0);
  const [showSteps, setShowSteps] = useState(false);
  const [showBonAppetit, setShowBonAppetit] = useState(false);
  const [isSaved, setIsSaved] = useState(isFavorite(recipe?.title));

  if (!recipe) return null;

  const difficultyInfo = DIFFICULTY_MAP[recipe.difficulty?.toLowerCase()] || DIFFICULTY_MAP.medium;

  const handleSave = () => {
    if (!isSaved) {
      addFavorite(recipe);
      setIsSaved(true);
      toast.success(t('saved') + ' ❤️');
    }
  };

  const nextStep = () => {
    if (currentStep < (recipe.steps?.length || 0) - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    setShowBonAppetit(true);
    clearPantry();
    toast.success(language === 'it' ? 'Dispensa svuotata! 🧹' : 'Pantry cleared! 🧹');
  };

  // --- VISTA FINALE: BUON APPETITO ---
  if (showBonAppetit) {
    return (
      <div className="flex flex-col min-h-full pb-28 animate-in fade-in duration-500">
        <div className="sticky top-0 z-20 bg-background border-b-4 border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-xl bg-card border-2 border-border shadow-cartoon-sm flex items-center justify-center hover:scale-110 transition-transform"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Logo size={32} />
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-xl bg-secondary font-display font-bold text-secondary-foreground border-2 border-secondary-foreground/20 shadow-cartoon-sm hover:scale-105 transition-transform"
            >
              🏠 {language === 'it' ? 'Home' : 'Home'}
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-5 py-8">
          <div className="relative overflow-hidden card-cartoon bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/30 dark:via-orange-900/20 dark:to-yellow-900/30 border-amber-300 dark:border-amber-700 text-center py-12 px-6 w-full max-w-md">
            <div className="relative z-10">
              <span className="text-7xl mb-6 block animate-wiggle">🍽️</span>
              <h2 className="text-3xl font-display font-bold text-amber-800 dark:text-amber-300 mb-4">
                {t('bon_appetit')}
              </h2>
              <p className="text-lg text-amber-700 dark:text-amber-400 font-medium italic leading-relaxed mb-8">
                "{recipe.bon_appetit || (language === 'it' ? 'Buon appetito e buona fortuna!' : 'Enjoy your meal!')}"
              </p>
              
              {recipe.wine_pairing && (
                <div className="bg-white/50 dark:bg-black/20 rounded-2xl p-4 mt-4 border-2 border-amber-200 dark:border-amber-700 animate-bounce-in">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl">🍷</span>
                    <h3 className="text-base font-display font-bold text-amber-800 dark:text-amber-300">
                      {t('sommelier_tip')}
                    </h3>
                  </div>
                  <p className="text-lg font-bold text-amber-900 dark:text-amber-200 mb-1">
                    {recipe.wine_pairing.wine || recipe.wine_pairing}
                  </p>
                </div>
              )}

              <button onClick={onBack} className="mt-8 btn-cartoon-primary px-8 py-3 w-full">
                {language === 'it' ? 'Torna alla Home' : 'Back to Home'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VISTA PRINCIPALE: DETTAGLI RICETTA ---
  return (
    <div className="flex flex-col min-h-full pb-28">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background border-b-4 border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-card border-2 border-border shadow-cartoon-sm flex items-center justify-center hover:scale-110 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleSave}
            className={`w-10 h-10 rounded-xl border-2 shadow-cartoon-sm flex items-center justify-center hover:scale-110 transition-transform ${
              isSaved ? 'bg-destructive/20 border-destructive text-destructive' : 'bg-card border-border'
            }`}
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      <div className="px-5 pt-4 pb-6">
        {/* Title Section */}
        <div className="flex items-start gap-4 mb-4">
          <Logo size={56} className="flex-shrink-0 animate-wiggle" />
          <div className="flex-1">
            <h1 className="text-2xl font-display font-bold text-foreground leading-tight">{recipe.title}</h1>
          </div>
        </div>

        {/* Info Badges */}
        <div className="flex flex-wrap gap-2 mb-5">
          <div className="badge-cartoon bg-tertiary/20 border-tertiary/50">
            <Clock className="w-3.5 h-3.5 text-foreground" />
            <span className="font-bold text-foreground">{recipe.prep_time} {t('minutes')}</span>
          </div>
          <div className={`badge-cartoon ${difficultyInfo.class}`}>
            <span>{difficultyInfo.emoji}</span>
            <span className="font-bold">{t(difficultyInfo.key)}</span>
          </div>
          <div className="badge-cartoon bg-secondary/50 border-secondary-foreground/30">
            <Users className="w-3.5 h-3.5 text-foreground" />
            <span className="font-bold text-foreground">{recipe.servings || 2} {t('servings')}</span>
          </div>
          {recipe.calories && (
            <div className="badge-cartoon bg-destructive/10 border-destructive/50">
              <Flame className="w-3.5 h-3.5 text-destructive" />
              <span className="font-bold text-foreground">{recipe.calories} {t('calories')}</span>
            </div>
          )}
        </div>

        {/* --- SEZIONE MACRONUTRIENTI (GYMRAT POWER) --- */}
        {recipe.macros && (
          <div className="mb-6 animate-bounce-in">
            <div className="flex items-center gap-2 mb-2 ml-1">
              <Dumbbell className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-display font-extrabold uppercase tracking-widest text-orange-600">Nutritional Stats</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="card-cartoon p-2 bg-orange-50 border-orange-200 text-center flex flex-col items-center">
                <span className="block text-lg font-black text-orange-600 leading-none">{recipe.macros.protein}g</span>
                <span className="text-[10px] font-bold uppercase text-orange-400">Proteine</span>
              </div>
              <div className="card-cartoon p-2 bg-blue-50 border-blue-200 text-center flex flex-col items-center">
                <span className="block text-lg font-black text-blue-600 leading-none">{recipe.macros.carbs}g</span>
                <span className="text-[10px] font-bold uppercase text-blue-400">Carbi</span>
              </div>
              <div className="card-cartoon p-2 bg-green-50 border-green-200 text-center flex flex-col items-center">
                <span className="block text-lg font-black text-green-600 leading-none">{recipe.macros.fat}g</span>
                <span className="text-[10px] font-bold uppercase text-green-400">Grassi</span>
              </div>
            </div>
          </div>
        )}

        {/* Special Reason */}
        <div className="card-cartoon bg-secondary/20 border-secondary-foreground/20">
          <h3 className="text-sm font-display font-bold text-primary mb-2 flex items-center gap-2">
            <span>✨</span>
            {t('why_special')}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            {recipe.special_reason || recipe.description}
          </p>
        </div>
      </div>

      {/* Ingredients List */}
      <div className="px-5 pb-6">
        <h2 className="text-lg font-display font-bold text-foreground mb-3 flex items-center gap-2">
          <span>🥗</span>
          {t('ingredients')}
        </h2>
        <div className="card-cartoon divide-y-2 divide-border/50 p-0 overflow-hidden">
          {recipe.ingredients?.map((ing, index) => (
            <div key={index} className="flex items-center justify-between px-4 py-3 bg-white dark:bg-card/50">
              <span className="text-sm font-semibold text-foreground capitalize flex items-center gap-2">
                <Check className="w-4 h-4 text-tertiary" />
                {ing.name || ing}
              </span>
              <span className="text-sm font-bold text-primary">{ing.quantity || ''}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions / Steps */}
      {!showSteps ? (
        <div className="px-5 pb-6">
          <button
            onClick={() => setShowSteps(true)}
            className="w-full h-14 btn-cartoon-accent flex items-center justify-center gap-2 shadow-cartoon"
          >
            <span>📝</span>
            {t('instructions')}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="px-5 pb-8 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
              <span>📝</span>
              {t('instructions')}
            </h2>
            <span className="text-sm font-bold text-muted-foreground bg-secondary px-3 py-1 rounded-full border-2 border-border">
              {currentStep + 1} / {recipe.steps?.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-4 bg-secondary rounded-full mb-6 overflow-hidden border-2 border-border shadow-inner">
            <div
              className="h-full bg-tertiary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / (recipe.steps?.length || 1)) * 100}%` }}
            />
          </div>

          {/* Step Card */}
          <div key={currentStep} className="step-card-cartoon mb-6 min-h-[160px] flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-tertiary flex items-center justify-center border-3 border-foreground shadow-cartoon-sm">
                <span className="text-xl font-display font-black text-foreground">{currentStep + 1}</span>
              </div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t('step')}</span>
            </div>
            <p className="text-lg text-foreground leading-relaxed font-bold">
              {recipe.steps?.[currentStep]}
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-4">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex-1 h-14 btn-cartoon-secondary flex items-center justify-center gap-2 disabled:opacity-30 disabled:grayscale transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
              {t('previous')}
            </button>
            
            {currentStep === (recipe.steps?.length || 0) - 1 ? (
              <button onClick={handleFinish} className="flex-1 h-14 btn-cartoon-primary flex items-center justify-center gap-2">
                <Check className="w-6 h-6" />
                {t('finish')}
              </button>
            ) : (
              <button onClick={nextStep} className="flex-1 h-14 btn-cartoon-accent flex items-center justify-center gap-2">
                {t('next')}
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
