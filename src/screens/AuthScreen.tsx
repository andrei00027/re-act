// src/screens/AuthScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAuth } from '@/src/context/AuthContext';
import { Sizes } from '@/src/constants';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { useTheme } from '@/src/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';

type AuthMode = 'main' | 'email-signin' | 'email-signup';

export default function AuthScreen() {
  const colors = useThemeColors();
  useTheme(); // Keep hook for potential future use
  const { t } = useTranslation();
  const { signInWithApple, signInWithEmail, signUpWithEmail } = useAuth();

  const [isAppleAvailable, setIsAppleAvailable] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('main');
  const [isLoading, setIsLoading] = useState(false);

  // Email form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    if (Platform.OS === 'ios') {
      const available = await AppleAuthentication.isAvailableAsync();
      setIsAppleAvailable(available);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithApple();
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || t('auth.signInError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithEmail(email, password);
    } catch (error: any) {
      Alert.alert(t('common.error'), t(`auth.errors.${error.message}`) || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async () => {
    try {
      setIsLoading(true);
      await signUpWithEmail(email, password, fullName);
    } catch (error: any) {
      Alert.alert(t('common.error'), t(`auth.errors.${error.message}`) || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setShowPassword(false);
  };

  const styles = createStyles(colors);

  // Email Sign In Form
  if (authMode === 'email-signin') {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setAuthMode('main');
                resetForm();
              }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>

            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>{t('auth.signIn')}</Text>
              <Text style={styles.formSubtitle}>{t('auth.signInSubtitle')}</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('auth.email')}
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('auth.password')}
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
                onPress={handleEmailSignIn}
                disabled={isLoading || !email || !password}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryButtonText}>{t('auth.signIn')}</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => {
                  setAuthMode('email-signup');
                  resetForm();
                }}
              >
                <Text style={styles.linkText}>
                  {t('auth.noAccount')} <Text style={styles.linkTextBold}>{t('auth.signUp')}</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Email Sign Up Form
  if (authMode === 'email-signup') {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setAuthMode('main');
                resetForm();
              }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>

            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>{t('auth.createAccount')}</Text>
              <Text style={styles.formSubtitle}>{t('auth.createAccountSubtitle')}</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('auth.fullName')}
                  placeholderTextColor={colors.textSecondary}
                  value={fullName}
                  onChangeText={setFullName}
                  autoComplete="name"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('auth.email')}
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('auth.password')}
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.passwordHint}>{t('auth.passwordHint')}</Text>

              <TouchableOpacity
                style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
                onPress={handleEmailSignUp}
                disabled={isLoading || !email || !password}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryButtonText}>{t('auth.signUp')}</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => {
                  setAuthMode('email-signin');
                  resetForm();
                }}
              >
                <Text style={styles.linkText}>
                  {t('auth.haveAccount')} <Text style={styles.linkTextBold}>{t('auth.signIn')}</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Main Auth Screen
  return (
    <View style={styles.gradientBackground}>
      <SafeAreaView style={styles.containerTransparent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Image
              source={require('@/assets/images/splash-icon.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.titleWhite}>Re:Act</Text>
            <Text style={styles.subtitleWhite}>{t('auth.subtitle')}</Text>
          </View>

          <View style={styles.features}>
            <View style={styles.feature}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="sparkles" size={24} color="#fff" />
              </View>
              <Text style={styles.featureTextWhite}>{t('auth.feature1')}</Text>
            </View>
            <View style={styles.feature}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="bar-chart" size={24} color="#fff" />
              </View>
              <Text style={styles.featureTextWhite}>{t('auth.feature2')}</Text>
            </View>
            <View style={styles.feature}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="flame" size={24} color="#fff" />
              </View>
              <Text style={styles.featureTextWhite}>{t('auth.feature3')}</Text>
            </View>
          </View>

          <View style={styles.authButtons}>
            {/* Apple Sign In */}
            {Platform.OS === 'ios' && (
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
                cornerRadius={Sizes.borderRadius.md}
                style={styles.appleButton}
                onPress={handleAppleSignIn}
              />
            )}

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLineWhite} />
              <Text style={styles.dividerTextWhite}>{t('auth.or')}</Text>
              <View style={styles.dividerLineWhite} />
            </View>

            {/* Email Sign In */}
            <TouchableOpacity
              style={styles.emailButtonWhite}
              onPress={() => setAuthMode('email-signin')}
            >
              <Ionicons name="mail-outline" size={20} color="#3949AB" style={styles.emailIcon} />
              <Text style={styles.emailButtonTextBlue}>{t('auth.signInWithEmail')}</Text>
            </TouchableOpacity>

            {/* Create Account Link */}
            <TouchableOpacity
              style={styles.createAccountButton}
              onPress={() => setAuthMode('email-signup')}
            >
              <Text style={styles.createAccountTextWhite}>
                {t('auth.noAccount')} <Text style={styles.createAccountLinkWhite}>{t('auth.signUp')}</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {!isAppleAvailable && Platform.OS === 'ios' && (
            <View style={styles.devBadgeWhite}>
              <Text style={styles.devBadgeTextWhite}>
                {t('auth.devMode')}
              </Text>
            </View>
          )}

          <Text style={styles.footerWhite}>{t('auth.terms')}</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: Sizes.spacing.xl,
      paddingTop: Sizes.spacing.md,
    },
    content: {
      flex: 1,
      paddingHorizontal: Sizes.spacing.xl,
      justifyContent: 'center',
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Sizes.spacing.xl,
    },
    header: {
      alignItems: 'center',
      marginTop: Sizes.spacing.xxl,
      marginBottom: Sizes.spacing.xxl,
    },
    logo: {
      fontSize: 80,
      marginBottom: Sizes.spacing.lg,
    },
    title: {
      fontSize: Sizes.fontSize.xxxl,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: Sizes.spacing.sm,
    },
    subtitle: {
      fontSize: Sizes.fontSize.lg,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    features: {
      marginBottom: Sizes.spacing.xxl * 2,
    },
    feature: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Sizes.spacing.lg,
    },
    featureIcon: {
      fontSize: 32,
      marginRight: Sizes.spacing.md,
    },
    featureText: {
      fontSize: Sizes.fontSize.lg,
      color: colors.text,
    },
    authButtons: {
      gap: Sizes.spacing.md,
    },
    appleButton: {
      width: '100%',
      height: 50,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: Sizes.spacing.md,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    dividerText: {
      marginHorizontal: Sizes.spacing.md,
      color: colors.textSecondary,
      fontSize: Sizes.fontSize.sm,
    },
    emailButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderRadius: Sizes.borderRadius.md,
      height: 50,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    emailIcon: {
      marginRight: Sizes.spacing.sm,
    },
    emailButtonText: {
      fontSize: Sizes.fontSize.md,
      fontWeight: '600',
      color: colors.primary,
    },
    createAccountButton: {
      alignItems: 'center',
      paddingVertical: Sizes.spacing.md,
    },
    createAccountText: {
      fontSize: Sizes.fontSize.md,
      color: colors.textSecondary,
    },
    createAccountLink: {
      color: colors.primary,
      fontWeight: '600',
    },
    devBadge: {
      backgroundColor: colors.primary + '20',
      borderRadius: Sizes.borderRadius.md,
      padding: Sizes.spacing.md,
      marginTop: Sizes.spacing.lg,
      borderWidth: 1,
      borderColor: colors.primary + '40',
    },
    devBadgeText: {
      fontSize: Sizes.fontSize.sm,
      color: colors.primary,
      textAlign: 'center',
      fontWeight: '600',
    },
    footer: {
      fontSize: Sizes.fontSize.sm,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      marginTop: Sizes.spacing.xl,
    },
    // Form styles
    formHeader: {
      marginBottom: Sizes.spacing.xxl,
    },
    formTitle: {
      fontSize: Sizes.fontSize.xxl,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: Sizes.spacing.sm,
    },
    formSubtitle: {
      fontSize: Sizes.fontSize.md,
      color: colors.textSecondary,
    },
    form: {
      gap: Sizes.spacing.md,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: Sizes.borderRadius.md,
      paddingHorizontal: Sizes.spacing.md,
      height: 50,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputIcon: {
      marginRight: Sizes.spacing.sm,
    },
    input: {
      flex: 1,
      fontSize: Sizes.fontSize.md,
      color: colors.text,
    },
    passwordHint: {
      fontSize: Sizes.fontSize.sm,
      color: colors.textSecondary,
      marginTop: -Sizes.spacing.xs,
    },
    primaryButton: {
      backgroundColor: colors.primary,
      borderRadius: Sizes.borderRadius.md,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: Sizes.spacing.md,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    primaryButtonText: {
      fontSize: Sizes.fontSize.md,
      fontWeight: '600',
      color: '#fff',
    },
    linkButton: {
      alignItems: 'center',
      paddingVertical: Sizes.spacing.md,
    },
    linkText: {
      fontSize: Sizes.fontSize.md,
      color: colors.textSecondary,
    },
    linkTextBold: {
      color: colors.primary,
      fontWeight: '600',
    },
    // Gradient main screen styles
    gradientBackground: {
      flex: 1,
      backgroundColor: '#3949AB',
    },
    gradientContainer: {
      flex: 1,
    },
    containerTransparent: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    logoImage: {
      width: 120,
      height: 120,
      marginBottom: Sizes.spacing.md,
    },
    titleWhite: {
      fontSize: Sizes.fontSize.xxxl,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: Sizes.spacing.sm,
    },
    subtitleWhite: {
      fontSize: Sizes.fontSize.lg,
      color: 'rgba(255, 255, 255, 0.9)',
      textAlign: 'center',
    },
    featureIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Sizes.spacing.md,
    },
    featureTextWhite: {
      fontSize: Sizes.fontSize.lg,
      color: '#fff',
    },
    dividerLineWhite: {
      flex: 1,
      height: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    dividerTextWhite: {
      marginHorizontal: Sizes.spacing.md,
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: Sizes.fontSize.sm,
    },
    emailButtonWhite: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      borderRadius: Sizes.borderRadius.md,
      height: 50,
    },
    emailButtonTextBlue: {
      fontSize: Sizes.fontSize.md,
      fontWeight: '600',
      color: '#3949AB',
    },
    createAccountTextWhite: {
      fontSize: Sizes.fontSize.md,
      color: 'rgba(255, 255, 255, 0.9)',
    },
    createAccountLinkWhite: {
      color: '#fff',
      fontWeight: '600',
      textDecorationLine: 'underline',
    },
    devBadgeWhite: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: Sizes.borderRadius.md,
      padding: Sizes.spacing.md,
      marginTop: Sizes.spacing.lg,
    },
    devBadgeTextWhite: {
      fontSize: Sizes.fontSize.sm,
      color: '#fff',
      textAlign: 'center',
      fontWeight: '600',
    },
    footerWhite: {
      fontSize: Sizes.fontSize.sm,
      color: 'rgba(255, 255, 255, 0.7)',
      textAlign: 'center',
      lineHeight: 20,
      marginTop: Sizes.spacing.xl,
    },
  });
