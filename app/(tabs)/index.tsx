import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Sizes } from '@/src/constants';
import { useHabits } from '@/src/context/HabitsContext';
import { HabitList } from '@/src/components/habits/HabitList';
import { CreateHabitModal } from '@/src/components/habits/CreateHabitModal';

export default function HomeScreen() {
  const { habits, completeHabit, uncompleteHabit, isCompletedToday, addHabit } = useHabits();
  const [modalVisible, setModalVisible] = useState(false);

  const handleComplete = (id: string) => {
    if (isCompletedToday(id)) {
      uncompleteHabit(id);
    } else {
      completeHabit(id);
    }
  };

  const handleAddHabit = (habitData: any) => {
    addHabit(habitData);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Мои привычки</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <HabitList
          habits={habits}
          onComplete={handleComplete}
          isCompletedToday={isCompletedToday}
        />
      </View>

      <CreateHabitModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddHabit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Sizes.spacing.md,
    paddingVertical: Sizes.spacing.sm,
  },
  headerTitle: {
    fontSize: Sizes.fontSize.xxl,
    fontWeight: 'bold',
    color: Colors.text,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    fontSize: 28,
    color: Colors.surface,
    fontWeight: '300',
    marginTop: -2,
  },
  content: {
    flex: 1,
  },
});
