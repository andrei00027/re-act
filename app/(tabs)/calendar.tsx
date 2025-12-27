import { StyleSheet, Text, View, ScrollView, Modal, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, LocaleConfig, DateData } from 'react-native-calendars';
import { useTranslation } from 'react-i18next';
import { Sizes } from '@/src/constants';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { useHabits } from '@/src/context/HabitsContext';
import { useMemo, useState, useCallback } from 'react';
import { tPlural } from '@/src/i18n';
import { Ionicons } from '@expo/vector-icons';
import { HabitIcon } from '@/src/components/common/HabitIcon';

// Configure Russian locale for calendar
LocaleConfig.locales['ru'] = {
  monthNames: [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ],
  monthNamesShort: [
    'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
    'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
  ],
  dayNames: [
    'Воскресенье', 'Понедельник', 'Вторник', 'Среда',
    'Четверг', 'Пятница', 'Суббота'
  ],
  dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  today: 'Сегодня'
};

LocaleConfig.locales['en'] = {
  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  monthNamesShort: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ],
  dayNames: [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday'
  ],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: 'Today'
};

// Indonesian locale
LocaleConfig.locales['id'] = {
  monthNames: [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ],
  monthNamesShort: [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ],
  dayNames: [
    'Minggu', 'Senin', 'Selasa', 'Rabu',
    'Kamis', 'Jumat', 'Sabtu'
  ],
  dayNamesShort: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
  today: 'Hari ini'
};

// Chinese locale
LocaleConfig.locales['zh'] = {
  monthNames: [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ],
  monthNamesShort: [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ],
  dayNames: [
    '星期日', '星期一', '星期二', '星期三',
    '星期四', '星期五', '星期六'
  ],
  dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
  today: '今天'
};

// Spanish locale
LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ],
  monthNamesShort: [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ],
  dayNames: [
    'Domingo', 'Lunes', 'Martes', 'Miércoles',
    'Jueves', 'Viernes', 'Sábado'
  ],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy'
};

export default function CalendarScreen() {
  const { t, i18n } = useTranslation();
  const colors = useThemeColors();
  const { habits } = useHabits();

  // State для модального окна
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Set calendar locale based on current app language
  const supportedLocales = ['ru', 'en', 'id', 'zh', 'es'];
  LocaleConfig.defaultLocale = supportedLocales.includes(i18n.language) ? i18n.language : 'en';

  // Цвета для статусов выполнения
  const statusColors = {
    none: colors.error,      // 0% - красный
    partial: colors.warning, // 1-99% - желтый
    complete: colors.success // 100% - зеленый
  };

  // Функция для получения цвета по проценту выполнения
  const getCompletionColor = (percentage: number) => {
    if (percentage === 0) return statusColors.none;
    if (percentage < 100) return statusColors.partial;
    return statusColors.complete;
  };

  // Подготовить marked dates для календаря (heat map стиль)
  const markedDates = useMemo(() => {
    const marked: any = {};
    const today = new Date().toISOString().split('T')[0];

    // Собираем все даты, когда были выполнения
    const dateStats: { [date: string]: { completed: number; total: number } } = {};

    // Находим самую раннюю дату с данными
    let earliestDate: string | null = null;

    habits.forEach((habit: any) => {
      const history = habit.completionHistory || {};
      Object.keys(history).forEach(date => {
        if (!earliestDate || date < earliestDate) {
          earliestDate = date;
        }
        if (!dateStats[date]) {
          dateStats[date] = { completed: 0, total: 0 };
        }
        dateStats[date].total++;
        if (history[date].completed) {
          dateStats[date].completed++;
        }
      });
    });

    // Заполняем пропущенные дни между первой датой и вчера как красные (0%)
    if (earliestDate && habits.length > 0) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const currentDate = new Date(earliestDate);
      while (currentDate.toISOString().split('T')[0] <= yesterdayStr) {
        const dateStr = currentDate.toISOString().split('T')[0];
        if (!dateStats[dateStr]) {
          // День без записей = 0 выполненных
          dateStats[dateStr] = { completed: 0, total: habits.length };
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    // Для сегодняшнего дня: считаем ВСЕ привычки как total
    const totalHabitsCount = habits.length;
    if (totalHabitsCount > 0) {
      const completedToday = habits.filter((habit: any) => {
        const todayEntry = habit.completionHistory?.[today];
        if (habit.isQuitHabit) {
          // Для quit привычек: НЕ отмечено = успех (воздержался)
          // Отмечено = провал (сорвался)
          return todayEntry?.completed !== true;
        }
        // Для обычных привычек: отмечено = успех
        return todayEntry?.completed === true;
      }).length;

      dateStats[today] = {
        completed: completedToday,
        total: totalHabitsCount,
      };
    }

    // Создаем маркировку для каждой даты
    Object.entries(dateStats).forEach(([date, stats]) => {
      const percentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
      const bgColor = getCompletionColor(percentage);

      marked[date] = {
        customStyles: {
          container: {
            backgroundColor: bgColor,
            borderRadius: 8,
          },
          text: {
            color: colors.white,
            fontWeight: percentage === 100 ? 'bold' : 'normal',
          },
        },
      };
    });

    // Отметить сегодня особым образом (добавляем обводку)
    if (marked[today]) {
      marked[today].customStyles.container.borderWidth = 2;
      marked[today].customStyles.container.borderColor = colors.primary;
    } else {
      marked[today] = {
        customStyles: {
          container: {
            borderWidth: 2,
            borderColor: colors.primary,
            borderRadius: 8,
          },
          text: {
            color: colors.primary,
            fontWeight: 'bold',
          },
        },
      };
    }

    return marked;
  }, [habits, colors.error, colors.warning, colors.success, colors.white, colors.primary]);

  // Подсчитать статистику за последний месяц
  const monthStats = useMemo(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    let completedDays = 0;
    const checkedDates = new Set();

    habits.forEach((habit: any) => {
      Object.keys(habit.completionHistory || {}).forEach(dateStr => {
        const date = new Date(dateStr);
        if (date >= thirtyDaysAgo && date <= today && habit.completionHistory[dateStr].completed) {
          if (!checkedDates.has(dateStr)) {
            checkedDates.add(dateStr);
            completedDays++;
          }
        }
      });
    });

    return completedDays;
  }, [habits]);

  // Получить привычки для выбранной даты
  const getHabitsForDate = useCallback((date: string) => {
    return habits.map((habit: any) => {
      const historyEntry = habit.completionHistory?.[date];
      return {
        id: habit.id,
        name: habit.name,
        icon: habit.icon,
        completed: historyEntry?.completed || false,
        value: historyEntry?.value,
        targetValue: habit.targetValue,
        unit: habit.unit,
        type: habit.type,
      };
    }).filter((h: any) => {
      // Показываем только привычки, у которых есть запись на эту дату
      const habit = habits.find((hab: any) => hab.id === h.id);
      return habit?.completionHistory?.[date] !== undefined;
    });
  }, [habits]);

  // Обработчик нажатия на день
  const handleDayPress = useCallback((day: DateData) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  }, []);

  // Форматировать дату для отображения
  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('calendar.title')}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsCard}>
          <Text style={styles.statsLabel}>{t('calendar.activeDaysMonth')}</Text>
          <Text style={styles.statsValue}>{tPlural('calendar.days', monthStats)}</Text>
        </View>

        <View style={styles.calendarContainer}>
          <Calendar
            key={`${i18n.language}-${colors.background}`}
            markedDates={markedDates}
            markingType="custom"
            firstDay={1}
            onDayPress={handleDayPress}
            theme={{
              backgroundColor: colors.background,
              calendarBackground: colors.surface,
              textSectionTitleColor: colors.textSecondary,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: colors.surface,
              todayTextColor: colors.primary,
              dayTextColor: colors.text,
              textDisabledColor: colors.textDisabled,
              dotColor: colors.success,
              monthTextColor: colors.text,
              textMonthFontWeight: 'bold',
              textMonthFontSize: Sizes.fontSize.xl,
              textDayFontSize: Sizes.fontSize.md,
              textDayHeaderFontSize: Sizes.fontSize.sm,
              arrowColor: colors.primary,
            }}
          />
        </View>

        <View style={styles.legend}>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: colors.success }]} />
              <Text style={styles.legendText}>{t('calendar.allCompleted')}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: colors.warning }]} />
              <Text style={styles.legendText}>{t('calendar.partiallyCompleted')}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: colors.error }]} />
              <Text style={styles.legendText}>{t('calendar.noneCompleted')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Модальное окно с привычками за день */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedDate && formatDateForDisplay(selectedDate)}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBody}
              contentContainerStyle={styles.modalBodyContent}
              showsVerticalScrollIndicator={true}
              bounces={true}
            >
              {selectedDate && getHabitsForDate(selectedDate).length > 0 ? (
                getHabitsForDate(selectedDate).map((habit: any) => (
                  <View key={habit.id} style={styles.habitRow}>
                    <View style={styles.habitInfo}>
                      <HabitIcon
                        name={habit.icon || 'checkbox-circle'}
                        size={24}
                        color={colors.primary}
                      />
                      <Text style={styles.habitName}>{habit.name}</Text>
                    </View>
                    <View style={[
                      styles.habitStatus,
                      { backgroundColor: habit.completed ? colors.success : colors.error }
                    ]}>
                      <Ionicons
                        name={habit.completed ? "checkmark" : "close"}
                        size={16}
                        color={colors.white}
                      />
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noHabitsText}>{t('calendar.noHistory')}</Text>
              )}
            </ScrollView>
          </Pressable>
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
    paddingHorizontal: Sizes.spacing.md,
    paddingVertical: Sizes.spacing.sm,
  },
  headerTitle: {
    fontSize: Sizes.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  statsCard: {
    backgroundColor: colors.surface,
    margin: Sizes.spacing.md,
    padding: Sizes.spacing.lg,
    borderRadius: Sizes.borderRadius.lg,
    alignItems: 'center',
  },
  statsLabel: {
    fontSize: Sizes.fontSize.md,
    color: colors.textSecondary,
    marginBottom: Sizes.spacing.xs,
  },
  statsValue: {
    fontSize: Sizes.fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.primary,
  },
  calendarContainer: {
    backgroundColor: colors.surface,
    margin: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.lg,
    padding: Sizes.spacing.sm,
    overflow: 'hidden',
  },
  legend: {
    margin: Sizes.spacing.md,
    padding: Sizes.spacing.md,
    backgroundColor: colors.surface,
    borderRadius: Sizes.borderRadius.lg,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: Sizes.spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.xs,
  },
  legendBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  legendText: {
    fontSize: Sizes.fontSize.xs,
    color: colors.textSecondary,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Sizes.spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: Sizes.borderRadius.lg,
    width: '100%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Sizes.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    textTransform: 'capitalize',
  },
  modalBody: {
    maxHeight: 400,
  },
  modalBodyContent: {
    padding: Sizes.spacing.md,
    paddingBottom: Sizes.spacing.lg,
  },
  habitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Sizes.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Sizes.spacing.sm,
  },
  habitName: {
    fontSize: Sizes.fontSize.md,
    color: colors.text,
    flex: 1,
  },
  habitStatus: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noHabitsText: {
    fontSize: Sizes.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: Sizes.spacing.lg,
  },
});
