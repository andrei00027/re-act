// src/constants/Sizes.ts
// Responsive sizing system for consistent UI across iOS devices
// Uses Scale.ts for proportional scaling based on iPhone 14 base design

import { fontScale, scale } from './Scale';

export const Sizes = {
  spacing: {
    xs: scale(4),
    sm: scale(8),
    md: scale(16),
    lg: scale(24),
    xl: scale(32),
    xxl: scale(40),
  },

  borderRadius: {
    sm: scale(4),
    md: scale(8),
    lg: scale(12),
    xl: scale(16),
    xxl: scale(20),
    full: 9999, // Stays constant for perfect circles
  },

  fontSize: {
    xs: fontScale(10),
    sm: fontScale(12),
    md: fontScale(14),
    lg: fontScale(16),
    xl: fontScale(18),
    xxl: fontScale(24),
    xxxl: fontScale(32),
  },

  // Система теней для консистентности (scaled)
  shadow: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: scale(1) },
      shadowOpacity: 0.05,
      shadowRadius: scale(2),
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: scale(2) },
      shadowOpacity: 0.1,
      shadowRadius: scale(4),
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: scale(4) },
      shadowOpacity: 0.15,
      shadowRadius: scale(8),
      elevation: 4,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: scale(8) },
      shadowOpacity: 0.2,
      shadowRadius: scale(16),
      elevation: 8,
    },
  },

  // Веса шрифтов для консистентности (не масштабируются)
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};
