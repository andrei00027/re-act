// src/services/storage/AsyncStorageService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const HABITS_KEY = '@MomentumFlow:habits';

export const AsyncStorageService = {
  // Сохранить привычки
  async saveHabits(habits) {
    try {
      const jsonValue = JSON.stringify(habits);
      await AsyncStorage.setItem(HABITS_KEY, jsonValue);
      console.log('✅ Привычки сохранены');
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
        console.log('✅ Привычки загружены');
        return JSON.parse(jsonValue);
      }
      console.log('ℹ️ Привычек нет, возвращаем пустой массив');
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
      console.log('✅ Все данные очищены');
    } catch (error) {
      console.error('❌ Ошибка при очистке данных:', error);
      throw error;
    }
  },
};
