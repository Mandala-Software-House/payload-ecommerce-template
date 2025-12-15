"use client";

import { createContext, type ReactNode, useCallback, useContext, useState } from "react";

import canUseDOM from "@/utilities/canUseDOM";

import { defaultTheme, getImplicitPreference, themeLocalStorageKey } from "./shared";
import { themeIsValid, type Theme, type ThemeContextType } from "./types";

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: "light",
};

const ThemeContext = createContext(initialContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme] = useState<Theme | undefined>(() => {
    if (!canUseDOM) return defaultTheme;

    // Initialize theme from localStorage or implicit preference
    let themeToSet: Theme = defaultTheme;
    const preference = window.localStorage.getItem(themeLocalStorageKey);

    if (themeIsValid(preference)) {
      themeToSet = preference;
    } else {
      const implicitPreference = getImplicitPreference();
      if (implicitPreference) {
        themeToSet = implicitPreference;
      }
    }

    document.documentElement.setAttribute("data-theme", themeToSet);
    return themeToSet;
  });

  const setTheme = useCallback((_themeToSet: Theme | null) => {
    return;
    // if (themeToSet === null) {
    //   window.localStorage.removeItem(themeLocalStorageKey);
    //   const implicitPreference = getImplicitPreference();
    //   document.documentElement.setAttribute("data-theme", implicitPreference || "");
    //   if (implicitPreference) setThemeState(implicitPreference);
    // } else {
    //   setThemeState(themeToSet);
    //   window.localStorage.setItem(themeLocalStorageKey, themeToSet);
    //   document.documentElement.setAttribute("data-theme", themeToSet);
    // }
  }, []);

  return <ThemeContext.Provider value={{ setTheme, theme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => useContext(ThemeContext);
