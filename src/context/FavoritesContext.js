import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('dishup-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('dishup-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (recipe) => {
    const newRecipe = {
      ...recipe,
      id: Date.now(),
      savedAt: new Date().toISOString()
    };
    setFavorites(prev => [newRecipe, ...prev]);
    return newRecipe.id;
  };

  const removeFavorite = (id) => {
    setFavorites(prev => prev.filter(recipe => recipe.id !== id));
  };

  const isFavorite = (title) => {
    return favorites.some(recipe => recipe.title === title);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
