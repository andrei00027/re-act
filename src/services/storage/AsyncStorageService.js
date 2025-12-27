// src/services/storage/AsyncStorageService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const HABITS_KEY = '@ReAct:habits';

export const AsyncStorageService = {
  // Сохранить привычки
  async saveHabits(habits) {
    try {
      const jsonValue = JSON.stringify(habits);
      await AsyncStorage.setItem(HABITS_KEY, jsonValue);
    } catch (error) {
      console.error('❌ Ошибка при сохранении привычек:', error);
      throw error;
    }
  },

  // Загрузить привычки
  async loadHabits() {
    try {
      const jsonValue = await AsyncStorage.getItem(HABITS_KEY);
      if (jsonValue !== null) {
        return JSON.parse(jsonValue);
      }
      return [];
    } catch (error) {
      console.error('❌ Ошибка при загрузке привычек:', error);
      return [];
    }
  },

  // Очистить все данные
  async clearAll() {
    try {
      await AsyncStorage.removeItem(HABITS_KEY);
    } catch (error) {
      console.error('❌ Ошибка при очистке данных:', error);
      throw error;
    }
  },
};
