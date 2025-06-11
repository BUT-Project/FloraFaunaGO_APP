import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import fr from "./locales/fr.json"; 
i18n
  .use(initReactI18next)
  .init({
    lng: "fr",             // force le français
    fallbackLng: "fr",     // si une clé est manquante
    resources: {
      fr: { translation: fr }
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;