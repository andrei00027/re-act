// src/components/habits/HabitList.js
import React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { HabitCard } from './HabitCard';
import { Colors, Sizes } from '@/src/constants';

export const HabitList = ({ habits, onComplete, isCompletedToday }) => {
  if (habits.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🌊</Text>
        <Text style={styles.emptyText}>Пока нет привычек</Text>
        <Text style={styles.emptySubtext}>Добавьте первую привычку, чтобы начать свой путь!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={habits}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <HabitCard
          habit={item}
          onComplete={onComplete}
          isCompleted={isCompletedToday(item.id)}
        />
      )}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: Sizes.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Sizes.spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Sizes.spacing.md,
  },
  emptyText: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Sizes.spacing.sm,
  },
  emptySubtext: {
    fontSize: Sizes.fontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
