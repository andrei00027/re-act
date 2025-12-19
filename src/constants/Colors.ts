// src/constants/Colors.ts

// Light theme palette
const lightColors = {
  // Основной (Индиго)
  primary: '#3949AB',
  primaryLight: '#6573C3',
  primaryDark: '#2832A0',
  primaryForeground: '#FFFFFF',

  // Акцент (Бирюзовый)
  accent: '#26C6DA',
  accentLight: '#4DD0E1',
  accentDark: '#00ACC1',
  accentForeground: '#FFFFFF',

  // Успех (Зеленый)
  success: '#66BB6A',
  successLight: '#81C784',
  successDark: '#4CAF50',
  successForeground: '#FFFFFF',

  // Дополнительные
  error: '#EF5350',
  warning: '#FFA726',
  info: '#42A5F5',

  // Нейтральные
  background: '#F5F5F5',
  surface: '#FFFFFF',
  surfaceSecondary: '#F0F0F0',
  white: '#FFFFFF',
  black: '#000000',
  text: '#212121',
  textSecondary: '#757575',
  textDisabled: '#BDBDBD',
  border: '#E0E0E0',
  divider: '#EEEEEE',

  // Дополнительные цвета для графиков
  secondary: '#26C6DA',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
};

// Dark theme palette
const darkColors = {
  // Основной (Индиго) - более яркий для тёмной темы
  primary: '#7986CB',
  primaryLight: '#9FA8DA',
  primaryDark: '#5C6BC0',
  primaryForeground: '#FFFFFF',

  // Акцент (Бирюзовый)
  accent: '#4DD0E1',
  accentLight: '#80DEEA',
  accentDark: '#26C6DA',
  accentForeground: '#000000',

  // Успех (Зеленый)
  success: '#81C784',
  successLight: '#A5D6A7',
  successDark: '#66BB6A',
  successForeground: '#000000',

  // Дополнительные
  error: '#EF5350',
  warning: '#FFB74D',
  info: '#64B5F6',

  // Нейтральные
  background: '#121212',
  surface: '#1E1E1E',
  surfaceSecondary: '#2C2C2C',
  white: '#FFFFFF',
  black: '#000000',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textDisabled: '#6B6B6B',
  border: '#3D3D3D',
  divider: '#2C2C2C',

  // Дополнительные цвета для графиков
  secondary: '#4DD0E1',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',
};

export type ThemeColors = typeof lightColors;

// Get colors for a specific theme
export const getThemeColors = (theme: 'light' | 'dark'): ThemeColors => {
  return theme === 'dark' ? darkColors : lightColors;
};

// Default export for backwards compatibility (light theme)
export const Colors = lightColors;

// Export both palettes
export const LightColors = lightColors;
export const DarkColors = darkColors;
