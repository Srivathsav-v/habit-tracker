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

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Logo ── */}
        <View style={styles.logoRow}>
          <Text style={styles.logo}>VAULT</Text>
          <View style={styles.logoDivider} />
        </View>

        {/* ── Habit Cards ── */}
        <View style={styles.cardsSection}>
          {HABITS.map(h => (
            <HabitCard
              key={h.id}
              habit={h}
              onPress={() => navigation.navigate('HabitDetail', { habit: h })}
            />
          ))}
        </View>

        {/* ── View Dashboard link ── */}
        <TouchableOpacity
          style={styles.dashLink}
          onPress={() => navigation.navigate('GlobalDashboard')}
          activeOpacity={0.7}
        >
          <Text style={styles.dashLinkText}>View Dashboard  →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function HabitCard({ habit, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.82}>
      {/* left color stripe */}
      <View style={[styles.stripe, { backgroundColor: habit.color }]} />

      {/* card body */}
      <View style={styles.cardBody}>
        <Text style={styles.habitName}>{habit.name}</Text>
        <Text style={styles.count}>{habit.month}×</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    paddingTop: 12,
    paddingBottom: 48,
  },

  // ── Logo ──────────────────────────────────────
  logoRow: {
    alignItems: 'center',
    paddingTop: 20,
    marginBottom: 40,
  },
  logo: {
    color:         C.gold,
    fontSize:      15,
    fontWeight:    '700',
    letterSpacing: 7,
  },
  logoDivider: {
    marginTop:       10,
    width:           28,
    height:          1,
    backgroundColor: C.goldBorder,
  },

  // ── Cards ─────────────────────────────────────
  cardsSection: {
    paddingHorizontal: 22,
  },
  card: {
    flexDirection:   'row',
    backgroundColor: C.card,
    borderRadius:    14,
    borderWidth:     1,
    borderColor:     C.goldBorder,
    marginBottom:    14,
    height:          76,
    overflow:        'hidden',
    // warm subtle shadow
    shadowColor:     C.gold,
    shadowOffset:    { width: 0, height: 3 },
    shadowOpacity:   0.10,
    shadowRadius:    10,
    elevation:       4,
  },
  stripe: {
    width: 5,
  },
  cardBody: {
    flex:              1,
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: 20,
  },
  habitName: {
    flex:          1,
    textAlign:     'center',
    color:         C.text,
    fontSize:      16,
    fontWeight:    '500',
    letterSpacing: 0.6,
  },
  count: {
    color:         C.gold,
    fontSize:      15,
    fontWeight:    '600',
    letterSpacing: 0.4,
  },

  // ── Dashboard link ────────────────────────────
  dashLink: {
    marginTop:  28,
    alignItems: 'center',
  },
  dashLinkText: {
    color:         C.gold,
    fontSize:      13,
    fontWeight:    '500',
    letterSpacing: 0.8,
    opacity:       0.85,
  },
});
