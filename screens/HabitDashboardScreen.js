import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '../constants/theme';

const STATS = [
  { label: 'Today',      key: 'today' },
  { label: 'This Month', key: 'month' },
  { label: 'This Year',  key: 'year'  },
];

export default function HabitDashboardScreen({ route, navigation }) {
  const { habit } = route.params;

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── Back ── */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* ── Title ── */}
      <View style={styles.titleRow}>
        <View style={[styles.titleDot, { backgroundColor: habit.color }]} />
        <Text style={styles.title}>{habit.name}</Text>
      </View>
      <View style={styles.divider} />

      {/* ── Stat cards ── */}
      <View style={styles.statsArea}>
        {STATS.map(s => (
          <StatCard key={s.key} label={s.label} value={habit[s.key]} color={habit.color} />
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
      {/* top accent bar in habit colour */}
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
    flex:            1,
    marginHorizontal: 5,
    backgroundColor: C.card,
    borderRadius:    14,
    borderWidth:     1,
    borderColor:     C.goldBorder,
    alignItems:      'center',
    paddingVertical: 22,
    overflow:        'hidden',
    // warm subtle shadow
    shadowColor:     C.gold,
    shadowOffset:    { width: 0, height: 3 },
    shadowOpacity:   0.10,
    shadowRadius:    10,
    elevation:       4,
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
