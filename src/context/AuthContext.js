// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { AsyncStorageService } from '../services/storage/AsyncStorageService';

const AuthContext = createContext();

const USER_KEY = 'react_user';
const USERS_DB_KEY = 'react_users_db'; // Для email/password

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Проверить сохраненного пользователя при запуске
  useEffect(() => {
    checkStoredUser();
  }, []);

  const checkStoredUser = async () => {
    try {
      const storedUser = await SecureStore.getItemAsync(USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithApple = async () => {
    try {
      // Проверить доступность Apple Authentication
      if (Platform.OS !== 'ios') {
        throw new Error('Apple Authentication is only available on iOS');
      }

      // MOCK для симулятора - Sign in with Apple не работает в симуляторе
      const isSimulator = Platform.constants.simulator || __DEV__;

      if (isSimulator) {
        console.log('🔧 Using mock authentication for iOS Simulator');
        const mockUserData = {
          id: 'mock-user-simulator',
          email: 'hi@architeq.io',
          fullName: 'Dev User (Simulator)',
          authProvider: 'apple',
          authToken: 'mock-token-' + Date.now(),
        };

        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(mockUserData));
        setUser(mockUserData);
        return mockUserData;
      }

      // Реальная авторизация на физическом устройстве
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Создать объект пользователя
      const userData = {
        id: credential.user,
        email: credential.email,
        fullName: credential.fullName
          ? `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim()
          : null,
        authProvider: 'apple',
        authToken: credential.identityToken,
      };

      // Сохранить в SecureStore
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
      setUser(userData);

      return userData;
    } catch (error) {
      if (error.code !== 'ERR_CANCELED') {
        console.error('Error signing in with Apple:', error);
        throw error;
      }
      // User canceled, silently return
    }
  };

  // Получить базу пользователей (для email/password)
  const getUsersDB = async () => {
    try {
      const db = await SecureStore.getItemAsync(USERS_DB_KEY);
      return db ? JSON.parse(db) : {};
    } catch {
      return {};
    }
  };

  // Сохранить базу пользователей
  const saveUsersDB = async (db) => {
    await SecureStore.setItemAsync(USERS_DB_KEY, JSON.stringify(db));
  };

  // Простая хеш-функция для пароля (не для продакшена!)
  const hashPassword = (password) => {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  };

  const signUpWithEmail = async (email, password, fullName) => {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }

      const usersDB = await getUsersDB();
      const normalizedEmail = email.toLowerCase().trim();

      if (usersDB[normalizedEmail]) {
        throw new Error('User with this email already exists');
      }

      const userId = 'email-' + Date.now() + '-' + Math.random().toString(36).substring(2, 11);
      const hashedPassword = hashPassword(password);

      // Сохранить в "базу данных"
      usersDB[normalizedEmail] = {
        id: userId,
        email: normalizedEmail,
        fullName: fullName || null,
        passwordHash: hashedPassword,
        createdAt: new Date().toISOString(),
      };
      await saveUsersDB(usersDB);

      // Создать сессию
      const userData = {
        id: userId,
        email: normalizedEmail,
        fullName: fullName || null,
        authProvider: 'email',
        authToken: 'email-token-' + Date.now(),
      };

      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
      setUser(userData);

      return userData;
    } catch (error) {
      console.error('Error signing up with email:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const usersDB = await getUsersDB();
      const normalizedEmail = email.toLowerCase().trim();
      const userRecord = usersDB[normalizedEmail];

      if (!userRecord) {
        throw new Error('User not found');
      }

      const hashedPassword = hashPassword(password);
      if (userRecord.passwordHash !== hashedPassword) {
        throw new Error('Invalid password');
      }

      // Создать сессию
      const userData = {
        id: userRecord.id,
        email: userRecord.email,
        fullName: userRecord.fullName,
        authProvider: 'email',
        authToken: 'email-token-' + Date.now(),
      };

      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
      setUser(userData);

      return userData;
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync(USER_KEY);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      // Если это email-аккаунт, удалить из базы
      if (user?.authProvider === 'email' && user?.email) {
        const usersDB = await getUsersDB();
        delete usersDB[user.email];
        await saveUsersDB(usersDB);
      }

      // Удалить все данные привычек из AsyncStorage
      await AsyncStorageService.clearAll();
      // Удалить данные пользователя из SecureStore
      await SecureStore.deleteItemAsync(USER_KEY);
      // Сбросить состояние пользователя (перенаправит на экран входа)
      setUser(null);
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    signInWithApple,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    deleteAccount,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
