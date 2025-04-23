import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#8A2BE2',
    accent: '#f1c40f',
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'Poppins-Regular',
    },
    medium: {
      fontFamily: 'Poppins-Medium',
    },
    light: {
      fontFamily: 'Poppins-Light',
    },
    thin: {
      fontFamily: 'Poppins-Light',
    },
  },
  // Add specific font configurations for React Native Paper
  typescale: {
    displayLarge: {
      fontFamily: 'Poppins-Regular',
      fontSize: 57,
      lineHeight: 64,
      letterSpacing: -0.25,
    },
    displayMedium: {
      fontFamily: 'Poppins-Regular',
      fontSize: 45,
      lineHeight: 52,
    },
    displaySmall: {
      fontFamily: 'Poppins-Regular',
      fontSize: 36,
      lineHeight: 44,
    },
    headlineLarge: {
      fontFamily: 'Poppins-Regular',
      fontSize: 32,
      lineHeight: 40,
    },
    headlineMedium: {
      fontFamily: 'Poppins-Regular',
      fontSize: 28,
      lineHeight: 36,
    },
    headlineSmall: {
      fontFamily: 'Poppins-Regular',
      fontSize: 24,
      lineHeight: 32,
    },
    titleLarge: {
      fontFamily: 'Poppins-Regular',
      fontSize: 22,
      lineHeight: 28,
    },
    titleMedium: {
      fontFamily: 'Poppins-Medium',
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.15,
    },
    titleSmall: {
      fontFamily: 'Poppins-Medium',
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0.1,
    },
    labelLarge: {
      fontFamily: 'Poppins-Medium',
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0.1,
    },
    labelMedium: {
      fontFamily: 'Poppins-Medium',
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.5,
    },
    labelSmall: {
      fontFamily: 'Poppins-Medium',
      fontSize: 11,
      lineHeight: 16,
      letterSpacing: 0.5,
    },
    bodyLarge: {
      fontFamily: 'Poppins-Regular',
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.15,
    },
    bodyMedium: {
      fontFamily: 'Poppins-Regular',
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0.25,
    },
    bodySmall: {
      fontFamily: 'Poppins-Regular',
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.4,
    },
  },
}; 