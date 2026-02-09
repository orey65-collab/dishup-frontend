import { Home, Heart, User } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const BottomNav = ({ activeTab, onTabChange }) => {
  const { t } = useLanguage();
  
  const tabs = [
    { id: 'home', emoji: '🏠', labelKey: 'home' },
    { id: 'favorites', emoji: '❤️', labelKey: 'favorites' },
    { id: 'profile', emoji: '👤', labelKey: 'profile' },
  ];

  return (
    <nav className="bottom-nav-cartoon">
      {tabs.map(({ id, emoji, labelKey }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`nav-item-cartoon ${activeTab === id ? 'active' : ''}`}
        >
          <span className={`text-2xl ${activeTab === id ? 'animate-pop' : ''}`}>{emoji}</span>
          <span className="text-xs">{t(labelKey)}</span>
        </button>
      ))}
    </nav>
  );
};
