"use client";

import { createTheme as createMuiTheme, useColorScheme } from "@mui/material";
import { baseThemeOptions } from "./base-theme";
import { darkThemeOptions } from "./dark-theme";
import { lightThemeOptions } from "./light-theme";

export const lightTheme = createMuiTheme(
  baseThemeOptions as any,
  lightThemeOptions
);

export const darkTheme = createMuiTheme(
  baseThemeOptions as any,
  darkThemeOptions
);
