import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import 'react-native-reanimated';
import '@/src/i18n';

import { ThemeProvider, useTheme } from '@/src/context/ThemeContext';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { HabitsProvider } from '@/src/context/HabitsContext';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import AuthScreen from '@/src/screens/AuthScreen';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const { resolvedTheme, isDark } = useTheme();
  const colors = useThemeColors();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HabitsProvider>
          <AppContent />
        </HabitsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
