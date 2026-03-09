import { Camera, Search, Plus, X, Dumbbell, Leaf, Shovel, WheatOff } from 'lucide-react';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/LanguageContext';
import { usePantry } from '@/context/PantryContext';
import { Logo } from '@/components/Logo';
import { CameraCapture } from '@/components/CameraCapture';
import { toast } from 'sonner';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;

const COURSE_TYPES = [
  { id: 'antipasto', icon: '🥗', labelKey: 'appetizer' },
  { id: 'primo', icon: '🍝', labelKey: 'first_course' },
  { id: 'secondo', icon: '🍖', labelKey: 'second_course' },
  { id: 'dessert', icon: '🍰', labelKey: 'dessert' },
];

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
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
  });
};

export const InputScreen = ({ onGenerateRecipe, isLoading }) => {
  const { t, language } = useLanguage();
  const { ingredients, addIngredient, addIngredients, removeIngredient } = usePantry();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('primo');
  const [quickRecipe, setQuickRecipe] = useState(false);
  const [gourmet, setGourmet] = useState(false);
  const [gymGoal, setGymGoal] = useState('none');
  
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isVegan, setIsVegan] = useState(false);
  const [isGlutenFree, setIsGlutenFree] = useState(false);

  const [showCameraCapture, setShowCameraCapture] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleVeganToggle = (checked) => {
    setIsVegan(checked);
    if (checked) setIsVegetarian(true);
  };

  const handleVegetarianToggle = (checked) => {
    setIsVegetarian(checked);
    if (!checked) setIsVegan(false);
  };

  const searchIngredients = useCallback(async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.post(`${API}/api/ingredients/search`, { query, language });
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

  const handleImageCapture = async (imageData) => {
    if (!imageData) return;
    setIsScanning(true);
    setShowCameraCapture(false);
    try {
      const compressedImage = await resizeImage(imageData);
      const base64 = compressedImage.includes(',') ? compressedImage.split(',')[1] : compressedImage;
      
      // Chiamata allineata al backend ImageAnalysisRequest
      const response = await axios.post(`${API}/api/analyze-image`, {
        image_base64: base64
      }, { timeout: 60000 });
      
      const detected = response.data.ingredients || [];
      if (detected.length > 0) {
        addIngredients(detected);
        toast.success(t('ingredients_added') || 'Aggiunti!');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error("Errore analisi.");
    } finally {
      setIsScanning(false);
    }
  };

  // --- LOGICA ALLINEATA AL BACKEND (RecipeRequest) ---
  const handleGenerate = () => {
    if (ingredients.length === 0) {
      toast.error(t('add_at_least_one'));
      return;
    }
    
    // Creiamo il payload esattamente come lo aspetta il server.py
    const recipePayload = {
      user_id: "dev_user_123", // Cambia in base alla tua logica utenti
      ingredients: ingredients,
      course_type: selectedCourse,
      language: language,
      gym_goal: gymGoal,
      is_premium: false, // Switch per testare il limite Free del server
      dietary: {
        vegetarian: isVegetarian,
        vegan: isVegan,
        gluten_free: isGlutenFree
      }
    };

    if (typeof onGenerateRecipe === 'function') {
      onGenerateRecipe(recipePayload);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-72">
      <div className="bg-secondary/30 px-5 pt-8 pb-10 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-2">
          <Logo size={48} />
          <h1 className="text-3xl font-display font-bold text-foreground notranslate">DishUp</h1>
        </div>
        <p className="text-muted-foreground font-medium">{t('app_subtitle')}</p>
      </div>

      <div className="px-5 -mt-6">
        <button
          onClick={() => setShowCameraCapture(true)}
          className="w-full h-16 btn-cartoon-primary flex items-center justify-center gap-3 font-bold shadow-cartoon notranslate"
        >
          <Camera /> {isScanning ? t('scanning') : t('scan_ingredients')}
        </button>
      </div>

      <div className="px-5 mt-6 relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={(e) => e.key === 'Enter' && handleAddIngredient(searchQuery)}
            placeholder={t('add_ingredients')}
            className="w-full input-cartoon pl-12 h-14"
          />
        </div>
        {suggestions.length > 0 && (
          <div className="absolute top-full left-5 right-5 mt-1 card-cartoon z-50 p-0 overflow-hidden">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => handleAddIngredient(s)} className="w-full p-4 text-left hover:bg-secondary/50 border-b last:border-0 font-bold notranslate">
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 mt-8">
        <h2 className="font-display font-bold text-lg">🧊 {t('current_pantry')}</h2>
        <div className="flex flex-wrap gap-2 mt-3">
          {ingredients.map((ing, i) => (
            <div key={i} className="ingredient-tag-cartoon flex items-center gap-2 notranslate">
              <span className="capitalize">{ing}</span>
              <X className="w-4 h-4 cursor-pointer" onClick={() => removeIngredient(ing)} />
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 mt-8">
        <h2 className="font-display font-bold mb-4">{t('course_type')}</h2>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {COURSE_TYPES.map(({ id, icon, labelKey }) => (
            <button
              key={id}
              onClick={() => setSelectedCourse(id)}
              className={`category-pill-cartoon flex-shrink-0 notranslate ${selectedCourse === id ? 'active' : ''}`}
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-bold">{t(labelKey)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-8">
        <h2 className="font-display font-bold mb-4 flex items-center gap-2 notranslate"><Dumbbell className="w-5 h-5" /> GymRat</h2>
        <div className="card-cartoon p-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => setGymGoal(gymGoal === 'bulk' ? 'none' : 'bulk')}
            className={`py-3 rounded-xl font-bold border-2 transition-all notranslate ${gymGoal === 'bulk' ? 'bg-orange-500 text-white border-black' : 'bg-white text-orange-500 border-orange-500'}`}
          >
            🔥 Bulk
          </button>
          <button
            onClick={() => setGymGoal(gymGoal === 'cut' ? 'none' : 'cut')}
            className={`py-3 rounded-xl font-bold border-2 transition-all notranslate ${gymGoal === 'cut' ? 'bg-blue-500 text-white border-black' : 'bg-white text-blue-500 border-blue-500'}`}
          >
            ❄️ Cut
          </button>
        </div>
      </div>

      <div className="px-5 mt-8">
        <h2 className="font-display font-bold mb-4">⚡ {t('filters')}</h2>
        <div className="card-cartoon p-4 space-y-5">
          <div className="flex items-center justify-between">
            <Label className="font-bold flex items-center gap-2 notranslate"><Leaf className="w-4 h-4 text-green-500"/> {t('vegetarian')}</Label>
            <Switch checked={isVegetarian} onCheckedChange={handleVegetarianToggle} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="font-bold flex items-center gap-2 notranslate"><Shovel className="w-4 h-4 text-green-600"/> {t('vegan')}</Label>
            <Switch checked={isVegan} onCheckedChange={handleVeganToggle} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="font-bold flex items-center gap-2 notranslate"><WheatOff className="w-4 h-4 text-amber-600"/> {t('gluten_free')}</Label>
            <Switch checked={isGlutenFree} onCheckedChange={setIsGlutenFree} />
          </div>
          <hr className="border-secondary/30" />
          <div className="flex items-center justify-between">
            <Label className="font-bold notranslate">{t('quick_recipe')}</Label>
            <Switch checked={quickRecipe} onCheckedChange={setQuickRecipe} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="font-bold notranslate">Gourmet Mode ✨</Label>
            <Switch checked={gourmet} onCheckedChange={setGourmet} />
          </div>
        </div>
      </div>

      <div className="fixed bottom-[85px] left-0 right-0 p-5 bg-gradient-to-t from-background via-background/95 to-transparent z-[100]">
        <Button
          onClick={handleGenerate}
          disabled={isLoading || ingredients.length === 0}
          className="w-full h-16 btn-cartoon-primary text-xl font-black shadow-cartoon disabled:opacity-50 notranslate"
        >
          {isLoading ? `${t('generating')}...` : t('generate_recipe')}
        </Button>
      </div>

      {showCameraCapture && (
        <CameraCapture onCapture={handleImageCapture} onClose={() => setShowCameraCapture(false)} />
      )}
    </div>
  );
};
