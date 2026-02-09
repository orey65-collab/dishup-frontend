import { User, Globe, Info, ChevronRight, Moon, Sun, Edit2, Check } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/context/LanguageContext';
import { useState, useEffect } from 'react';

export const ProfileScreen = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('dishup-theme');
    return savedTheme === 'dark';
  });
  
  const [userName, setUserName] = useState(() => {
    const savedName = localStorage.getItem('dishup-username');
    return savedName || '';
  });
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => {
      const newValue = !prev;
      localStorage.setItem('dishup-theme', newValue ? 'dark' : 'light');
      return newValue;
    });
  };

  const handleSaveName = () => {
    const trimmedName = tempName.trim();
    setUserName(trimmedName);
    localStorage.setItem('dishup-username', trimmedName);
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setTempName(userName);
    setIsEditingName(false);
  };

  const displayName = userName || (language === 'it' ? 'Chef Casalingo' : 'Home Chef');
  const displaySubtitle = userName 
    ? (language === 'it' ? 'Utente DishUp' : 'DishUp User')
    : (language === 'it' ? 'Tocca per aggiungere nome' : 'Tap to add name');

  return (
    <div className="flex flex-col min-h-full pb-28">
      {/* Header - Cartoon Style */}
      <div className="px-5 pt-6 pb-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-wiggle">👤</span>
          <h1 className="text-2xl font-display font-bold text-foreground">{t('profile')}</h1>
        </div>
      </div>

      {/* Profile Card - Cartoon Style with Editable Name */}
      <div className="px-5 mb-6">
        {!isEditingName ? (
          <div 
            onClick={() => setIsEditingName(true)}
            className="card-cartoon p-5 flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <div className="w-18 h-18 rounded-2xl bg-primary flex items-center justify-center border-3 border-primary-dark shadow-cartoon-primary">
              <span className="text-4xl">👨‍🍳</span>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-display font-bold text-foreground">
                {displayName}
              </h2>
              <p className="text-sm text-muted-foreground font-medium flex items-center gap-1">
                {displaySubtitle}
                {!userName && <Edit2 className="w-3 h-3" />}
              </p>
            </div>
            {userName && (
              <button className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <Edit2 className="w-4 h-4 text-secondary-foreground" />
              </button>
            )}
          </div>
        ) : (
          <div className="card-cartoon p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-18 h-18 rounded-2xl bg-primary flex items-center justify-center border-3 border-primary-dark shadow-cartoon-primary">
                <span className="text-4xl">👨‍🍳</span>
              </div>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder={language === 'it' ? 'Il tuo nome...' : 'Your name...'}
                className="flex-1 px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground font-display font-bold focus:outline-none focus:border-primary"
                maxLength={30}
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCancelEdit}
                className="flex-1 h-10 rounded-xl bg-secondary font-display font-bold text-secondary-foreground border-2 border-secondary-foreground/20 shadow-cartoon-sm hover:scale-105 transition-transform"
              >
                {language === 'it' ? 'Annulla' : 'Cancel'}
              </button>
              <button
                onClick={handleSaveName}
                className="flex-1 h-10 rounded-xl bg-primary font-display font-bold text-primary-foreground border-2 border-primary-dark shadow-cartoon-sm hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                {language === 'it' ? 'Salva' : 'Save'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Settings - Cartoon Style */}
      <div className="px-5">
        <h2 className="text-sm font-display font-bold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
          <span>⚙️</span>
          {t('settings')}
        </h2>
        
        <div className="card-cartoon divide-y-2 divide-border/50 p-0 overflow-hidden">
          {/* Language */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-tertiary/20 flex items-center justify-center text-2xl border-2 border-tertiary/30">
                🌍
              </div>
              <div>
                <span className="text-sm font-bold text-foreground">{t('language')}</span>
                <p className="text-xs text-muted-foreground font-medium">
                  {language === 'it' ? 'Italiano' : 'English'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 rounded-xl bg-secondary font-display font-bold text-secondary-foreground border-2 border-secondary-foreground/20 shadow-cartoon-sm hover:scale-105 transition-transform"
            >
              {language === 'it' ? '🇬🇧 EN' : '🇮🇹 IT'}
            </button>
          </div>

          {/* Theme */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center text-2xl border-2 border-secondary-foreground/20">
                {isDark ? '🌙' : '☀️'}
              </div>
              <div>
                <span className="text-sm font-bold text-foreground">
                  {language === 'it' ? 'Tema scuro' : 'Dark theme'}
                </span>
                <p className="text-xs text-muted-foreground font-medium">
                  {isDark 
                    ? (language === 'it' ? 'Attivo' : 'Active')
                    : (language === 'it' ? 'Disattivo' : 'Inactive')
                  }
                </p>
              </div>
            </div>
            <Switch checked={isDark} onCheckedChange={toggleTheme} />
          </div>
        </div>

        {/* About - Cartoon Style */}
        <h2 className="text-sm font-display font-bold text-muted-foreground uppercase tracking-wide mb-3 mt-6 flex items-center gap-2">
          <span>ℹ️</span>
          {t('about')}
        </h2>
        
        <div className="card-cartoon">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-2xl border-2 border-accent/30">
                📱
              </div>
              <div>
                <span className="text-sm font-bold text-foreground">
                  {language === 'it' ? 'Versione' : 'Version'}
                </span>
                <p className="text-xs text-muted-foreground font-medium">1.0.0</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* Credits - Cartoon Style */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
            <span className="text-lg">👨‍🍳</span>
            <p className="text-sm text-muted-foreground font-bold">
              {language === 'it' 
                ? 'Creato con ❤️ usando Gemini AI'
                : 'Made with ❤️ using Gemini AI'
              }
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-2 font-medium">
            © 2024 DishUp
          </p>
        </div>
      </div>
    </div>
  );
};
