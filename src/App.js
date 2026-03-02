import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { LanguageProvider } from '@/context/LanguageContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { PantryProvider } from '@/context/PantryContext';
import { InputScreen } from '@/components/InputScreen';
import { RecipeScreen } from '@/components/RecipeScreen';
import { RecipeSelectionScreen } from '@/components/RecipeSelectionScreen';
import { FavoritesScreen } from '@/components/FavoritesScreen';
import { ProfileScreen } from '@/components/ProfileScreen';
import { BottomNav } from '@/components/BottomNav';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const MainApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [generatedRecipes, setGeneratedRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState('input');

  // NORMALIZZAZIONE DATI AGGIORNATA PER GYMRAT & PREMIUM
  const normalizeRecipes = (recipes) => {
    return recipes.map(r => ({
      ...r,
      ingredients: r.ingredients_list || r.ingredients || [],
      special_reason: r.special_reason || "Una ricetta esclusiva per DishUp!",
      sommelier_advice: r.sommelier_advice || r.wine_pairing || "Un abbinamento selezionato.",
      steps: r.procedure || r.steps || [],
      // Gestione Macros (Proteine, Carboidrati, Grassi)
      macros: r.macros || null 
    }));
  };

  const handleGenerateRecipe = async (params) => {
    setIsLoading(true);
    try {
      // INIEZIONE CODICE SVILUPPATORE E LOGICA PREMIUM
      const enrichedParams = {
        ...params,
        user_id: "DISHUP_ADMIN_2026", // Il tuo lasciapassare admin
        is_premium: true,             // Attiva le funzioni Premium (Macros/Vini)
        gym_goal: params.gym_goal || 'none' // 'bulk', 'cut' o 'none'
      };

      console.log('DishUp Admin Mode - Sending:', enrichedParams);
      
      const response = await axios.post(`${API}/generate-recipe`, enrichedParams);
      
      if (response.data && response.data.recipes) {
        const cleanRecipes = normalizeRecipes(response.data.recipes);
        console.log('Recipes Loaded with Macros:', cleanRecipes);
        
        setGeneratedRecipes(cleanRecipes);
        setView('selection');
      } else {
        console.error('Nessuna ricetta ricevuta dal server');
      }
    } catch (error) {
      console.error('Errore generazione ricetta:', error);
      // Qui potresti aggiungere un messaggio toast per l'utente se l'API fallisce
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRecipe = (recipe) => {
    setCurrentRecipe(recipe);
    setView('recipe');
  };

  const handleBackToInput = () => {
    setView('input');
    setCurrentRecipe(null);
    setGeneratedRecipes([]);
    setActiveTab('home');
  };

  const handleBackToSelection = () => {
    setView('selection');
    setCurrentRecipe(null);
  };

  const handleSelectFavorite = (recipe) => {
    setCurrentRecipe(recipe);
    setView('recipe');
    setActiveTab('home');
  };

  const renderContent = () => {
    if (view === 'selection' && generatedRecipes.length > 0) {
      return (
        <RecipeSelectionScreen
          recipes={generatedRecipes}
          onSelectRecipe={handleSelectRecipe}
          onBack={handleBackToInput}
        />
      );
    }

    if (view === 'recipe' && currentRecipe) {
      return (
        <RecipeScreen
          recipe={currentRecipe}
          onBack={generatedRecipes.length > 0 ? handleBackToSelection : handleBackToInput}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return <InputScreen onGenerateRecipe={handleGenerateRecipe} isLoading={isLoading} />;
      case 'favorites':
        return <FavoritesScreen onSelectRecipe={handleSelectFavorite} />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <InputScreen onGenerateRecipe={handleGenerateRecipe} isLoading={isLoading} />;
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background">
      <main className="relative">
        {renderContent()}
      </main>

      {view === 'input' && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            if (tab === 'home') {
              setView('input');
              setCurrentRecipe(null);
              setGeneratedRecipes([]);
              setActiveTab('home');
            } else {
              setActiveTab(tab);
              setView('input');
            }
          }}
        />
      )}

      {isLoading && <LoadingOverlay />}
      <Toaster position="top-center" richColors />
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <FavoritesProvider>
        <PantryProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainApp />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </PantryProvider>
      </FavoritesProvider>
    </LanguageProvider>
  );
}

export default App;
