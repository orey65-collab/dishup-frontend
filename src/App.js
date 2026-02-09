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
  const [view, setView] = useState('input'); // 'input' | 'selection' | 'recipe'

  const handleGenerateRecipe = async (params) => {
    setIsLoading(true);
    
    try {
      console.log('Generating recipe with params:', params);
      const response = await axios.post(`${API}/generate-recipe`, params);
      console.log('Recipe generation response:', response.data);
      const recipes = response.data.recipes;
      
      if (recipes && recipes.length > 0) {
        console.log('Setting recipes and switching to selection view:', recipes.length);
        setGeneratedRecipes(recipes);
        setView('selection');
      } else {
        console.error('No recipes received from API');
      }
    } catch (error) {
      console.error('Recipe generation error:', error);
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
    // If viewing recipe selection
    if (view === 'selection' && generatedRecipes.length > 0) {
      return (
        <RecipeSelectionScreen
          recipes={generatedRecipes}
          onSelectRecipe={handleSelectRecipe}
          onBack={handleBackToInput}
        />
      );
    }

    // If viewing a single recipe
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
        return (
          <InputScreen
            onGenerateRecipe={handleGenerateRecipe}
            isLoading={isLoading}
          />
        );
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
      {/* Main Content */}
      <main className="relative">
        {renderContent()}
      </main>

      {/* Bottom Navigation - show only on input view, always visible but HOME resets view */}
      {view === 'input' && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            if (tab === 'home') {
              // Reset everything when HOME is clicked
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

      {/* Loading Overlay */}
      {isLoading && <LoadingOverlay />}

      {/* Toast notifications */}
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
