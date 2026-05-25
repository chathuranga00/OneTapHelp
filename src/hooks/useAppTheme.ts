import { MD3DarkTheme, type MD3Theme } from 'react-native-paper';

import { colors } from '../constants';

export const appTheme: MD3Theme = {
  ...MD3DarkTheme,
  dark: true,
  roundness: 4,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary,
    onPrimary: colors.text,
    primaryContainer: colors.primaryDark,
    onPrimaryContainer: colors.text,
    secondary: colors.textSecondary,
    background: colors.background,
    surface: colors.surface,
    surfaceVariant: colors.surfaceElevated,
    onBackground: colors.text,
    onSurface: colors.text,
    onSurfaceVariant: colors.textSecondary,
    outline: colors.border,
    error: colors.error,
  },
};

export function useAppTheme(): MD3Theme {
  return appTheme;
}
