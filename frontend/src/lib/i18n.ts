import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from '../locales/en.json';
import hiTranslation from '../locales/hi.json';
import mrTranslation from '../locales/mr.json';

const resources = {
  en: { translation: enTranslation },
  hi: { translation: hiTranslation },
  mr: { translation: mrTranslation }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes by default
    }
  });

export default i18n;
