import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import uz_latn from "./translations/uz_latn.json";
import uz_kyrl from "./translations/uz_kyrl.json";
import ru from "./translations/ru.json";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
    uz_kyrl: {
        translation: uz_kyrl,
    },
    uz_latn: {
        translation: uz_latn,
    },
    ru: {
        translation: ru,
    },
};

export type TLanguages = "uz_kyrl" | "uz_latn" | "ru";

i18n.use(initReactI18next).init({
    resources,
    lng: "ru",
    interpolation: {
        escapeValue: false, // react already safes from xss
    },
});

export default i18n;
