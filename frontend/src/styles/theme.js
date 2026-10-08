import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D6B',
      light: '#5AA99C',
      dark: '#1F5B4E',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F4A261',
      light: '#F7B884',
      dark: '#E8924A',
      contrastText: '#000000',
    },
    tertiary: {
      main: '#E76F51',
      light: '#ED8F7A',
      dark: '#D64D2E',
      contrastText: '#ffffff',
    },
    background: {
      default: '#FEFEFE',
      paper: '#FFFFFF',
      accent: '#F8F9FA',
    },
    text: {
      primary: '#2C3E50',
      secondary: '#5D6D7E',
      disabled: '#BDC3C7',
    },
    success: {
      main: '#27AE60',
      light: '#52C882',
      dark: '#1E8449',
    },
    warning: {
      main: '#F39C12',
      light: '#F5B041',
      dark: '#D68910',
    },
    error: {
      main: '#E74C3C',
      light: '#EC7063',
      dark: '#C0392B',
    },
    info: {
      main: '#3498DB',
      light: '#5DADE2',
      dark: '#2980B9',
    },
  },
  typography: {
    fontFamily: [
      'Poppins',
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.00735em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0em',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.0075em',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.75,
      letterSpacing: '0.00938em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
      letterSpacing: '0.00714em',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0.01071em',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.75,
      letterSpacing: '0.02857em',
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.66,
      letterSpacing: '0.03333em',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 2.66,
      letterSpacing: '0.08333em',
      textTransform: 'uppercase',
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.08), 0px 1px 2px rgba(0, 0, 0, 0.12)',
    '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 2px 4px rgba(0, 0, 0, 0.12)',
    '0px 4px 8px rgba(0, 0, 0, 0.08), 0px 2px 4px rgba(0, 0, 0, 0.12)',
    '0px 8px 16px rgba(0, 0, 0, 0.08), 0px 4px 8px rgba(0, 0, 0, 0.12)',
    '0px 12px 24px rgba(0, 0, 0, 0.08), 0px 6px 12px rgba(0, 0, 0, 0.12)',
    '0px 16px 32px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.12)',
    '0px 20px 40px rgba(0, 0, 0, 0.08), 0px 10px 20px rgba(0, 0, 0, 0.12)',
    '0px 24px 48px rgba(0, 0, 0, 0.08), 0px 12px 24px rgba(0, 0, 0, 0.12)',
    '0px 32px 64px rgba(0, 0, 0, 0.08), 0px 16px 32px rgba(0, 0, 0, 0.12)',
    '0px 40px 80px rgba(0, 0, 0, 0.08), 0px 20px 40px rgba(0, 0, 0, 0.12)',
    '0px 48px 96px rgba(0, 0, 0, 0.08), 0px 24px 48px rgba(0, 0, 0, 0.12)',
    '0px 56px 112px rgba(0, 0, 0, 0.08), 0px 28px 56px rgba(0, 0, 0, 0.12)',
    '0px 64px 128px rgba(0, 0, 0, 0.08), 0px 32px 64px rgba(0, 0, 0, 0.12)',
    '0px 72px 144px rgba(0, 0, 0, 0.08), 0px 36px 72px rgba(0, 0, 0, 0.12)',
    '0px 80px 160px rgba(0, 0, 0, 0.08), 0px 40px 80px rgba(0, 0, 0, 0.12)',
    '0px 88px 176px rgba(0, 0, 0, 0.08), 0px 44px 88px rgba(0, 0, 0, 0.12)',
    '0px 96px 192px rgba(0, 0, 0, 0.08), 0px 48px 96px rgba(0, 0, 0, 0.12)',
    '0px 104px 208px rgba(0, 0, 0, 0.08), 0px 52px 104px rgba(0, 0, 0, 0.12)',
    '0px 112px 224px rgba(0, 0, 0, 0.08), 0px 56px 112px rgba(0, 0, 0, 0.12)',
    '0px 120px 240px rgba(0, 0, 0, 0.08), 0px 60px 120px rgba(0, 0, 0, 0.12)',
    '0px 128px 256px rgba(0, 0, 0, 0.08), 0px 64px 128px rgba(0, 0, 0, 0.12)',
    '0px 136px 272px rgba(0, 0, 0, 0.08), 0px 68px 136px rgba(0, 0, 0, 0.12)',
    '0px 144px 288px rgba(0, 0, 0, 0.08), 0px 72px 144px rgba(0, 0, 0, 0.12)',
    '0px 152px 304px rgba(0, 0, 0, 0.08), 0px 76px 152px rgba(0, 0, 0, 0.12)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 24px',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #2E7D6B 0%, #5AA99C 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1F5B4E 0%, #2E7D6B 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.08), 0px 2px 4px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
  },
});

export { theme };