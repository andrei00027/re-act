// src/constants/Scale.ts
// Responsive scaling utility for consistent UI across iOS devices
// Base design: iPhone 14 (375x812)

import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Base design dimensions (iPhone 14)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

// Calculate scale factors
const widthScale = width / BASE_WIDTH;
const heightScale = height / BASE_HEIGHT;

// Bounded general scale (0.85x for small phones - 1.3x for tablets)
export const SCALE_FACTOR = Math.min(1.3, Math.max(0.85, widthScale));

// Conservative font scale (0.9x - 1.2x) for better readability
export const FONT_SCALE_FACTOR = Math.min(1.2, Math.max(0.9, widthScale));

/**
 * Scale a value proportionally based on screen width
 * Used for spacing, margins, padding, and element sizes
 * @param size - Base size in pixels (designed for iPhone 14)
 * @returns Scaled size rounded to nearest integer
 */
export const scale = (size: number): number => Math.round(size * SCALE_FACTOR);

/**
 * Scale font size with conservative bounds for readability
 * @param size - Base font size in pixels
 * @returns Scaled font size rounded to nearest integer
 */
export const fontScale = (size: number): number => Math.round(size * FONT_SCALE_FACTOR);

/**
 * Moderate scale with adjustable factor for fine-tuning
 * @param size - Base size in pixels
 * @param factor - How much of the scale difference to apply (0-1, default 0.5)
 * @returns Moderately scaled size
 */
export const moderateScale = (size: number, factor = 0.5): number =>
    Math.round(size + (SCALE_FACTOR - 1) * size * factor);

/**
 * Scale vertical dimensions based on height ratio
 * Useful for elements that should scale with screen height
 * @param size - Base size in pixels
 * @returns Height-scaled size
 */
export const verticalScale = (size: number): number => {
    const verticalFactor = Math.min(1.3, Math.max(0.85, heightScale));
    return Math.round(size * verticalFactor);
};

// Export screen dimensions for components that need them
export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;
export const IS_SMALL_DEVICE = width < 375;
export const IS_LARGE_DEVICE = width >= 768; // iPad threshold
