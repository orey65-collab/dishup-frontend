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

const API = ${process.env.REACT_APP_BACKEND_URL}/api;

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
const response = await axios.post(${API}/ingredients/search, { query, language });
setSuggestions(response.data.suggestions || []);
} catch (error) {
console.error('Search error:', error);
}
}, [language, API]);

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
const response = await axios.post(${API}/analyze-image, {
image_base64: base64,
language
}, { timeout: 60000 });
const detected = response.data.ingredients || [];
if (detected.length > 0) {
addIngredients(detected);
toast.success(t('ingredients_added') || 'Aggiunti!');
}
} catch (error) {
toast.error("Errore analisi.");
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
language,
gym_goal: gymGoal
});
};

return (
<div className="flex flex-col min-h-full pb-32">
<div className="bg-secondary/30 px-5 pt-8 pb-10">
<Logo size={48} />
<h1 className="text-3xl font-bold mt-2">{t('app_title')}</h1>
</div>

);
};
       
