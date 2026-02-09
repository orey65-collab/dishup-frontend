import { createContext, useContext, useState, useEffect } from 'react';

const PantryContext = createContext();

export const PantryProvider = ({ children }) => {
  const [ingredients, setIngredients] = useState(() => {
    const saved = localStorage.getItem('dishup-pantry');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('dishup-pantry', JSON.stringify(ingredients));
  }, [ingredients]);

  const addIngredient = (ingredient) => {
    const normalized = ingredient.toLowerCase().trim();
    if (normalized && !ingredients.includes(normalized)) {
      setIngredients(prev => [...prev, normalized]);
      return true;
    }
    return false;
  };

  const addIngredients = (newIngredients) => {
    const normalized = newIngredients
      .map(ing => ing.toLowerCase().trim())
      .filter(ing => ing && !ingredients.includes(ing));
    
    if (normalized.length > 0) {
      setIngredients(prev => [...prev, ...normalized]);
    }
    return normalized.length;
  };

  const removeIngredient = (ingredient) => {
    setIngredients(prev => prev.filter(ing => ing !== ingredient));
  };

  const clearPantry = () => {
    setIngredients([]);
  };

  return (
    <PantryContext.Provider value={{ 
      ingredients, 
      addIngredient, 
      addIngredients, 
      removeIngredient, 
      clearPantry 
    }}>
      {children}
    </PantryContext.Provider>
  );
};

export const usePantry = () => {
  const context = useContext(PantryContext);
  if (!context) {
    throw new Error('usePantry must be used within a PantryProvider');
  }
  return context;
};
