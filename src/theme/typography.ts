import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'SF Pro Display',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  // Tamaños
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  display: 38,

  // Pesos
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,

  fontFamily,
};
