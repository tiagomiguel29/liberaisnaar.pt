export const darkThemeOptions = {
  palette: {
    mode: "dark",
    background: {
      default: "hsl(0, 0%, 3.9%)", // --background in dark mode
      paper: "hsl(0, 0%, 3.9%)", // --card or --popover in dark mode
    },
    text: {
      primary: "hsl(0, 0%, 98%)", // --foreground or --card-foreground in dark mode
      secondary: "hsl(0, 0%, 98%)", // --secondary-foreground
      disabled: "hsl(0, 0%, 63.9%)", // --muted-foreground in dark mode
    },
    primary: {
      main: "hsl(204, 100%, 28%)", // --primary
      light: "hsl(204, 100%, 38%)", // --primary-light
      dark: "hsl(204, 100%, 18%)", // --primary-dark
      contrastText: "hsl(0, 0%, 9%)", // --primary-foreground in dark mode
    },
    secondary: {
      main: "hsl(0, 0%, 14.9%)", // --secondary
      light: "hsl(0, 0%, 20%)", // --secondary-light
      dark: "hsl(0, 0%, 9%)", // --secondary-dark
      contrastText: "hsl(0, 0%, 98%)", // --secondary-foreground
    },
    error: {
      main: "rgb(239, 68, 68)", // --destructive
      contrastText: "hsl(0, 0%, 98%)", // --destructive-foreground
    },
    divider: "hsl(0, 0%, 14.9%)", // --border in dark mode
    action: {
      disabledBackground: "hsl(0, 0%, 14.9%)", // --muted in dark mode
      hover: "hsl(0, 0%, 83.1%)", // --ring in dark mode
    },
    info: {
      main: "hsl(0, 0%, 9%)",
    },
    warning: {
      //main: "hsl(220, 70%, 50%)",
      main: "hsl(12, 76%, 61%)",
    },
    success: {
      main: "rgb(34, 197, 94)",
    },
  },
};
