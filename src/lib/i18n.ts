import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations statically so they work on both server and client
import fr from '../../public/locales/fr/common.json';
import en from '../../public/locales/en/common.json';

// Guard against re-initialization (e.g., HMR in dev)
if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources: {
      fr: { common: fr },
      en: { common: en },
    },
    fallbackLng: 'fr',
    lng: 'fr',
    defaultNS: 'common',
    ns: ['common'],
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
}

export default i18n;
