// src/components/common/Toast.tsx
import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { Sizes } from '@/src/constants';
import { useThemeColors } from '@/src/hooks/useThemeColors';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  visible,
  onHide,
  duration = 1000
}) => {
  const colors = useThemeColors();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    const hideToast = () => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide();
      });
    };

    if (visible) {
      // Показать toast
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      // Автоматически скрыть через duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      hideToast();
    }
  }, [visible, duration, fadeAnim, translateY, onHide]);

  if (!visible) {
    return null;
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return colors.success;
      case 'error':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      default:
        return 'ℹ';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.icon}>{getIcon()}</Text>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: Sizes.spacing.md,
    right: Sizes.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.lg,
    zIndex: 9999,
    ...Sizes.shadow.lg,
  },
  icon: {
    fontSize: 20,
    color: '#FFFFFF',
    marginRight: Sizes.spacing.sm,
    fontWeight: 'bold',
  },
  message: {
    flex: 1,
    fontSize: Sizes.fontSize.lg,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
