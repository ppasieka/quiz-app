import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { supportedLanguages } from './resources';
import type { TranslationKeys } from './types';

// Import translation files directly
import enCommon from '../locales/en/common.json';
import enQuiz from '../locales/en/quiz.json';
import enErrors from '../locales/en/errors.json';

import noCommon from '../locales/no/common.json';
import noQuiz from '../locales/no/quiz.json';
import noErrors from '../locales/no/errors.json';

import plCommon from '../locales/pl/common.json';
import plQuiz from '../locales/pl/quiz.json';
import plErrors from '../locales/pl/errors.json';

// Language detector configuration
const detectorOptions = {
  order: ['localStorage', 'navigator', 'htmlTag'],
  lookupLocalStorage: 'i18nextLng',
  caches: ['localStorage'],
};

// i18next configuration - simplified and synchronous
const resources = {
  en: {
    common: enCommon,
    quiz: enQuiz,
    errors: enErrors,
  },
  no: {
    common: noCommon,
    quiz: noQuiz,
    errors: noErrors,
  },
  pl: {
    common: plCommon,
    quiz: plQuiz,
    errors: plErrors,
  },
};

console.log('Initializing i18n with resources:', Object.keys(resources));

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: true,
    
    detection: detectorOptions,
    
    interpolation: {
      escapeValue: false,
      format: (value: any, format: string | undefined, lng: string | undefined) => {
        if (format === 'plural') {
          const num = Number(value);
          if (lng === 'no') {
            return num === 1 ? '' : 'er';
          } else if (lng === 'pl') {
            if (num === 1) return '';
            if (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20)) return 'y';
            return 'ów';
          } else {
            return num === 1 ? '' : 's';
          }
        }
        return value;
      },
    },
    
    defaultNS: 'common',
    ns: ['common', 'quiz', 'errors'],
    nsSeparator: ':',
    keySeparator: '.',
    
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged',
      bindI18nStore: 'added removed',
      nsMode: 'default',
    },
  });

console.log('i18n initialization completed');
console.log('Current language after init:', i18n.language);
console.log('Available resources:', Object.keys(i18n.services.resourceStore.data));

// Export configured i18n instance
export default i18n;

// Export types and utilities
export type { TranslationKeys } from './types';
export { supportedLanguages } from './resources';
export type { SupportedLanguage } from './resources';

// Language switching utility
export const changeLanguage = async (language: string) => {
  try {
    await i18n.changeLanguage(language);
    // Store preference in localStorage
    localStorage.setItem('i18nextLng', language);
    return true;
  } catch (error) {
    console.error('Failed to change language:', error);
    return false;
  }
};

// Get current language
export const getCurrentLanguage = (): string => {
  return i18n.language || 'en';
};

// Check if language is supported
export const isSupportedLanguage = (language: string): boolean => {
  return supportedLanguages.some(lang => lang.code === language);
};