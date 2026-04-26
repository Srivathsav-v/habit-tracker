import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '../constants/theme';
import { useHabits } from '../context/HabitContext';
import { getCounts } from '../utils/counts';

export default function HabitDashboardScreen({ route, navigation }) {
  const { habitId } = route.params;
  const { habits } = useHabits();

  const habit = habits.find(h => h.id === habitId);
  const counts = useMemo(
    () => getCounts(habit?.timestamps ?? []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [habit?.timestamps.length]
  );

  const handleShare = async () => {
    if (!habit) return;
    const message =
      `${habit.name} this month: ${counts.month}×\n` +
      `Today: ${counts.today}×  ·  This year: ${counts.year}×\n\n` +
      `Tracked with Vault.`;
    try { await Share.share({ message }); } catch {}
  };

  if (!habit) return null;

  const habitColor = habit.colorType === 'green' ? C.green : C.red;

  const STATS = [
    { label: 'Today',      value: counts.today },
    { label: 'This Month', value: counts.month },
    { label: 'This Year',  value: counts.year  },
  ];

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── Header row: Back + Share ── */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.shareBtn}
          onPress={handleShare}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.shareIcon}>↑</Text>
        </TouchableOpacity>
      </View>

      {/* ── Title ── */}
      <View style={styles.titleRow}>
        <View style={[styles.titleDot, { backgroundColor: habitColor }]} />
        <Text style={styles.title}>{habit.name}</Text>
      </View>
      <View style={styles.divider} />

      {/* ── Stat cards ── */}
      <View style={styles.statsArea}>
        {STATS.map(s => (
          <StatCard key={s.label} label={s.label} value={s.value} color={habitColor} />
        ))}
      </View>

      {/* ── Flavour line ── */}
      <Text style={styles.flavour}>
        Every number here is a decision you made.
      </Text>

    </SafeAreaView>
  );
}

function StatCard({ label, value, color }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.accentBar, { backgroundColor: color }]} />
      <Text style={styles.statValue}>{value}×</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: C.bg,
  },

  // ── Header ────────────────────────────────────
  headerRow: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingTop:        14,
    paddingHorizontal: 22,
    marginBottom:      6,
  },
  backBtn: {},
  backText: {
    color:         C.gold,
    fontSize:      14,
    fontWeight:    '500',
    letterSpacing: 0.4,
  },
  shareBtn: {
    width:           32,
    height:          32,
    borderRadius:    16,
    borderWidth:     1,
    borderColor:     C.goldBorder,
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: 'rgba(201,168,76,0.08)',
  },
  shareIcon: {
    color:      C.gold,
    fontSize:   16,
    fontWeight: '600',
    lineHeight: 20,
  },

  // ── Title ─────────────────────────────────────
  titleRow: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: 22,
    marginTop:         12,
  },
  titleDot: {
    width:        10,
    height:       10,
    borderRadius: 5,
    marginRight:  10,
    marginTop:    2,
  },
  title: {
    color:         C.text,
    fontSize:      26,
    fontWeight:    '600',
    letterSpacing: 0.6,
  },
  divider: {
    marginHorizontal: 22,
    marginTop:        14,
    marginBottom:     36,
    height:           1,
    backgroundColor:  C.goldBorder,
  },

  // ── Stats ─────────────────────────────────────
  statsArea: {
    flexDirection:     'row',
    paddingHorizontal: 22,
  },
  statCard: {
    flex:             1,
    marginHorizontal: 5,
    backgroundColor:  C.card,
    borderRadius:     14,
    borderWidth:      1,
    borderColor:      C.goldBorder,
    alignItems:       'center',
    paddingVertical:  22,
    overflow:         'hidden',
    shadowColor:      C.gold,
    shadowOffset:     { width: 0, height: 3 },
    shadowOpacity:    0.10,
    shadowRadius:     10,
    elevation:        4,
  },
  accentBar: {
    position: 'absolute',
    top:      0,
    left:     0,
    right:    0,
    height:   3,
    opacity:  0.75,
  },
  statValue: {
    color:         C.gold,
    fontSize:      34,
    fontWeight:    '700',
    letterSpacing: 0.5,
    marginTop:     8,
  },
  statLabel: {
    color:         C.sub,
    fontSize:      11,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    marginTop:     6,
  },

  // ── Flavour text ──────────────────────────────
  flavour: {
    marginTop:         44,
    color:             C.sub,
    fontSize:          13,
    fontStyle:         'italic',
    textAlign:         'center',
    paddingHorizontal: 36,
    lineHeight:        20,
    opacity:           0.7,
  },
});
