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
    <nav 
      className="bottom-nav-cartoon"
      style={{
        position: 'fixed',
        bottom: '30px',      // Alza la barra sopra il watermark
        left: '15px',        // Stacca la barra dai bordi laterali
        right: '15px',
        width: 'calc(100% - 30px)', // Adatta la larghezza
        borderRadius: '20px', // La rende una pillola moderna
        zIndex: 999          // La tiene sopra tutto
      }}
    >
      {tabs.map(({ id, emoji, labelKey }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`nav-item-cartoon ${activeTab === id ? 'active' : ''}`}
        >
          <span className={`text-2xl ${activeTab === id ? 'animate-pop' : ''}`}>{emoji}</span>
          <span className="text-xs font-bold">{t(labelKey)}</span>
        </button>
      ))}
    </nav>
  );
};
