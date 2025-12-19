// src/components/common/LoadingSpinner.tsx
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, ViewStyle } from 'react-native';
import { Sizes } from '@/src/constants';
import { useThemeColors } from '@/src/hooks/useThemeColors';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  text?: string;
  style?: ViewStyle;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'large', text, style }) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={colors.primary} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof useThemeColors>) => StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Sizes.spacing.lg,
  },
  text: {
    marginTop: Sizes.spacing.md,
    fontSize: Sizes.fontSize.md,
    color: colors.textSecondary,
  },
});
