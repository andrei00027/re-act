import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getThemeColors, ThemeColors } from '../constants/Colors';

/**
 * Hook to get the current theme colors.
 * Automatically updates when theme changes.
 */
export const useThemeColors = (): ThemeColors => {
  const { resolvedTheme } = useTheme();

  const colors = useMemo(() => {
    return getThemeColors(resolvedTheme);
  }, [resolvedTheme]);

  return colors;
};

/**
 * Hook to get the current theme state and colors together.
 * Useful when you need both the theme mode and colors.
 */
export const useThemeWithColors = () => {
  const theme = useTheme();
  const colors = useThemeColors();

  return {
    ...theme,
    colors,
  };
};

export default useThemeColors;
