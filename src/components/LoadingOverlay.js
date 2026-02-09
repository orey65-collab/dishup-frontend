import { useLanguage } from '@/context/LanguageContext';

export const LoadingOverlay = () => {
  const { language } = useLanguage();
  
  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 p-8">
        {/* Cooking Animation */}
        <div className="relative">
          {/* Pan */}
          <div className="w-32 h-32 rounded-full bg-secondary border-4 border-border flex items-center justify-center shadow-cartoon-lg">
            <span className="text-6xl animate-cooking">🍳</span>
          </div>
          
          {/* Steam particles */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-2">
            <span className="text-2xl animate-float opacity-60" style={{ animationDelay: '0s' }}>💨</span>
            <span className="text-2xl animate-float opacity-60" style={{ animationDelay: '0.3s' }}>💨</span>
            <span className="text-2xl animate-float opacity-60" style={{ animationDelay: '0.6s' }}>💨</span>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-xl font-display font-bold text-foreground">
            {language === 'it' ? 'Sto cucinando...' : 'Cooking...'}
          </p>
          <p className="text-sm text-muted-foreground mt-2 font-medium">
            {language === 'it' 
              ? 'Lo chef sta preparando le tue ricette!'
              : 'The chef is preparing your recipes!'
            }
          </p>
        </div>
        
        {/* Animated food emojis */}
        <div className="flex gap-3">
          <span className="text-3xl animate-bounce" style={{ animationDelay: '0ms' }}>🥕</span>
          <span className="text-3xl animate-bounce" style={{ animationDelay: '150ms' }}>🍅</span>
          <span className="text-3xl animate-bounce" style={{ animationDelay: '300ms' }}>🧅</span>
          <span className="text-3xl animate-bounce" style={{ animationDelay: '450ms' }}>🥬</span>
        </div>
      </div>
    </div>
  );
};
