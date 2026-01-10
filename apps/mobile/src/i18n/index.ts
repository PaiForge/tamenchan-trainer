import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ja, en } from "@tamenchan-trainer/i18n";

const LANGUAGE_STORAGE_KEY = "user-language";

export const SUPPORTED_LANGUAGES = ["ja", "en"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const resources = {
  ja: { translation: ja },
  en: { translation: en },
};

/**
 * i18nを初期化する
 */
export async function initI18n(): Promise<void> {
  const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  const locales = Localization.getLocales();
  const deviceLanguage = locales[0]?.languageCode ?? "ja";

  const isSupportedLanguage = (lang: string): lang is SupportedLanguage => {
    return lang === "ja" || lang === "en";
  };

  const fallbackLanguage: SupportedLanguage = isSupportedLanguage(
    deviceLanguage,
  )
    ? deviceLanguage
    : "ja";

  const initialLanguage =
    (savedLanguage !== null && isSupportedLanguage(savedLanguage)
      ? savedLanguage
      : null) ?? fallbackLanguage;

  await i18n.use(initReactI18next).init({
    resources,
    lng: initialLanguage,
    fallbackLng: "ja",
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: "v4",
  });
}

/**
 * 言語を変更する
 */
export async function changeLanguage(
  language: SupportedLanguage,
): Promise<void> {
  await i18n.changeLanguage(language);
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

export { i18n };
