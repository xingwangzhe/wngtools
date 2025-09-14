import i18n from 'i18next';
import zh from '../../locales/zh.json';
import en from '../../locales/en.json';

i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    zh: {
      translation: zh,
    },
    en: {
      translation: en,
    },
  },
});

export default i18n;
