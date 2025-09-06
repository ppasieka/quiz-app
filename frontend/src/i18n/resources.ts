import type { TranslationKeys } from './types';

// Import translation files
import enCommon from '../locales/en/common.json';
import enQuiz from '../locales/en/quiz.json';
import enErrors from '../locales/en/errors.json';

import noCommon from '../locales/no/common.json';
import noQuiz from '../locales/no/quiz.json';
import noErrors from '../locales/no/errors.json';

import plCommon from '../locales/pl/common.json';
import plQuiz from '../locales/pl/quiz.json';
import plErrors from '../locales/pl/errors.json';

// Combine translations for each language
const enTranslations: TranslationKeys = {
  common: enCommon,
  quiz: enQuiz,
  errors: enErrors,
};

const noTranslations: TranslationKeys = {
  common: noCommon,
  quiz: noQuiz,
  errors: noErrors,
};

const plTranslations: TranslationKeys = {
  common: plCommon,
  quiz: plQuiz,
  errors: plErrors,
};

// Export resources for i18next
export const resources = {
  en: enTranslations,
  no: noTranslations,
  pl: plTranslations,
} as const;

// Supported languages
export const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
] as const;

export type SupportedLanguage = typeof supportedLanguages[number]['code'];