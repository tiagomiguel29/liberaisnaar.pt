export const lightThemeOptions = {
  palette: {
    background: {
      default: "hsl(0, 0%, 100%)", // --background
      paper: "hsl(0, 0%, 100%)", // --card or --popover
    },
    text: {
      primary: "hsl(0, 0%, 3.9%)", // --foreground or --card-foreground
      secondary: "hsl(0, 0%, 9%)", // --secondary-foreground
      disabled: "hsl(0, 0%, 45.1%)", // --muted-foreground
    },
    primary: {
      main: "hsl(204, 100%, 28%)", // --primary
      contrastText: "hsl(0, 0%, 98%)", // --primary-foreground
    },
    secondary: {
      main: "hsl(0, 0%, 96.1%)", // --secondary
      contrastText: "hsl(0, 0%, 9%)", // --secondary-foreground
    },
    error: {
      main: "rgb(239, 68, 68)", // --destructive
      contrastText: "hsl(0, 0%, 98%)", // --destructive-foreground
    },
    divider: "hsl(0, 0%, 89.8%)", // --border
    action: {
      disabledBackground: "hsl(0, 0%, 96.1%)", // --muted
      hover: "hsl(0, 0%, 89.8%)", // --input
    },
    info: {
      main: "hsl(0, 0%, 9%)",
    },
    warning: {
      main: "hsl(12, 76%, 61%)", // --chart-1
    },
    success: {
      main: "rgb(34, 197, 94)", // --chart-2
    },
  },
};
