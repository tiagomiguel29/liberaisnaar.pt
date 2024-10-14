// app/ThemeContext.tsx
"use client";

import {
  createContext,
  useMemo,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "../theme";
import { useTheme as useNextTheme } from "next-themes";
import useMediaQuery from "@mui/material/useMediaQuery";

interface ThemeContextType {
  toggleTheme: () => void;
  mode: "system" | "light" | "dark";
  setMode: (mode: "system" | "light" | "dark") => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const { setTheme, resolvedTheme } = useNextTheme();

  const [mode, setMode] = useState<"system" | "light" | "dark">("system");

  const handleSetMode = (newMode: "system" | "light" | "dark") => {
    setMode(newMode);
    localStorage.setItem("theme", newMode); // Store the theme in local storage
  };

  const currentTheme = useMemo(() => {
    if (resolvedTheme === "dark") {
      return darkTheme;
    } 

    return lightTheme;
  }, [resolvedTheme]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        toggleTheme: () => setTheme(mode),
        mode,
        setMode: handleSetMode,
      }}
    >
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
