import { Camera, Search, Plus, X, Dumbbell } from 'lucide-react';
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
  const { ingredients, addIngredient, addIngredients, removeIngredient, clearPantry } = usePantry();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('primo');
  const [quickRecipe, setQuickRecipe] = useState(false);
  const [gourmet, setGourmet] = useState(false);
  const [gymGoal, setGymGoal] = useState('none');
  const [showCameraCapture, setShowCameraCapture] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

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
      const response = await axios.post(`${API}/api/analyze-image`, {
        image_base64: base64,
        language
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

  const handleGenerate = () => {
    console.log("Generazione avviata con:", { ingredients, gymGoal, selectedCourse });

    if (ingredients.length === 0) {
      toast.error(t('add_at_least_one'));
      return;
    }
    
    if (typeof onGenerateRecipe === 'function') {
      onGenerateRecipe({
        ingredients,
        course_type: selectedCourse,
        quick_recipe: quickRecipe,
        gourmet,
        language,
        gym_goal: gymGoal
      });
    } else {
      console.error("Errore: onGenerateRecipe non è una funzione.");
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-32">
      {/* Header */}
      <div className="bg-secondary/30 px-5 pt-8 pb-10 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-2">
          <Logo size={48} />
          <h1 className="text-3xl font-display font-bold text-foreground">{t('app_title')}</h1>
        </div>
        <p className="text-muted-foreground font-medium">{t('app_subtitle')}</p>
      </div>

      {/* Pulsante Fotocamera */}
      <div className="px-5 -mt-6">
        <button
          onClick={() => setShowCameraCapture(true)}
          className="w-full h-16 btn-cartoon-primary flex items-center justify-center gap-3 font-bold shadow-cartoon"
        >
          <Camera /> {isScanning ? t('scanning') : t('scan_ingredients')}
        </button>
      </div>

      {/* Ricerca Ingredienti */}
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
              <button key={i} onClick={() => handleAddIngredient(s)} className="w-full p-4 text-left hover:bg-secondary/50 border-b last:border-0 font-bold">
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Dispensa Corrente */}
      <div className="px-5 mt-8">
        <h2 className="font-display font-bold text-lg">🧊 {t('current_pantry')}</h2>
        <div className="flex flex-wrap gap-2 mt-3">
          {ingredients.map((ing, i) => (
            <div key={i} className="ingredient-tag-cartoon flex items-center gap-2">
              <span className="capitalize">{ing}</span>
              <X className="w-4 h-4 cursor-pointer" onClick={() => removeIngredient(ing)} />
            </div>
          ))}
          {ingredients.length === 0 && <p className="text-sm text-muted-foreground italic">La dispensa è vuota</p>}
        </div>
      </div>

      {/* Tipo di Portata */}
      <div className="px-5 mt-8">
        <h2 className="font-display font-bold mb-4">{t('course_type')}</h2>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {COURSE_TYPES.map(({ id, icon, labelKey }) => (
            <button
              key={id}
              onClick={() => setSelectedCourse(id)}
              className={`category-pill-cartoon flex-shrink-0 ${selectedCourse === id ? 'active' : ''}`}
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-bold">{t(labelKey)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Obiettivi GymRat */}
      <div className="px-5 mt-8">
        <h2 className="font-display font-bold mb-4 flex items-center gap-2"><Dumbbell className="w-5 h-5" /> GymRat</h2>
        <div className="card-cartoon p-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => setGymGoal(prev => prev === 'bulk' ? 'none' : 'bulk')}
            className={`py-3 rounded-xl font-bold border-2 transition-all ${gymGoal === 'bulk' ? 'bg-orange-500 text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-orange-500 border-orange-500'}`}
          >
            🔥 Bulk
          </button>
          <button
            onClick={() => setGymGoal(prev => prev === 'cut' ? 'none' : 'cut')}
            className={`py-3 rounded-xl font-bold border-2 transition-all ${gymGoal === 'cut' ? 'bg-blue-500 text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-blue-500 border-blue-500'}`}
          >
            ❄️ Cut
          </button>
        </div>
      </div>

      {/* Filtri Extra */}
      <div className="px-5 mt-8 mb-10">
        <h2 className="font-display font-bold mb-4">⚡ {t('filters')}</h2>
        <div className="card-cartoon p-4 space-y-5">
          <div className="flex items-center justify-between">
            <Label htmlFor="quick" className="font-bold">{t('quick_recipe')}</Label>
            <Switch id="quick" checked={quickRecipe} onCheckedChange={setQuickRecipe} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="gourmet" className="font-bold">Gourmet Mode ✨</Label>
            <Switch id="gourmet" checked={gourmet} onCheckedChange={setGourmet} />
          </div>
        </div>
      </div>

      {/* Pulsante Genera Fisso in Basso */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-background/80 backdrop-blur-md z-40 border-t border-secondary">
        <Button
          onClick={handleGenerate}
          disabled={isLoading || ingredients.length === 0}
          className="w-full h-16 btn-cartoon-primary text-xl font-black shadow-cartoon disabled:opacity-50"
        >
          {isLoading ? `${t('generating')}...` : t('generate_recipe')}
        </Button>
      </div>

      {/* Overlay Fotocamera */}
      {showCameraCapture && (
        <CameraCapture onCapture={handleImageCapture} onClose={() => setShowCameraCapture(false)} />
      )}
    </div>
  );
};
