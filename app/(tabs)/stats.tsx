import { StyleSheet, Text, View } from 'react-native';
import { Colors, Sizes } from '@/src/constants';

export default function StatsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Статистика</Text>
      <Text style={styles.subtitle}>Здесь будет ваша статистика по привычкам</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Sizes.spacing.lg,
  },
  title: {
    fontSize: Sizes.fontSize.xxxl,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Sizes.spacing.sm,
  },
  subtitle: {
    fontSize: Sizes.fontSize.lg,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
