# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Re:Act** is a next-generation habit tracker mobile app built with React Native and Expo. The app focuses on flexibility and motivation, using a "flexible streaks" system that doesn't punish users for missed days.

**Target Platform:** iOS (primary), Android (secondary)
**Tech Stack:** React Native, Expo
**Target Audience:** Athletes and people pursuing active lifestyles
**Status:** Planning stage - no code implementation yet

## Key Differentiators

1. **Flexible Streaks** - Buffer days (1-2 misses don't break the streak completely)
2. **Universal Tracking** - Binary habits (done/not done) and counters (quantity tracking)
3. **Social Features** - Friends, accountability partners, group challenges
4. **Health Integration** - Apple Health (iOS) and Google Fit (Android)
5. **Smart Notifications** - Context-aware reminders

## Development Commands

**Note:** Project is not yet initialized. When development begins, typical commands will be:

```bash
# Install dependencies
npm install

# Start development server
npm start
# or
expo start

# Run on specific platform
expo start --ios
expo start --android

# Build for production
expo build:ios
expo build:android
# or with EAS
eas build --platform ios
eas build --platform android
```

## Architecture Overview

### Core Structure

The app follows a standard React Native/Expo structure with Context API for state management:

```
src/
├── components/       # Reusable UI components
│   ├── common/      # Basic components (Button, Card, Input, Modal)
│   ├── habits/      # Habit-specific (HabitCard, HabitList, StreakDisplay)
│   ├── stats/       # Statistics (Calendar, TimeChart, ProgressRing)
│   └── social/      # Social features (FriendCard, ChallengeCard, Leaderboard)
├── screens/         # Application screens (HomeScreen, StatsScreen, etc.)
├── navigation/      # Navigation setup (AppNavigator, TabNavigator)
├── context/         # React Context for global state
│   ├── AuthContext.js
│   ├── HabitsContext.js
│   └── NotificationContext.js
├── services/        # Business logic and external services
│   ├── storage/     # AsyncStorageService, CloudStorageService
│   ├── api/         # AuthAPI, SocialAPI
│   ├── notifications/
│   └── health/      # AppleHealthService, GoogleFitService
├── hooks/           # Custom React hooks
├── utils/           # Utility functions (dateHelpers, streakCalculator)
└── constants/       # Colors, Sizes, Fonts, Config
```

### Navigation Flow

```
AppNavigator (Stack)
├── AuthScreen (if not logged in)
└── MainNavigator (Tab)
    ├── HomeTab → HomeScreen, HabitDetailScreen, CreateHabitScreen
    ├── StatsTab → StatsScreen
    ├── CalendarTab → CalendarScreen
    ├── SocialTab → SocialScreen, FriendsScreen, ChallengesScreen
    └── ProfileTab → ProfileScreen, SettingsScreen
```

### State Management

- **AuthContext** - User authentication (Apple ID/Google Sign-In)
- **HabitsContext** - Habit CRUD operations, completion tracking, streak calculations
- **NotificationContext** - Reminder scheduling and management

Data flows from Context → Components, with services handling persistence and sync.

### Data Models

**Habit Structure:**
```javascript
{
  id: string,
  name: string,
  icon: string,  // emoji or icon ID
  type: 'binary' | 'counter',
  targetValue: number,  // for counters
  unit: string,  // for counters
  frequency: {
    type: 'daily' | 'weekly' | 'custom',
    value: number | [days]
  },
  reminder: { enabled: boolean, time: string, days: [...] },
  completionHistory: { 'YYYY-MM-DD': { completed, value, timestamp } },
  currentStreak: number,
  bestStreak: number,
  createdAt: string,
  color: string
}
```

### Key Business Logic

**Streak Calculation:**
- Located in `src/utils/streakCalculator.js`
- Must handle flexible streaks (buffer days)
- Calculates both `currentStreak` and `bestStreak`
- Works with `completionHistory` object

**Completion Flow:**
1. User taps checkbox/counter → `HabitsContext.completeHabit(id)`
2. Update `completionHistory` with today's date
3. Recalculate streaks using `streakCalculator`
4. Save to AsyncStorage
5. Optionally sync to cloud (iCloud/Firebase)
6. Trigger haptic feedback
7. Update UI with animation

**Synchronization:**
- Local-first architecture using AsyncStorage
- Cloud sync via iCloud (iOS) or Firebase/Supabase (cross-platform)
- Merge strategy: last-write-wins with conflict resolution
- Sync on app launch, resume, and manual refresh

## Design System

### Colors
```javascript
primary: '#3949AB',      // Deep indigo
accent: '#26C6DA',       // Turquoise
success: '#66BB6A',      // Mint green
background: '#F5F5F5',   // Light neutral
text: '#212121',
textSecondary: '#757575'
```

### Spacing
- Base unit: 8px
- Scale: 4, 8, 16, 24, 32 (xs, sm, md, lg, xl)

### Principles
- Minimalist, clean interface
- Mobile-first approach
- Simple, fast animations (minimize motion)
- Accessible design
- "Flow" metaphor - water/river visualization

## Critical Implementation Notes

### Authentication
- **iOS:** Must use Sign in with Apple (App Store requirement)
- **Android:** Google Sign-In for future versions
- Store tokens in `expo-secure-store`
- AuthContext manages authentication state

### Health Data Integration
- **iOS:** Use `expo-health` or `react-native-health` for HealthKit
- **Android:** Google Fit API integration
- Auto-complete habits based on health data (e.g., workout detected → mark exercise habit complete)
- Requires user permissions on app launch

### Notifications
- Use `expo-notifications` for local reminders
- Schedule notifications based on habit frequency and user-selected times
- Android requires notification channels setup
- Include motivational messages, not just reminders

### Platform Differences
```javascript
// Handle iOS/Android differences
Platform.select({
  ios: { /* iOS-specific styles */ },
  android: { /* Android-specific styles */ }
})
```
- iOS: shadowColor, shadowOffset, shadowOpacity
- Android: elevation
- Status bar height differs

### Performance Considerations
- Use `React.memo` for frequently re-rendered components (HabitCard)
- Use `useMemo` for streak calculations and statistics
- Lazy load heavy components (charts)
- Optimize images and assets
- Virtual scrolling for long habit lists

## Code Conventions

### File Naming
- Components: PascalCase (`HabitCard.js`)
- Utilities: camelCase (`dateHelpers.js`)
- Constants: PascalCase (`Colors.js`)
- Hooks: camelCase with `use` prefix (`useHabits.js`)

### Component Structure
```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 2. Component
export const ComponentName = ({ prop1, prop2 }) => {
  // Hooks
  const [state, setState] = useState();

  // Effects
  useEffect(() => {}, []);

  // Handlers
  const handlePress = () => {};

  // Render
  return <View style={styles.container}>...</View>;
};

// 3. Styles
const styles = StyleSheet.create({
  container: {}
});
```

### Naming Conventions
- Components/Classes: PascalCase
- Functions/Variables: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Private helpers: `_prefixUnderscore`

## Testing Strategy

**For MVP:**
- Manual testing on physical devices (iOS primary)
- Test on multiple screen sizes
- TestFlight for beta testing before App Store release

**For Future Versions:**
- Unit tests for utilities (`streakCalculator`, `dateHelpers`)
- Integration tests for Context providers
- E2E tests with Detox

## Deployment Process

### iOS App Store
1. Build with `expo build:ios` or `eas build --platform ios`
2. Upload to TestFlight via App Store Connect
3. Submit for review with:
   - App icon (1024x1024)
   - Screenshots (5-8 images)
   - Description (RU/EN)
   - Privacy Policy
   - Keywords for SEO
4. Category: Health & Fitness
5. Review typically takes 1-3 days

### Android Google Play
1. Build with `expo build:android` or `eas build --platform android`
2. Sign release with keystore
3. Upload .aab to Google Play Console
4. Fill listing information
5. Submit for review (faster than Apple)

## MVP Scope

**Core Features (Must Have):**
- Unlimited habit creation (binary and counter types)
- Flexible frequency settings (daily, weekly, custom)
- Completion tracking with flexible streaks
- Calendar visualization with color indicators
- Time-based performance graphs
- Simple reminders
- Apple ID authentication
- iCloud sync
- Apple Health integration
- Social features (friends, challenges, leaderboards)
- Localization (Russian and English)

**Future Versions (v2.0+):**
- Gamification (levels, XP, achievements)
- Dark theme
- Smart/contextual reminders
- Reflection journal
- Widgets (iOS/Android/macOS)
- Apple Watch app
- Data export (CSV/PDF)

## Common Pitfalls to Avoid

1. **Don't over-engineer** - Keep MVP simple, add features in v2
2. **Don't skip physical device testing** - Emulators don't show real performance
3. **Don't hardcode strings** - Use i18n from the start for RU/EN support
4. **Don't ignore timezone handling** - Use proper date utilities
5. **Don't store sensitive data in AsyncStorage** - Use SecureStore for tokens
6. **Don't forget haptic feedback** - It's critical for mobile UX
7. **Don't use complex animations** - Keep it minimal per design principles

## Development Workflow

1. **Feature branches** - Create branch per feature
2. **Commit frequently** - 2-3 commits per day minimum
3. **Test on device** - After each major change
4. **Sync with cloud** - Test sync after storage changes
5. **Check both platforms** - iOS primary, but test Android periodically

## Important Technical Decisions

- **State Management:** Context API (sufficient for MVP, can migrate to Zustand if needed)
- **Storage:** AsyncStorage for local, iCloud for iOS sync
- **Backend:** Firebase or Supabase for social features (not decided yet)
- **Charts:** Victory Native or react-native-chart-kit (evaluate both)
- **Calendar:** react-native-calendars (confirmed)
- **Icons:** @expo/vector-icons (built into Expo)

## 📅 Текущий статус
**Дата:** 16 декабря 2025
**Этап:** День 22-23 - Подготовка к публикации ✅
**Прогресс:** 🟢 ~90% (Дни 1-23 завершены)

## ✅ Что уже сделано
**Неделя 1 (Дни 1-7): ✅ 100% ЗАВЕРШЕНО**
- [x] День 1 - Настройка проекта
- [x] День 2 - Главный экран и привычки
- [x] День 3 - Создание и редактирование привычек
- [x] День 4 - Логика streaks и completion
- [x] День 5 - Календарь и базовая статистика
- [x] День 6-7 - Уведомления

**Неделя 2 (Дни 8-14): ✅ 100% ЗАВЕРШЕНО**
- [x] День 8 - Apple Authentication + AuthContext
- [x] День 9 - iCloud синхронизация
- [x] День 10 - Apple Health интеграция
- [x] Дни 11-14 - Социальные функции (ПРОПУЩЕНЫ для v1.0)

**Неделя 3 (Дни 15-21): ✅ 100% ЗАВЕРШЕНО**
- [x] День 15-16 - Графики (TimeChart, StreakChart, CompletionRate)
- [x] День 17-18 - Полировка UI/UX и анимации
- [x] День 19-20 - Локализация RU/EN
- [x] День 21 - Оптимизация и Code Review

**Неделя 4 (Дни 22-23): ✅ ЗАВЕРШЕНО**
- [x] День 22-23 - Подготовка к публикации
  - [x] Генераторы иконок (HTML)
  - [x] Описание App Store (RU/EN)
  - [x] Privacy Policy (RU/EN)
  - [x] Инструкция по скриншотам
  - [x] Полный гайд по сборке и деплою

## 📋 Что осталось для релиза
- ⏳ **День 24** - Сборка iOS через EAS Build (4-6 часов)
  - Настройка Apple Developer аккаунта
  - Конфигурация EAS
  - Сборка .ipa файла
  - Тестирование через TestFlight

- ⏳ **День 25** - Публикация в App Store (4-6 часов)
  - Заполнение App Store Connect
  - Загрузка скриншотов
  - Submit на модерацию

## 📚 Документация готова
- ✅ **docs/APP_STORE_LISTING.md** - Полное описание для App Store (RU/EN)
- ✅ **docs/PRIVACY_POLICY.md** - Политика конфиденциальности (RU/EN)
- ✅ **docs/SCREENSHOTS_GUIDE.md** - Инструкция по созданию скриншотов
- ✅ **docs/BUILD_AND_DEPLOY.md** - Полный гайд по сборке и публикации
- ✅ **scripts/generate-icon.html** - Генератор иконки приложения
- ✅ **scripts/generate-splash.html** - Генератор splash screen
- ✅ **scripts/generate-android-icons.html** - Генератор Android adaptive icons

## Current Project Status

The project has completed Day 1 setup. Expo Router is already configured (file-based routing in `app/` directory). Core constants (Colors, Sizes) are implemented in `src/constants/`.

When implementing features, prioritize tasks marked with 🔥 (critical for MVP) first, followed by ⭐ (important), then 💡 (nice to have).
