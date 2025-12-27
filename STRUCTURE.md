# Re:Act - Структура проекта

Полное описание архитектуры, организации папок и файлов проекта.

---

## 📁 Общая структура директорий

```
Re:Act/
├── src/                        # Исходный код приложения
│   ├── components/             # Переиспользуемые UI компоненты
│   ├── screens/                # Экраны приложения
│   ├── navigation/             # Навигация между экранами
│   ├── context/                # React Context для глобального состояния
│   ├── hooks/                  # Кастомные React hooks
│   ├── services/               # Бизнес-логика и внешние сервисы
│   ├── utils/                  # Утилиты и вспомогательные функции
│   ├── constants/              # Константы (цвета, стили, конфиги)
│   ├── types/                  # TypeScript типы (если используется)
│   └── assets/                 # Статические файлы (изображения, шрифты)
├── ios/                        # iOS нативный код (после expo prebuild)
├── android/                    # Android нативный код (после expo prebuild)
├── App.js                      # Точка входа приложения
├── app.json                    # Конфигурация Expo
├── babel.config.js             # Конфигурация Babel
├── package.json                # Зависимости проекта
├── .gitignore                  # Git игнорируемые файлы
└── README.md                   # Документация проекта
```

---

## 🗂️ Детальная структура `/src`

### 1. `/src/components` - UI компоненты

```
components/
├── common/                     # Базовые переиспользуемые компоненты
│   ├── Button.js              # Кастомная кнопка
│   ├── Card.js                # Карточка контейнер
│   ├── Input.js               # Поле ввода
│   ├── Modal.js               # Модальное окно
│   ├── Loading.js             # Индикатор загрузки
│   ├── Badge.js               # Бейдж (метка)
│   └── Icon.js                # Обертка для иконок
│
├── habits/                     # Компоненты для привычек
│   ├── HabitCard.js           # Карточка привычки
│   ├── HabitList.js           # Список привычек
│   ├── HabitForm.js           # Форма создания/редактирования
│   ├── HabitCounter.js        # Счетчик для привычек с числами
│   ├── HabitCheckbox.js       # Чекбокс для бинарных привычек
│   ├── StreakDisplay.js       # Отображение streak
│   └── FrequencyPicker.js     # Выбор частоты привычки
│
├── stats/                      # Компоненты статистики
│   ├── Calendar.js            # Календарь с выполнением
│   ├── TimeChart.js           # График времени выполнения
│   ├── StreakChart.js         # График streaks
│   ├── ProgressRing.js        # Круговой прогресс
│   └── StatsCard.js           # Карточка со статистикой
│
└── social/                     # Социальные компоненты
    ├── FriendCard.js          # Карточка друга
    ├── FriendList.js          # Список друзей
    ├── ChallengeCard.js       # Карточка челленджа
    ├── ChallengeList.js       # Список челленджей
    └── Leaderboard.js         # Лидерборд
```

**Соглашения по компонентам:**
- Каждый компонент в отдельном файле
- PascalCase для названий файлов
- Используем functional components с hooks
- Props validation через PropTypes или TypeScript
- Styled components или StyleSheet для стилей

**Пример структуры компонента:**

```javascript
// src/components/habits/HabitCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants';

export const HabitCard = ({ habit, onPress, onComplete }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.title}>{habit.name}</Text>
        <Text style={styles.streak}>{habit.currentStreak} days 🔥</Text>
      </View>
      <TouchableOpacity 
        style={styles.checkbox} 
        onPress={() => onComplete(habit.id)}
      >
        {habit.completedToday && <Icon name="check" />}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 12,
  },
  // ... остальные стили
});
```

---

### 2. `/src/screens` - Экраны приложения

```
screens/
├── HomeScreen.js              # Главный экран со списком привычек
├── StatsScreen.js             # Экран статистики
├── CalendarScreen.js          # Экран календаря
├── SocialScreen.js            # Экран социальных функций
├── ProfileScreen.js           # Экран профиля
├── HabitDetailScreen.js       # Детали привычки
├── CreateHabitScreen.js       # Создание новой привычки
├── EditHabitScreen.js         # Редактирование привычки
├── FriendsScreen.js           # Список друзей
├── ChallengesScreen.js        # Список челленджей
├── SettingsScreen.js          # Настройки приложения
└── OnboardingScreen.js        # Онбординг для новых пользователей
```

**Основные экраны MVP:**

#### **HomeScreen** (Главный экран)
- Список всех активных привычек на сегодня
- Прогресс выполнения (3/6 привычек)
- Быстрая отметка выполнения
- Кнопка добавления новой привычки
- Навигация в другие разделы

#### **StatsScreen** (Статистика)
- Общий прогресс по всем привычкам
- Графики и визуализации
- Лучшие streaks
- Статистика по времени выполнения

#### **CalendarScreen** (Календарь)
- Календарь с отметками выполнения/невыполнения
- Цветовая кодировка
- Выбор месяца/года
- Детали по дню при клике

#### **SocialScreen** (Социальные)
- Вкладки: Друзья / Челленджи
- Список друзей с их прогрессом
- Активные челленджи
- Лидерборд

#### **ProfileScreen** (Профиль)
- Информация пользователя
- Настройки
- О приложении
- Выход

---

### 3. `/src/navigation` - Навигация

```
navigation/
├── AppNavigator.js            # Корневой навигатор
├── TabNavigator.js            # Bottom Tab навигация
├── StackNavigator.js          # Stack навигация для модалов
└── navigationTypes.js         # Типы для навигации (если TS)
```

**Структура навигации:**

```
App
└── AppNavigator (Stack)
    ├── AuthScreen (если не залогинен)
    └── MainNavigator (Tab)
        ├── HomeTab (Stack)
        │   ├── HomeScreen
        │   ├── HabitDetailScreen
        │   ├── CreateHabitScreen
        │   └── EditHabitScreen
        ├── StatsTab
        │   └── StatsScreen
        ├── CalendarTab
        │   └── CalendarScreen
        ├── SocialTab (Stack)
        │   ├── SocialScreen
        │   ├── FriendsScreen
        │   └── ChallengesScreen
        └── ProfileTab (Stack)
            ├── ProfileScreen
            └── SettingsScreen
```

**Пример AppNavigator:**

```javascript
// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { TabNavigator } from './TabNavigator';
import { AuthScreen } from '../screens/AuthScreen';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

---

### 4. `/src/context` - Глобальное состояние

```
context/
├── AuthContext.js             # Аутентификация пользователя
├── HabitsContext.js           # Состояние привычек
├── ThemeContext.js            # Тема приложения (для v2)
└── NotificationContext.js     # Управление уведомлениями
```

**Основные контексты:**

#### **AuthContext**
```javascript
// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import * as AppleAuthentication from 'expo-apple-authentication';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signInWithApple = async () => {
    // Логика входа через Apple ID
  };

  const signOut = async () => {
    // Логика выхода
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithApple, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

#### **HabitsContext**
```javascript
// src/context/HabitsContext.js
import React, { createContext, useState, useContext } from 'react';

const HabitsContext = createContext();

export const HabitsProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);

  const addHabit = (habit) => {
    setHabits([...habits, { ...habit, id: Date.now() }]);
  };

  const updateHabit = (id, updates) => {
    setHabits(habits.map(h => h.id === id ? { ...h, ...updates } : h));
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const completeHabit = (id) => {
    // Логика отметки выполнения
  };

  return (
    <HabitsContext.Provider 
      value={{ habits, addHabit, updateHabit, deleteHabit, completeHabit }}
    >
      {children}
    </HabitsContext.Provider>
  );
};

export const useHabits = () => useContext(HabitsContext);
```

---

### 5. `/src/hooks` - Кастомные хуки

```
hooks/
├── useHabits.js               # Хук для работы с привычками
├── useStats.js                # Хук для статистики
├── useNotifications.js        # Хук для уведомлений
├── useHealthKit.js            # Хук для Apple Health
└── useStorage.js              # Хук для AsyncStorage
```

**Примеры хуков:**

```javascript
// src/hooks/useStats.js
import { useMemo } from 'react';
import { useHabits } from '../context/HabitsContext';

export const useStats = () => {
  const { habits } = useHabits();

  const totalHabits = habits.length;
  
  const completedToday = useMemo(() => {
    return habits.filter(h => h.completedToday).length;
  }, [habits]);

  const averageStreak = useMemo(() => {
    if (habits.length === 0) return 0;
    return habits.reduce((sum, h) => sum + h.currentStreak, 0) / habits.length;
  }, [habits]);

  return { totalHabits, completedToday, averageStreak };
};
```

---

### 6. `/src/services` - Бизнес-логика

```
services/
├── storage/
│   ├── AsyncStorageService.js    # Локальное хранилище
│   └── CloudStorageService.js    # iCloud синхронизация
├── api/
│   ├── AuthAPI.js                # API аутентификации
│   └── SocialAPI.js              # API социальных функций
├── notifications/
│   └── NotificationService.js    # Управление уведомлениями
└── health/
    ├── AppleHealthService.js     # Интеграция с Apple Health
    └── GoogleFitService.js       # Интеграция с Google Fit
```

**Пример сервиса:**

```javascript
// src/services/storage/AsyncStorageService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const HABITS_KEY = '@Re:Act:habits';

export const AsyncStorageService = {
  async saveHabits(habits) {
    try {
      await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  },

  async loadHabits() {
    try {
      const data = await AsyncStorage.getItem(HABITS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading habits:', error);
      return [];
    }
  },

  async clearAll() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
};
```

---

### 7. `/src/utils` - Утилиты

```
utils/
├── dateHelpers.js             # Функции работы с датами
├── streakCalculator.js        # Расчет streaks
├── validators.js              # Валидация данных
├── formatters.js              # Форматирование текста/чисел
└── constants.js               # Константы
```

**Примеры утилит:**

```javascript
// src/utils/streakCalculator.js
export const calculateStreak = (completionHistory) => {
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  const today = new Date().toDateString();
  const sortedDates = Object.keys(completionHistory).sort().reverse();

  for (const date of sortedDates) {
    if (completionHistory[date]) {
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
      
      if (date === today || isYesterday(date)) {
        currentStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  return { currentStreak, bestStreak };
};

// src/utils/dateHelpers.js
export const isToday = (date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isYesterday = (dateString) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateString === yesterday.toDateString();
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};
```

---

### 8. `/src/constants` - Константы

```
constants/
├── Colors.js                  # Цветовая палитра
├── Sizes.js                   # Размеры, отступы
├── Fonts.js                   # Шрифты и их размеры
└── Config.js                  # Конфигурация приложения
```

**Примеры:**

```javascript
// src/constants/Colors.js
export const Colors = {
  primary: '#3949AB',
  primaryLight: '#5E6DBF',
  primaryDark: '#2832A0',
  accent: '#26C6DA',
  success: '#66BB6A',
  error: '#EF5350',
  warning: '#FFA726',
  
  surface: '#FFFFFF',
  background: '#F5F5F5',
  
  text: '#212121',
  textSecondary: '#757575',
  textDisabled: '#BDBDBD',
  
  border: '#E0E0E0',
  divider: '#EEEEEE',
};

// src/constants/Sizes.js
export const Sizes = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 24,
    xxxl: 32,
  }
};
```

---

## 📊 Модели данных

### Habit (Привычка)

```javascript
{
  id: string,                    // Уникальный ID
  name: string,                  // Название привычки
  icon: string,                  // Emoji или ID иконки
  type: 'binary' | 'counter',    // Тип: да/нет или счетчик
  
  // Для type === 'counter'
  targetValue: number,           // Целевое значение (например, 8 стаканов)
  unit: string,                  // Единица измерения ('стаканов', 'км', 'мин')
  
  // Частота
  frequency: {
    type: 'daily' | 'weekly' | 'custom',
    value: number | [days],      // Для weekly: 3, для custom: [1,3,5]
  },
  
  // Уведомления
  reminder: {
    enabled: boolean,
    time: string,                // '19:00'
    days: [0,1,2,3,4,5,6],      // Дни недели
  },
  
  // История
  completionHistory: {
    '2025-12-12': { 
      completed: boolean,
      value: number,             // Для счетчиков
      timestamp: string,
    }
  },
  
  // Streaks
  currentStreak: number,
  bestStreak: number,
  
  // Метаданные
  createdAt: string,
  updatedAt: string,
  color: string,                 // Акцентный цвет
  category: string,              // Категория (опционально)
}
```

### User (Пользователь)

```javascript
{
  id: string,
  appleId: string,              // Apple ID токен
  name: string,
  email: string,
  avatar: string,               // URL или base64
  
  // Настройки
  settings: {
    language: 'ru' | 'en',
    notifications: boolean,
    healthKitEnabled: boolean,
    theme: 'light' | 'dark',    // Для v2
  },
  
  // Социальное
  friends: [userId],
  challenges: [challengeId],
  
  createdAt: string,
  lastActive: string,
}
```

### Challenge (Челлендж)

```javascript
{
  id: string,
  name: string,
  description: string,
  habitId: string,              // Связанная привычка
  
  startDate: string,
  endDate: string,
  duration: number,             // Дней
  
  participants: [{
    userId: string,
    joinedAt: string,
    progress: number,
  }],
  
  createdBy: string,            // userId создателя
  isPublic: boolean,
}
```

---

## 🔄 Потоки данных

### 1. Создание привычки

```
User action (CreateHabitScreen)
  → validate input
  → HabitsContext.addHabit()
  → update local state
  → AsyncStorageService.saveHabits()
  → (optional) CloudStorageService.sync()
  → navigate to HomeScreen
  → show success message
```

### 2. Отметка выполнения

```
User tap checkbox
  → HabitsContext.completeHabit(id)
  → calculate new streak
  → update completionHistory
  → AsyncStorageService.saveHabits()
  → trigger haptic feedback
  → update UI with animation
  → (optional) check HealthKit for auto-completion
```

### 3. Синхронизация

```
App launch / Resume
  → check internet connection
  → AuthContext.checkAuth()
  → AsyncStorageService.loadHabits()
  → CloudStorageService.sync()
    → fetch remote data
    → merge with local (conflict resolution)
    → save merged data locally
  → update UI
```

---

## 🎨 Стили и темизация

### Глобальные стили

```javascript
// src/constants/GlobalStyles.js
import { StyleSheet } from 'react-native';
import { Colors, Sizes } from './';

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Sizes.borderRadius.md,
    padding: Sizes.spacing.md,
    marginBottom: Sizes.spacing.md,
    
    // Shadow iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    
    // Shadow Android
    elevation: 2,
  },
  
  title: {
    fontSize: Sizes.fontSize.xxl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Sizes.spacing.sm,
  },
  
  subtitle: {
    fontSize: Sizes.fontSize.md,
    color: Colors.textSecondary,
  },
  
  // ... другие общие стили
});
```

---

## 📝 Соглашения по коду

### Именование файлов
- **Компоненты:** PascalCase (`HabitCard.js`)
- **Утилиты:** camelCase (`dateHelpers.js`)
- **Константы:** PascalCase (`Colors.js`)
- **Хуки:** camelCase с префиксом `use` (`useHabits.js`)

### Именование переменных
- **Компоненты:** PascalCase (`const HabitCard = ...`)
- **Функции:** camelCase (`const calculateStreak = ...`)
- **Константы:** SCREAMING_SNAKE_CASE (`const API_KEY = ...`)
- **Приватные:** префикс `_` (`const _privateHelper = ...`)

### Структура компонента
```javascript
// 1. Импорты
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 2. Типы/интерфейсы (если TypeScript)
// interface Props { ... }

// 3. Компонент
export const ComponentName = ({ prop1, prop2 }) => {
  // 3.1. Hooks
  const [state, setState] = useState();
  
  // 3.2. Эффекты
  useEffect(() => {
    // ...
  }, []);
  
  // 3.3. Handlers
  const handlePress = () => {
    // ...
  };
  
  // 3.4. Render
  return (
    <View style={styles.container}>
      <Text>{prop1}</Text>
    </View>
  );
};

// 4. Стили
const styles = StyleSheet.create({
  container: {
    // ...
  },
});

// 5. Default export (опционально)
export default ComponentName;
```

### Комментарии
- Используйте JSDoc для функций
- Комментируйте сложную логику
- TODO/FIXME/NOTE для заметок

```javascript
/**
 * Calculates the current and best streak for a habit
 * @param {Object} completionHistory - Object with dates as keys
 * @returns {Object} { currentStreak, bestStreak }
 */
export const calculateStreak = (completionHistory) => {
  // TODO: Add support for flexible streaks
  // NOTE: This doesn't handle timezone differences yet
  
  // ... implementation
};
```

---

## 🧪 Тестирование (для будущих версий)

```
__tests__/
├── components/
├── hooks/
├── utils/
└── services/
```

---

## 📱 Платформо-специфичный код

Используйте Platform API для различий между iOS и Android:

```javascript
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});
```

---

**Последнее обновление:** Декабрь 2025
