import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, AFFIRMATIONS } from '../constants/theme';

const MEDALLION = 210; // diameter of the coin button

export default function HabitDetailScreen({ route, navigation }) {
  const { habit } = route.params;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const affirmation = AFFIRMATIONS[habit.id] ?? "You showed up. That's everything.";

  const pulse = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue:         1.08,
        duration:        120,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(scaleAnim, {
        toValue:         1,
        friction:        4,
        tension:         200,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  };

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

      {/* ── Habit title ── */}
      <Text style={styles.title}>{habit.name}</Text>

      {/* ── Medallion + content ── */}
      <View style={styles.body}>

        {/* Coin / medallion button */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity onPress={pulse} activeOpacity={1} style={styles.medallionWrap}>
            {/* Outer gold ring */}
            <View style={[styles.medallion, { shadowColor: C.gold }]}>
              {/* Inner colour glow disc */}
              <View style={[styles.glowDisc, { backgroundColor: habit.color }]} />
              {/* Inner gold hairline ring for depth */}
              <View style={styles.innerRing} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Count */}
        <Text style={styles.countLarge}>{habit.month}×</Text>
        <Text style={styles.countSub}>this month</Text>

        {/* Affirmation */}
        <Text style={styles.affirmation}>{affirmation}</Text>

        {/* Habit dashboard link */}
        <TouchableOpacity
          style={styles.viewLink}
          onPress={() => navigation.navigate('HabitDashboard', { habit })}
          activeOpacity={0.7}
        >
          <Text style={styles.viewLinkText}>View Habit Dashboard  →</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: C.bg,
  },

  // ── Back ──────────────────────────────────────
  backBtn: {
    paddingTop:        10,
    paddingHorizontal: 22,
    marginBottom:      2,
  },
  backText: {
    color:         C.gold,
    fontSize:      14,
    fontWeight:    '500',
    letterSpacing: 0.4,
  },

  // ── Title ─────────────────────────────────────
  title: {
    color:          C.text,
    fontSize:       28,
    fontWeight:     '600',
    letterSpacing:  0.6,
    textAlign:      'center',
    paddingHorizontal: 24,
    marginTop:      10,
  },

  // ── Body ──────────────────────────────────────
  body: {
    flex:            1,
    alignItems:      'center',
    justifyContent:  'center',
    paddingBottom:   32,
  },

  // ── Medallion ─────────────────────────────────
  medallionWrap: {
    width:        MEDALLION,
    height:       MEDALLION,
    borderRadius: MEDALLION / 2,
  },
  medallion: {
    width:           MEDALLION,
    height:          MEDALLION,
    borderRadius:    MEDALLION / 2,
    backgroundColor: C.card,
    borderWidth:     3.5,
    borderColor:     C.gold,
    alignItems:      'center',
    justifyContent:  'center',
    // gold ambient glow
    shadowOffset:    { width: 0, height: 0 },
    shadowOpacity:   0.55,
    shadowRadius:    28,
    elevation:       16,
  },
  glowDisc: {
    width:        MEDALLION * 0.58,
    height:       MEDALLION * 0.58,
    borderRadius: (MEDALLION * 0.58) / 2,
    opacity:      0.20,
    position:     'absolute',
  },
  innerRing: {
    position:        'absolute',
    width:           MEDALLION - 28,
    height:          MEDALLION - 28,
    borderRadius:    (MEDALLION - 28) / 2,
    borderWidth:     0.8,
    borderColor:     'rgba(201,168,76,0.30)',
  },

  // ── Count ─────────────────────────────────────
  countLarge: {
    marginTop:     34,
    color:         C.gold,
    fontSize:      44,
    fontWeight:    '700',
    letterSpacing: 1,
  },
  countSub: {
    color:         C.sub,
    fontSize:      13,
    letterSpacing: 0.8,
    marginTop:     2,
    textTransform: 'uppercase',
  },

  // ── Affirmation ───────────────────────────────
  affirmation: {
    marginTop:         28,
    color:             C.text,
    fontSize:          15,
    fontStyle:         'italic',
    textAlign:         'center',
    lineHeight:        23,
    paddingHorizontal: 44,
    opacity:           0.80,
  },

  // ── Dashboard link ────────────────────────────
  viewLink: {
    marginTop: 36,
  },
  viewLinkText: {
    color:         C.gold,
    fontSize:      13,
    fontWeight:    '500',
    letterSpacing: 0.7,
    opacity:       0.85,
  },
});
