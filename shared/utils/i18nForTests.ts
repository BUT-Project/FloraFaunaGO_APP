import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    lng: 'fr',
    fallbackLng: 'fr',

    // have a common namespace used around the full app
    ns: ['translationsNS'],
    defaultNS: 'translationsNS',

    debug: false,

    interpolation: {
      escapeValue: false, 
    },

    resources: { fr: { translationsNS: {} } },
  });

export default i18n;