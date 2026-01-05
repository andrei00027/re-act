// src/components/charts/DynamicsChart.js
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { tPlural } from '@/src/i18n';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const DynamicsChart = ({ completionHistory }) => {
  const { t, i18n } = useTranslation();
  const colors = useThemeColors();

  const getDateLocale = () => {
    const localeMap = {
      'ru': 'ru-RU',
      'en': 'en-US',
      'es': 'es-ES',
      'zh': 'zh-CN',
      'id': 'id-ID',
    };
    return localeMap[i18n.language] || 'en-US';
  };

  const chartData = useMemo(() => {
    if (!completionHistory || Object.keys(completionHistory).length === 0) {
      return null;
    }

    const dates = Object.keys(completionHistory).sort();
    if (dates.length < 2) return null;

    const windowSize = 7;
    const rateData = [];
    const labels = [];

    for (let i = 0; i < dates.length; i++) {
      const windowStart = Math.max(0, i - windowSize + 1);
      const windowDates = dates.slice(windowStart, i + 1);

      const completed = windowDates.filter(
        d => completionHistory[d]?.completed
      ).length;
      const rate = (completed / windowDates.length) * 100;
      rateData.push(rate);

      if (i === 0 || i === dates.length - 1 || i === Math.floor(dates.length / 2)) {
        if (i === 0) {
          const startDate = new Date(dates[0]);
          const locale = getDateLocale();
          const day = startDate.getDate();
          const month = startDate.toLocaleString(locale, { month: 'short' }).toUpperCase();
          const year = startDate.getFullYear();
          labels.push(`${day} ${month} ${year}`);
        } else if (i === dates.length - 1) {
          labels.push(t('charts.today').toUpperCase());
        } else {
          const daysText = tPlural('habits.days', dates.length).toUpperCase();
          labels.push(daysText);
        }
      } else {
        labels.push('');
      }
    }

    const startDate = new Date(dates[0]);
    const locale = getDateLocale();
    const day = startDate.getDate();
    const month = startDate.toLocaleString(locale, { month: 'short' }).toUpperCase();
    const year = startDate.getFullYear();
    const startLabel = `${day} ${month} ${year}`;

    return {
      labels,
      datasets: [{
        data: rateData,
        color: () => colors.primary,
        strokeWidth: 2,
      }],
      startLabel,
      totalDays: dates.length,
    };
  }, [completionHistory, t, i18n.language, colors.primary]);

  const styles = createStyles(colors);

  if (!chartData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t('charts.noData')}</Text>
        <Text style={styles.emptySubtext}>{t('charts.noDataHint')}</Text>
      </View>
    );
  }

  const currentRate = chartData.datasets[0].data[chartData.datasets[0].data.length - 1];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('charts.completionDynamics')}</Text>
        <View style={styles.rateContainer}>
          <Text style={styles.rateValue}>{Math.round(currentRate)}%</Text>
          <Text style={styles.rateLabel}>{t('charts.last7Days')}</Text>
        </View>
      </View>
      <View style={styles.chartWrapper}>
        <LineChart
          data={chartData}
          width={screenWidth - 32}
          height={80}
          withDots={true}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={false}
          withVerticalLabels={false}
          withHorizontalLabels={false}
          yAxisSuffix="%"
          fromZero={true}
          chartConfig={{
            backgroundColor: 'transparent',
            backgroundGradientFrom: colors.surface,
            backgroundGradientTo: colors.surface,
            backgroundGradientFromOpacity: 0,
            backgroundGradientToOpacity: 0,
            decimalPlaces: 0,
            color: () => colors.primary,
            labelColor: () => colors.textSecondary,
            propsForDots: {
              r: '5',
              strokeWidth: '0',
              fill: colors.primary,
            },
            propsForLabels: {
              fontSize: 10,
              fontWeight: '600',
            },
            fillShadowGradient: 'transparent',
            fillShadowGradientOpacity: 0,
          }}
          bezier
          style={styles.chart}
        />
      </View>
      <View style={styles.labelsContainer}>
        <Text style={styles.label}>{chartData.startLabel}</Text>
        <Text style={styles.label}>{t('charts.today').toUpperCase()}</Text>
      </View>
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  rateContainer: {
    alignItems: 'flex-end',
  },
  rateValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  rateLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  chartWrapper: {
    marginHorizontal: -16,
  },
  chart: {
    borderRadius: 0,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  emptyContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 200,
  },
});

export default DynamicsChart;
