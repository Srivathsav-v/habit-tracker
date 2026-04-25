import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, HABITS } from '../constants/theme';

export default function GlobalDashboardScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Back ── */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* ── Title ── */}
        <Text style={styles.title}>All Habits</Text>
        <View style={styles.titleDivider} />

        {/* ── Stat column headers ── */}
        <View style={styles.colHeaders}>
          <View style={styles.nameCol} />
          {['Today', 'This Month', 'This Year'].map(lbl => (
            <Text key={lbl} style={styles.colHeader}>{lbl}</Text>
          ))}
        </View>

        {/* ── Habit rows ── */}
        {HABITS.map((h, i) => (
          <HabitRow key={h.id} habit={h} isLast={i === HABITS.length - 1} />
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

function HabitRow({ habit, isLast }) {
  return (
    <View style={[styles.row, isLast && styles.rowLast]}>
      {/* name column */}
      <View style={styles.nameCol}>
        <View style={[styles.dot, { backgroundColor: habit.color }]} />
        <Text style={styles.habitName} numberOfLines={1}>{habit.name}</Text>
      </View>

      {/* stat columns */}
      {[habit.today, habit.month, habit.year].map((val, idx) => (
        <View key={idx} style={styles.statCol}>
          <Text style={styles.statNum}>{val}×</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: C.bg,
  },
  scroll: {
    paddingBottom: 48,
  },

  // ── Back ──────────────────────────────────────
  backBtn: {
    paddingTop:        14,
    paddingHorizontal: 22,
    marginBottom:      6,
  },
  backText: {
    color:         C.gold,
    fontSize:      14,
    fontWeight:    '500',
    letterSpacing: 0.4,
  },

  // ── Title ─────────────────────────────────────
  title: {
    color:             C.text,
    fontSize:          26,
    fontWeight:        '600',
    letterSpacing:     0.6,
    paddingHorizontal: 22,
    marginTop:         12,
  },
  titleDivider: {
    marginHorizontal: 22,
    marginTop:        14,
    marginBottom:     24,
    height:           1,
    backgroundColor:  C.goldBorder,
  },

  // ── Column headers ────────────────────────────
  colHeaders: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: 22,
    marginBottom:      10,
  },
  nameCol: {
    flex:          1.6,
    flexDirection: 'row',
    alignItems:    'center',
  },
  colHeader: {
    flex:          1,
    color:         C.sub,
    fontSize:      10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    textAlign:     'center',
  },

  // ── Habit row ─────────────────────────────────
  row: {
    flexDirection:   'row',
    alignItems:      'center',
    marginHorizontal: 22,
    paddingVertical:  16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.goldBorder,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  dot: {
    width:        8,
    height:       8,
    borderRadius: 4,
    marginRight:  10,
  },
  habitName: {
    color:         C.text,
    fontSize:      15,
    fontWeight:    '500',
    letterSpacing: 0.3,
  },
  statCol: {
    flex:       1,
    alignItems: 'center',
  },
  statNum: {
    color:         C.gold,
    fontSize:      17,
    fontWeight:    '600',
    letterSpacing: 0.4,
  },
});
