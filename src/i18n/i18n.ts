// src/i18n/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";  // adjust path if needed
import ar from "./ar.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: "en",              // default language
    fallbackLng: "en",      // fallback if key missing
    interpolation: {
      escapeValue: false,   // react already escapes
    },
  });

export default i18n;
