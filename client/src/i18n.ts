import i18next from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    lng: localStorage.getItem("i18nextLng") || "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["queryString", "cookie", "localStorage", "navigator"],
      caches: ["localStorage"], // Lưu ngôn ngữ vào localStorage
    },
  });

export default i18next;
