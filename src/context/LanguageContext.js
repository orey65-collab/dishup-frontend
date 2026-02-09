import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  it: {
    scan_ingredients: "Scansiona Ingredienti",
    add_ingredients: "Aggiungi ingredienti...",
    current_pantry: "Dispensa Attuale",
    appetizer: "Antipasto",
    first_course: "Primo",
    second_course: "Secondo",
    dessert: "Dessert",
    quick_recipes: "Ricette Veloci",
    quick_recipes_sub: "(<20 min)",
    gourmet_recipes: "Sfidanti/Gourmet",
    generate_recipe: "Genera Ricetta Sfiziosa",
    prep_time: "Tempo",
    difficulty: "Difficoltà",
    why_special: "Perché questa ricetta è speciale",
    ingredients: "Ingredienti",
    instructions: "Procedimento",
    next: "Avanti",
    previous: "Indietro",
    finish: "Fine",
    home: "Home",
    favorites: "Preferiti",
    profile: "Profilo",
    no_ingredients: "Nessun ingrediente nella dispensa",
    scanning: "Analizzando...",
    generating: "Sto creando la tua ricetta...",
    easy: "Facile",
    medium: "Media",
    hard: "Difficile",
    minutes: "min",
    servings: "porzioni",
    language: "Lingua",
    app_title: "DishUp",
    app_subtitle: "Trasforma i tuoi ingredienti in piatti deliziosi",
    take_photo: "Scatta una foto",
    choose_gallery: "Scegli dalla galleria",
    cancel: "Annulla",
    step: "Passo",
    of: "di",
    save_favorite: "Salva nei preferiti",
    saved: "Salvato!",
    no_favorites: "Nessuna ricetta salvata",
    no_favorites_desc: "Le tue ricette preferite appariranno qui",
    settings: "Impostazioni",
    about: "Informazioni",
    clear_pantry: "Svuota dispensa",
    pantry_cleared: "Dispensa svuotata",
    error_camera: "Errore nell'accesso alla fotocamera",
    error_recipe: "Errore nella generazione della ricetta",
    try_again: "Riprova",
    add_at_least_one: "Aggiungi almeno un ingrediente",
    recipe_ready: "La tua ricetta è pronta!",
    filters: "Filtri",
    course_type: "Tipo di portata",
    dietary: "Preferenze Alimentari",
    vegan: "Vegano",
    vegetarian: "Vegetariano",
    gluten_free: "Celiaco",
    calories: "kcal",
    per_serving: "a porzione",
    sommelier_tip: "Consiglio del Sommelier",
    bon_appetit: "Buon Appetito!",
    wine_pairing: "Abbinamento Vino"
  },
  en: {
    scan_ingredients: "Scan Ingredients",
    add_ingredients: "Add ingredients...",
    current_pantry: "Current Pantry",
    appetizer: "Appetizer",
    first_course: "First Course",
    second_course: "Main Course",
    dessert: "Dessert",
    quick_recipes: "Quick Recipes",
    quick_recipes_sub: "(<20 min)",
    gourmet_recipes: "Gourmet/Challenging",
    generate_recipe: "Generate Tasty Recipe",
    prep_time: "Time",
    difficulty: "Difficulty",
    why_special: "Why this recipe is special",
    ingredients: "Ingredients",
    instructions: "Procedure",
    next: "Next",
    previous: "Previous",
    finish: "Finish",
    home: "Home",
    favorites: "Favorites",
    profile: "Profile",
    no_ingredients: "No ingredients in pantry",
    scanning: "Scanning...",
    generating: "Creating your recipe...",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    minutes: "min",
    servings: "servings",
    language: "Language",
    app_title: "DishUp",
    app_subtitle: "Transform your ingredients into delicious dishes",
    take_photo: "Take a photo",
    choose_gallery: "Choose from gallery",
    cancel: "Cancel",
    step: "Step",
    of: "of",
    save_favorite: "Save to favorites",
    saved: "Saved!",
    no_favorites: "No saved recipes",
    no_favorites_desc: "Your favorite recipes will appear here",
    settings: "Settings",
    about: "About",
    clear_pantry: "Clear pantry",
    pantry_cleared: "Pantry cleared",
    error_camera: "Error accessing camera",
    error_recipe: "Error generating recipe",
    try_again: "Try again",
    add_at_least_one: "Add at least one ingredient",
    recipe_ready: "Your recipe is ready!",
    filters: "Filters",
    course_type: "Course type",
    dietary: "Dietary Preferences",
    vegan: "Vegan",
    vegetarian: "Vegetarian",
    gluten_free: "Gluten-Free",
    calories: "kcal",
    per_serving: "per serving",
    sommelier_tip: "Sommelier's Tip",
    bon_appetit: "Bon Appetit!",
    wine_pairing: "Wine Pairing"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('dishup-language');
    return saved || 'it';
  });

  useEffect(() => {
    localStorage.setItem('dishup-language', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations['it'][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'it' ? 'en' : 'it');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
