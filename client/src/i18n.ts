import i18next from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
const isDevelopment = process.env.NODE_ENV === "development";
const namespaces = [
  "common",
  "landing",
  "dashboard",
  "settings",
  "auth",
  "validation",
  "game",
  "game_mode",
  "level_farming",
  "checkout_page",
  "payment",
  "datatable",
  "profile",
  "follow_partners_page",
  "partner_page",
  "settings_page",
  "boost_page",
  "supports_page",
  "partners_page",
  "manage_users_page",
  "manage_boost_page",
  "manage_reports_page",
  "admin_settings_page",
  "notifications_page",
  "promo_codes",
];
i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    ns: namespaces,
    defaultNS: "common",
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    debug: isDevelopment,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["queryString", "cookie", "localStorage", "navigator"],
      caches: ["localStorage"], 
    },
    lng: localStorage.getItem("i18nextLng") || "en",
  });
export default i18next;
