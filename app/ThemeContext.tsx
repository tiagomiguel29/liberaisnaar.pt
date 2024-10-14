// app/ThemeContext.tsx
'use client';

import { createContext, useMemo, ReactNode, useContext, useEffect, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from '../theme';
import { useTheme as useNextTheme } from 'next-themes';
import useMediaQuery from '@mui/material/useMediaQuery';

interface ThemeContextType {
  toggleTheme: () => void;
  mode: 'system' | 'light' | 'dark';
  setMode: (mode: 'system' | 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const { theme, setTheme, resolvedTheme } = useNextTheme();

  const [mode, setMode] = useState<'system' | 'light' | 'dark'>(theme as 'system' | 'light' | 'dark');

  // Check the system's preference for dark mode
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const handleSetMode = (newMode: 'system' | 'light' | 'dark') => {
    setMode(newMode);
    setTheme(newMode);
  };

  const currentTheme = useMemo(() => {
    if (mode === 'system') {
      return prefersDarkMode ? darkTheme : lightTheme;
    }
    return mode === 'light' ? lightTheme : darkTheme;
  }, [mode, prefersDarkMode]);

  return (
    <ThemeContext.Provider value={{ toggleTheme: () => setTheme(mode), mode, setMode: handleSetMode }}>
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
