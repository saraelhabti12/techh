import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <button 
        onClick={() => changeLanguage('en')}
        style={{
            padding: '0.25rem 0.5rem',
            border: '1px solid var(--gray-300)',
            borderRadius: '4px',
            background: i18n.language === 'en' ? 'var(--pink-500)' : 'var(--white)',
            color: i18n.language === 'en' ? 'var(--white)' : 'var(--gray-700)',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 600
        }}
      >
        EN
      </button>
      <button 
        onClick={() => changeLanguage('fr')}
        style={{
            padding: '0.25rem 0.5rem',
            border: '1px solid var(--gray-300)',
            borderRadius: '4px',
            background: i18n.language === 'fr' ? 'var(--pink-500)' : 'var(--white)',
            color: i18n.language === 'fr' ? 'var(--white)' : 'var(--gray-700)',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 600
        }}
      >
        FR
      </button>
    </div>
  );
}
