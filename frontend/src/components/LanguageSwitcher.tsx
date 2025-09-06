import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supportedLanguages, changeLanguage, getCurrentLanguage } from '../i18n';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const currentLanguage = getCurrentLanguage();

  const handleLanguageChange = async (languageCode: string) => {
    const success = await changeLanguage(languageCode);
    if (success) {
      setIsOpen(false);
    }
  };

  const currentLang = supportedLanguages.find(lang => lang.code === currentLanguage) || supportedLanguages[0];

  return (
    <div className="language-switcher">
      <button
        className="button secondary language-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className="language-flag">{currentLang.code.toUpperCase()}</span>
        <span className="language-name">{currentLang.nativeName}</span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="language-dropdown">
          {supportedLanguages.map((language) => (
            <button
              key={language.code}
              className={`language-option ${currentLanguage === language.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(language.code)}
              aria-label={`Switch to ${language.name}`}
            >
              <span className="language-flag">{language.code.toUpperCase()}</span>
              <span className="language-name">{language.nativeName}</span>
              {currentLanguage === language.code && <span className="check-mark">✓</span>}
            </button>
          ))}
        </div>
      )}
      
      {isOpen && (
        <div 
          className="language-backdrop" 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}