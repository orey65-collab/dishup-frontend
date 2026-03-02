import { Camera, Search, Plus, X, Dumbbell } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/LanguageContext';
import { usePantry } from '@/context/PantryContext';
import { Logo } from '@/components/Logo';
import { CameraCapture } from '@/components/CameraCapture';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const COURSE_TYPES = [
  { id: 'antipasto', icon: '🥗', labelKey: 'appetizer' },
  { id: 'primo', icon: '🍝', labelKey: 'first_course' },
  { id: 'secondo', icon: '🍖', labelKey: 'second_course' },
  { id: 'dessert', icon: '🍰', labelKey: 'dessert' },
];

// --- FUNZIONE DI UTILITÀ PER IL RIDIMENSIONAMENTO (ANTI-CRASH MOBILE) ---
const resizeImage = (base64Str, maxWidth = 1024, maxHeight = 1024) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      // Esporta come JPEG compresso al 70% per risparmiare memoria
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
  });
};

export const InputScreen = ({ onGenerateRecipe, isLoading }) => {
  const { t, language } = useLanguage();
  const { ingredients, addIngredient, addIngredients, removeIngredient, clearPantry } = usePantry();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('primo');
  const [quickRecipe, setQuickRecipe] = useState(false);
  const [gourmet, setGourmet] = useState(false);
  const [vegan, setVegan] = useState(false);
  const [vegetarian, setVegetarian] = useState(false);
  const [glutenFree, setGlutenFree] = useState(false);
  const [gymGoal, setGymGoal] = useState('none'); 
  const [showCameraCapture, setShowCameraCapture] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  const searchIngredients = useCallback(async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    
    try {
      const response = await axios.post(`${API}/ingredients/search`, {
        query,
        language
      });
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      console.error('Search error:', error);
    }
  }, [language]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    searchIngredients(value);
  };

  const handleAddIngredient = (ingredient) => {
    if (addIngredient(ingredient)) {
      setSearchQuery('');
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      handleAddIngredient(searchQuery);
    }
  };

  // --- GESTIONE CATTURA IMMAGINE OTTIMIZZATA ---
  const handleImageCapture = async (imageData) => {
    if (!imageData) return;
    
    setIsScanning(true);
    setShowCameraCapture(false);
    
    try {
      // 1. Ridimensiona l'immagine prima di inviarla (fondamentale per Render e Browser mobile)
      const compressedImage = await resizeImage(imageData);
      
      // 2. Estrai solo la parte base64
      const base64 = compressedImage.includes(',') ? compressedImage.split(',')[1] : compressedImage;
      
      // 3. Invia al backend con un timeout più lungo per dare tempo a Render di "svegliarsi"
      const response = await axios.post(`${API}/analyze-image`, {
        image_base64: base64,
        language
      }, { timeout: 60000 });
      
      const detectedIngredients = response.data.ingredients || [];
      if (detectedIngredients.length > 0) {
        const added = addIngredients(detectedIngredients);
        toast.success(`✅ ${added} ${language === 'it' ? 'ingredienti aggiunti' : 'ingredients added'}! 🎉`);
      } else {
        toast.info(language === 'it' ? '🔍 Nessun ingrediente rilevato' : '🔍 No ingredients detected');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMsg = language === 'it' 
        ? "Errore nell'analisi. L'immagine potrebbe essere troppo grande o il server è in standby." 
        : "Analysis error. Image might be too large or server is waking up.";
      toast.error(errorMsg);
    } finally {
      setIsScanning(false);
    }
  };

  const handleGenerate = () => {
    if (ingredients.length === 0) {
      toast.error(t('add_at_least_one'));
      return;
    }
    
    onGenerateRecipe({
      ingredients,
      course_type: selectedCourse,
      quick_recipe: quickRecipe,
      gourmet,
      vegan,
      vegetarian,
      gluten_free: glutenFree,
      language,
      gym_goal: gymGoal 
    });
  };

  return (
    <div className="flex flex-col min-h-full pb-28">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-secondary/30 px-5 pt-6 pb-8">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Logo size={48} className="animate-wiggle" />
            <h1 className="text-3xl font-display font-bold text-foreground">
              {t('app_title')}
            </h1>
          </div>
          <p className="text-base text-muted-foreground font-medium">{t('app_subtitle')}</p>
        </div>
        
        <div className="absolute top-2 right-4 text-4xl animate-float">🍳</div>
        <div className="absolute bottom-2 right-16 text-3xl animate-float" style={{ animationDelay: '0.5s' }}>🥕</div>
      </div>

      {/* Scan Button */}
      <div className="px-5 -mt-4">
        <button
          onClick={() => setShowCameraCapture(true)}
          disabled={isScanning}
          className="w-full h-16 btn-cartoon-primary text-lg flex items-center justify-center gap-3 scan-pulse-cartoon disabled:opacity-70"
        >
          {isScanning ? (
            <>
              <span className="text-2xl animate-cooking">🍳</span>
              {t('scanning')}
            </>
          ) : (
            <>
              <Camera className="w-6 h-6" />
              {t('scan_ingredients')}
            </>
          )}
        </button>
      </div>

      {/* Search Input */}
      <div className="px-5 mt-5 relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            placeholder={t('add_ingredients')}
            className="w-full input-cartoon pl-12 pr-14 h-14 text-base"
          />
          {searchQuery && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-accent flex items-center justify-center border-2 border-accent-dark shadow-cartoon-sm hover:scale-110 transition-transform"
              onClick={() => handleAddIngredient(searchQuery)}
            >
              <Plus className="w-5 h-5 text-accent-foreground" />
            </button>
          )}
        </div>
        
        {suggestions.length > 0 && (
          <div className="absolute top-full left-5 right-5 mt-2 card-cartoon z-20 overflow-hidden p-0">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleAddIngredient(suggestion)}
                className="w-full px-4 py-3 text-left text-sm font-semibold hover:bg-secondary/50 transition-colors border-b-2 border-border/30 last:border-0 flex items-center gap-2"
              >
                <span>🥬</span>
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Pantry Section */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
            <span>🧊</span>
            {t('current_pantry')}
          </h2>
          {ingredients.length > 0 && (
            <button
              onClick={() => {
                clearPantry();
                toast.success(t('pantry_cleared') + ' ✨');
              }}
              className="text-sm font-bold text-muted-foreground hover:text-destructive transition-colors"
            >
              {t('clear_pantry')}
            </button>
          )}
        </div>
        
        {ingredients.length === 0 ? (
          <div className="card-cartoon p-6 text-center">
            <div className="text-5xl mb-3 animate-float">🧊</div>
            <p className="text-base font-semibold text-muted-foreground">{t('no_ingredients')}</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="ingredient-tag-cartoon animate-bounce-in group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="capitalize">{ingredient}</span>
                <button
                  onClick={() => removeIngredient(ingredient)}
                  className="ml-1 p-0.5 rounded-full hover:bg-foreground/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Course Selector */}
      <div className="px-5 mt-6">
        <h2 className="text-lg font-display font-bold text-foreground mb-3 flex items-center gap-2">
          <span>🍽️</span>
          {t('course_type')}
        </h2>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {COURSE_TYPES.map(({ id, icon, labelKey }) => (
            <button
              key={id}
              onClick={() => setSelectedCourse(id)}
              className={`category-pill-cartoon flex-shrink-0 ${selectedCourse === id ? 'active' : ''}`}
            >
              <span className="text-2xl">{icon}</span>
              <span className={`text-xs font-bold ${selectedCourse === id ? 'text-primary' : 'text-muted-foreground'}`}>
                {t(labelKey)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* GymRat Section */}
      <div className="px-5 mt-6">
        <h2 className="text-lg font-display font-bold text-foreground mb-3 flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-orange-600" />
          GymRat (Premium)
        </h2>
        <div className="card-cartoon p-4">
          <div className="flex gap-3">
            <button 
              onClick={() => setGymGoal(gymGoal === 'bulk' ? 'none' : 'bulk')}
              className={`flex-1 py-3 px-2 rounded-xl font-bold transition-all border-2 flex flex-col items-center gap-1 ${
                gymGoal === 'bulk' 
                ? 'bg-orange-500 border-orange-700 text-white shadow-cartoon-sm scale-105' 
                : 'bg-white border-orange-500 text-orange-500 hover:bg-orange-50'
              }`}
            >
              <span className="text-xl">🔥</span>
              <span className="text-xs uppercase tracking-tighter">Bulk (Massa)</span>
            </button>
            
            <button 
              onClick={() => setGymGoal(gymGoal === 'cut' ? 'none' : 'cut')}
              className={`flex-1 py-3 px-2 rounded-xl font-bold transition-all border-2 flex flex-col items-center gap-1 ${
                gymGoal === 'cut' 
                ? 'bg-blue-500 border-blue-700 text-white shadow-cartoon-sm scale-105' 
                : 'bg-white border-blue-500 text-blue-500 hover:bg-blue-50'
              }`}
            >
              <span className="text-xl">❄️</span>
              <span className="text-xs uppercase tracking-tighter">Cut (Definizione)</span>
            </button>
          </div>
          {gymGoal !== 'none' && (
            <p className="text-[10px] text-center mt-3 font-bold text-muted-foreground animate-pulse italic">
              ✨ Modalità {gymGoal.toUpperCase()} attiva: calcolo macros incluso!
            </p>
          )}
        </div>
      </div>

      {/* Dietary & Filters */}
      <div className="px-5 mt-6">
        <h2 className="text-lg font-display font-bold text-foreground mb-3 flex items-center gap-2">
          <span>⚡</span>
          {t('filters')}
        </h2>
        <div className="card-cartoon p-4 space-y-4">
          <div className="flex items-center justify-between">
