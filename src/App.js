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

// Assicurati che l'URL sia corretto nelle variabili d'ambiente di Netlify
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const MainApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [generatedRecipes, setGeneratedRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState('input');

  // FUNZIONE DI CORREZIONE DATI (Normalization)
  // Questa funzione assicura che i campi abbiano i nomi giusti per il frontend
  const normalizeRecipes = (recipes) => {
    return recipes.map(r => ({
      ...r,
      // Se il server manda ingredients_list lo usiamo, altrimenti cerchiamo nomi simili
      ingredients: r.ingredients_list || r.ingredients || [],
      // Mappatura per il "Perché è speciale"
      special_reason: r.special_reason || r.origin_story || "Una ricetta originale creata apposta per te!",
      // Mappatura per il Sommelier
      sommelier_advice: r.sommelier_advice || r.wine_pairing || "Un buon vino bianco fresco.",
      // Mappatura procedura
      steps: r.procedure || r.steps || []
    }));
  };

  const handleGenerateRecipe = async (params) => {
    setIsLoading(true);
    try {
      console.log('Generating recipe with params:', params);
      const response = await axios.post(`${API}/generate-recipe`, params);
      
      if (response.data && response.data.recipes) {
        // Applichiamo la normalizzazione prima di salvare
        const cleanRecipes = normalizeRecipes(response.data.recipes);
        console.log('Recipes normalized:', cleanRecipes);
        
        setGeneratedRecipes(cleanRecipes);
        setView('selection');
      } else {
        console.error('Nessuna ricetta ricevuta');
      }
    } catch (error) {
      console.error('Errore generazione ricetta:', error);
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
