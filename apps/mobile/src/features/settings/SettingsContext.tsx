import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Suupai } from "../../types";
import { changeLanguage, type SupportedLanguage } from "../../i18n";

export type Theme = "navy" | "green";
export type PreferredSuit = Suupai | "random";

interface SettingsContextType {
  readonly theme: Theme;
  readonly preferredSuit: PreferredSuit;
  readonly language: SupportedLanguage;
  readonly setTheme: (theme: Theme) => Promise<void>;
  readonly setPreferredSuit: (suit: PreferredSuit) => Promise<void>;
  readonly setLanguage: (language: SupportedLanguage) => Promise<void>;
  readonly isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

const SETTINGS_STORAGE_KEY = "@tamenchan_settings";

interface StoredSettings {
  readonly theme?: Theme;
  readonly preferredSuit?: PreferredSuit;
  readonly language?: SupportedLanguage;
}

const DEFAULT_SETTINGS: Required<StoredSettings> = {
  theme: "navy",
  preferredSuit: "random",
  language: "ja",
};

/**
 * 設定コンテキストにアクセスするためのフック
 */
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

interface SettingsProviderProps {
  readonly children: ReactNode;
}

/**
 * 設定コンテキストのプロバイダーコンポーネント
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_SETTINGS.theme);
  const [preferredSuit, setPreferredSuitState] = useState<PreferredSuit>(
    DEFAULT_SETTINGS.preferredSuit,
  );
  const [language, setLanguageState] = useState<SupportedLanguage>(
    DEFAULT_SETTINGS.language,
  );
  const [isLoading, setIsLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (jsonValue != null) {
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          const settings = JSON.parse(jsonValue) as StoredSettings;
          setThemeState(settings.theme ?? DEFAULT_SETTINGS.theme);
          setPreferredSuitState(
            settings.preferredSuit ?? DEFAULT_SETTINGS.preferredSuit,
          );
          setLanguageState(settings.language ?? DEFAULT_SETTINGS.language);
        }
      } catch (e) {
        console.error("Failed to load settings", e);
      } finally {
        setIsLoading(false);
      }
    };

    void loadSettings();
  }, []);

  const saveSettings = async (newSettings: StoredSettings) => {
    try {
      const currentSettings = { theme, preferredSuit, language };
      const updatedSettings = { ...currentSettings, ...newSettings };
      await AsyncStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(updatedSettings),
      );
    } catch (e) {
      console.error("Failed to save settings", e);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    await saveSettings({ theme: newTheme });
  };

  const setPreferredSuit = async (newSuit: PreferredSuit) => {
    setPreferredSuitState(newSuit);
    await saveSettings({ preferredSuit: newSuit });
  };

  const setLanguage = async (newLanguage: SupportedLanguage) => {
    setLanguageState(newLanguage);
    await changeLanguage(newLanguage);
    await saveSettings({ language: newLanguage });
  };

  return (
    <SettingsContext.Provider
      value={{
        theme,
        preferredSuit,
        language,
        setTheme,
        setPreferredSuit,
        setLanguage,
        isLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
