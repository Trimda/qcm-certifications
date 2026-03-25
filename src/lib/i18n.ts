import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

const isServer = typeof window === 'undefined';

if (!isServer) {
  i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'fr',
      lng: 'fr',
      defaultNS: 'common',
      ns: ['common'],
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      detection: {
        order: ['localStorage', 'navigator'],
        lookupLocalStorage: 'i18n_lang',
        caches: ['localStorage'],
      },
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
}

export default i18n;
