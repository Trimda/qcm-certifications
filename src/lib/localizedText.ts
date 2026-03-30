import type { LocalizedText, SupportedLang } from '@/types';

/** Normalize any i18next language code to a supported app language. */
export const getLang = (language: string): SupportedLang => {
  return language.startsWith('fr') ? 'fr' : 'en';
};

/** Resolve a LocalizedText object to a plain string for the given language. */
export const resolveText = (text: LocalizedText, language: string): string => {
  const lang = getLang(language);
  return text[lang] || text.fr || text.en || '';
};
