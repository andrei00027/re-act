import { Sizes } from '@/src/constants';
import { useAuth } from '@/src/context/AuthContext';
import { useHabits } from '@/src/context/HabitsContext';
import { THEME_OPTIONS, ThemeMode, useTheme } from '@/src/context/ThemeContext';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { changeLanguage, LanguageCode, SUPPORTED_LANGUAGES } from '@/src/i18n';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Linking, Modal, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon, { IconName } from 'react-native-remix-icon';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const colors = useThemeColors();
  const { themeMode, setThemeMode } = useTheme();
  const { syncWithCloud, isSyncing, lastSyncTime, checkHealthKitGoals } = useHabits();
  const { user, signOut, deleteAccount } = useAuth();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);



  const handleLanguageChange = async (langCode: LanguageCode) => {
    try {
      await changeLanguage(langCode);
      setLanguageModalVisible(false);
    } catch {
      Alert.alert(t('common.error'), t('errors.generic'));
    }
  };

  const handleThemeChange = async (mode: ThemeMode) => {
    try {
      await setThemeMode(mode);
      setThemeModalVisible(false);
    } catch {
      Alert.alert(t('common.error'), t('errors.generic'));
    }
  };

  const getCurrentLanguageName = () => {
    const currentLang = SUPPORTED_LANGUAGES.find(lang => lang.code === i18n.language);
    return currentLang?.nativeName || 'English';
  };

  const getCurrentThemeName = () => {
    const currentTheme = THEME_OPTIONS.find(opt => opt.value === themeMode);
    return currentTheme ? t(currentTheme.labelKey) : t('profile.themeSystem');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('profile.deleteAccount'),
      t('profile.deleteAccountConfirm'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
            } catch {
              Alert.alert(t('common.error'), t('errors.generic'));
            }
          },
        },
      ]
    );
  };

  const handleAbout = () => {
    setAboutModalVisible(true);
  };

  const openURL = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert(t('common.error'), t('errors.generic'));
    });
  };

  const handleSignOut = () => {
    Alert.alert(
      t('profile.signOut'),
      t('profile.signOutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.signOut'),
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch {
              Alert.alert(t('common.error'), t('errors.generic'));
            }
          },
        },
      ]
    );
  };

  const handleSync = async () => {
    if (Platform.OS !== 'ios') {
      Alert.alert(t('profile.unavailableIOS'), t('profile.iCloudUnavailable'));
      return;
    }

    const result = await syncWithCloud();
    if (result.success) {
      Alert.alert(t('common.success'), t('profile.iCloudSyncSuccess'));
    } else {
      Alert.alert(
        t('profile.iCloudSyncError'),
        result.error || t('profile.iCloudSyncErrorMessage')
      );
    }
  };

  const handleCheckHealthGoals = async () => {
    if (Platform.OS !== 'ios') {
      Alert.alert(t('profile.unavailableIOS'), t('profile.healthUnavailable'));
      return;
    }

    try {
      const updated = await checkHealthKitGoals();
      if (updated && updated.length > 0) {
        const names = updated.map((h: any) => `• ${h.name}`).join('\n');
        Alert.alert(
          t('profile.healthCheckTitle'),
          t('profile.healthCheckSuccess', { habits: names })
        );
      } else {
        Alert.alert(t('common.success'), t('profile.healthCheckNoData'));
      }
    } catch {
      Alert.alert(t('common.error'), t('profile.healthCheckError'));
    }
  };

  const formatSyncTime = (date: Date | null) => {
    if (!date) return t('profile.never');
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return t('profile.justNow');
    if (minutes < 60) return t('profile.minutesAgo', { count: minutes });
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return t('profile.hoursAgo', { count: hours });
    const days = Math.floor(hours / 24);
    return t('profile.daysAgo', { count: days });
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('profile.settingsTitle')}</Text>
      </View>

      <View style={styles.content}>

        {/* Настройки */}
        <View style={styles.section}>

          {/* Выбор темы */}
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setThemeModalVisible(true)}
          >
            <Icon name="palette-fill" size={24} color={colors.primary} style={{ marginRight: Sizes.spacing.md }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.settingText}>{t('profile.theme')}</Text>
              <Text style={styles.settingSubtext}>{getCurrentThemeName()}</Text>
            </View>

          </TouchableOpacity>

          {/* Выбор языка */}
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setLanguageModalVisible(true)}
          >
            <Icon name="global-fill" size={24} color={colors.primary} style={{ marginRight: Sizes.spacing.md }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.settingText}>{t('profile.language')}</Text>
              <Text style={styles.settingSubtext}>{getCurrentLanguageName()}</Text>
            </View>

          </TouchableOpacity>

          {/* iCloud синхронизация */}
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleSync}
              disabled={isSyncing}
            >
              <Icon name="cloud-fill" size={24} color={colors.primary} style={{ marginRight: Sizes.spacing.md }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.settingText}>{t('profile.syncWithICloud')}</Text>
                <Text style={styles.settingSubtext}>
                  {t('profile.iCloudLastSync', { time: formatSyncTime(lastSyncTime) })}
                </Text>
              </View>
              {isSyncing && (
                <ActivityIndicator size="small" color={colors.primary} />
              )}
            </TouchableOpacity>
          )}

          {/* Apple Health интеграция */}
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleCheckHealthGoals}
            >
              <Icon name="heart-pulse-fill" size={24} color={colors.error} style={{ marginRight: Sizes.spacing.md }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.settingText}>{t('profile.health')}</Text>
                <Text style={styles.settingSubtext}>
                  {t('profile.connectHealth')}
                </Text>
              </View>

            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.settingItem} onPress={handleAbout}>
            <Icon name="information-fill" size={24} color={colors.primary} style={{ marginRight: Sizes.spacing.md }} />
            <Text style={styles.settingText}>{t('profile.about')}</Text>

          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleDeleteAccount}>
            <Icon name="delete-bin-fill" size={24} color={colors.error} style={{ marginRight: Sizes.spacing.md }} />
            <Text style={[styles.settingText, styles.settingTextDanger]}>{t('profile.deleteAccount')}</Text>

          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleSignOut}>
            <Icon name="logout-box-r-fill" size={24} color={colors.error} style={{ marginRight: Sizes.spacing.md }} />
            <Text style={[styles.settingText, styles.settingTextDanger]}>{t('profile.signOut')}</Text>

          </TouchableOpacity>
        </View>

        {/* Версия приложения */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('profile.version')}</Text>
          <Text style={styles.footerSubtext}>{t('profile.madeWithLove')}</Text>
        </View>
      </View>

      {/* Theme Selection Modal */}
      <Modal
        visible={themeModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setThemeModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('profile.selectTheme')}</Text>
            {THEME_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.themeOption,
                  themeMode === option.value && styles.themeOptionSelected,
                ]}
                onPress={() => handleThemeChange(option.value)}
              >
                <Icon
                  name={option.icon as IconName}
                  size={24}
                  color={themeMode === option.value ? colors.primary : colors.textSecondary}
                  style={{ marginRight: Sizes.spacing.md }}
                />
                <Text
                  style={[
                    styles.themeOptionText,
                    themeMode === option.value && styles.themeOptionTextSelected,
                  ]}
                >
                  {t(option.labelKey)}
                </Text>
                {themeMode === option.value && (
                  <Icon name="check-line" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setThemeModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Language Selection Modal */}
      <Modal
        visible={languageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setLanguageModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('profile.selectLanguage')}</Text>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  i18n.language === lang.code && styles.languageOptionSelected,
                ]}
                onPress={() => handleLanguageChange(lang.code)}
              >
                <Text
                  style={[
                    styles.languageOptionText,
                    i18n.language === lang.code && styles.languageOptionTextSelected,
                  ]}
                >
                  {lang.nativeName}
                </Text>
                {i18n.language === lang.code && (
                  <Icon name="check-line" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setLanguageModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* About Modal */}
      <Modal
        visible={aboutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAboutModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setAboutModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Re:Act</Text>
            <Text style={styles.aboutDescription}>{t('profile.aboutDescription')}</Text>

            <View style={styles.aboutLinks}>
              <TouchableOpacity
                style={styles.aboutLink}
                onPress={() => openURL('https://architeq.io/solutions/mobile/react/terms')}
              >
                <Icon name="file-text-line" size={20} color={colors.primary} />
                <Text style={styles.aboutLinkText}>{t('profile.termsOfUse')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.aboutLink}
                onPress={() => openURL('https://architeq.io/solutions/mobile/react/policy')}
              >
                <Icon name="shield-check-line" size={20} color={colors.primary} />
                <Text style={styles.aboutLinkText}>{t('profile.privacyPolicy')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.aboutLink}
                onPress={() => openURL('https://architeq.io/solutions/mobile/react')}
              >
                <Icon name="global-line" size={20} color={colors.primary} />
                <Text style={styles.aboutLinkText}>{t('profile.learnMore')}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setAboutModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>{t('common.close')}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizes.spacing.md,
    paddingVertical: Sizes.spacing.md,
    minHeight: 60,
  },
  headerTitle: {
    fontSize: Sizes.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: Sizes.spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizes.spacing.md,
  },
  username: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
  },
  userEmail: {
    fontSize: Sizes.fontSize.md,
    color: colors.textSecondary,
    marginTop: Sizes.spacing.xs,
  },
  section: {
    padding: Sizes.spacing.md,
  },
  sectionTitle: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: Sizes.spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.lg,
    marginBottom: Sizes.spacing.sm,
  },
  settingText: {
    fontSize: Sizes.fontSize.lg,
    color: colors.text,
    fontWeight: '600',
  },
  settingTextDanger: {
    color: colors.error,
  },
  settingSubtext: {
    fontSize: Sizes.fontSize.sm,
    color: colors.textSecondary,
    marginTop: Sizes.spacing.xs,
  },
  settingArrow: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    padding: Sizes.spacing.xl,
  },
  footerText: {
    fontSize: Sizes.fontSize.md,
    color: colors.textSecondary,
    marginBottom: Sizes.spacing.xs,
  },
  footerSubtext: {
    fontSize: Sizes.fontSize.sm,
    color: colors.textDisabled,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Sizes.spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: Sizes.borderRadius.xl,
    padding: Sizes.spacing.lg,
    width: '100%',
    maxWidth: 340,
  },
  modalTitle: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: Sizes.spacing.lg,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Sizes.spacing.md,
    paddingHorizontal: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.md,
    marginBottom: Sizes.spacing.xs,
  },
  themeOptionSelected: {
    backgroundColor: colors.primary + '15',
  },
  themeOptionText: {
    flex: 1,
    fontSize: Sizes.fontSize.lg,
    color: colors.text,
  },
  themeOptionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Sizes.spacing.md,
    paddingHorizontal: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.md,
    marginBottom: Sizes.spacing.xs,
  },
  languageOptionSelected: {
    backgroundColor: colors.primary + '15',
  },
  languageOptionText: {
    fontSize: Sizes.fontSize.lg,
    color: colors.text,
  },
  languageOptionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  modalCloseButton: {
    marginTop: Sizes.spacing.sm,
    paddingVertical: Sizes.spacing.sm,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: Sizes.fontSize.md,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  aboutDescription: {
    fontSize: Sizes.fontSize.md,
    color: colors.text,
    textAlign: 'center',
    marginBottom: Sizes.spacing.lg,
    lineHeight: 22,
  },
  aboutLinks: {
    width: '100%',
  },
  aboutLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Sizes.spacing.md,
    paddingHorizontal: Sizes.spacing.md,
    backgroundColor: colors.background,
    borderRadius: Sizes.borderRadius.md,
    marginBottom: Sizes.spacing.sm,
  },
  aboutLinkText: {
    fontSize: Sizes.fontSize.md,
    color: colors.primary,
    marginLeft: Sizes.spacing.sm,
    fontWeight: '500',
  },
});
