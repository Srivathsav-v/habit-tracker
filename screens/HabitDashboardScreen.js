import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp }    from '../context/AppContext';
import { useHabits } from '../context/HabitContext';
import { getCounts } from '../utils/counts';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function groupByDate(timestamps) {
  if (!timestamps || timestamps.length === 0) return [];

  const sorted = [...timestamps].sort((a, b) => new Date(b) - new Date(a));
  const now    = new Date();

  const key = d =>
    `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  const todayKey     = key(now);
  const yesterday    = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = key(yesterday);

  const groups = [];
  let cur = null;

  for (const ts of sorted) {
    const d   = new Date(ts);
    const dk  = key(d);
    let label;
    if      (dk === todayKey)     label = 'Today';
    else if (dk === yesterdayKey) label = 'Yesterday';
    else
      label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    if (!cur || cur.key !== dk) {
      cur = { key: dk, label, times: [] };
      groups.push(cur);
    }

    cur.times.push(
      d.toLocaleTimeString('en-US', {
        hour:   'numeric',
        minute: '2-digit',
        hour12: true,
      })
    );
  }

  return groups;
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────────────────────
export default function HabitDashboardScreen({ route, navigation }) {
  const { habitId } = route.params;
  const { C }       = useApp();
  const { habits }  = useHabits();
  const styles      = useMemo(() => makeStyles(C), [C]);

  const habit = habits.find(h => h.id === habitId);
  const counts = useMemo(
    () => getCounts(habit?.timestamps ?? []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [habit?.timestamps.length]
  );
  const groups = useMemo(
    () => groupByDate(habit?.timestamps ?? []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [habit?.timestamps.length]
  );

  const handleShare = async () => {
    if (!habit) return;
    const message =
      `${habit.name} this month: ${counts.month}×\n` +
      `Today: ${counts.today}×  ·  This week: ${counts.week}×  ·  This year: ${counts.year}×\n\n` +
      `Tracked with Vault.`;
    try { await Share.share({ message }); } catch {}
  };

  if (!habit) return null;

  const habitColor = habit.colorType === 'green' ? C.green : C.red;

  const STAT_STRIP = [
    { label: 'Today',      value: counts.today },
    { label: 'This Week',  value: counts.week  },
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

      {/* ── Timeline (flex: 1, scrollable) ── */}
      <ScrollView
        style={styles.timeline}
        contentContainerStyle={styles.timelineContent}
        showsVerticalScrollIndicator={false}
      >
        {groups.length === 0 ? (
          <Text style={styles.emptyText}>
            No entries yet.{'\n'}Go back and tap the medallion to start tracking.
          </Text>
        ) : (
          groups.map(group => (
            <View key={group.key} style={styles.group}>
              <Text style={styles.dateHeader}>{group.label}</Text>
              <View style={styles.entriesWrap}>
                {group.times.map((t, i) => (
                  <View key={i} style={styles.entryRow}>
                    <View style={[styles.entryDot, { backgroundColor: habitColor }]} />
                    <Text style={styles.entryTime}>{t}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* ── Pinned stat strip ── */}
      <View style={styles.stripWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stripScroll}
        >
          {STAT_STRIP.map(s => (
            <MiniStatCard
              key={s.label}
              label={s.label}
              value={s.value}
              color={habitColor}
              C={C}
            />
          ))}
        </ScrollView>
      </View>

    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mini stat card (pinned strip)
// ─────────────────────────────────────────────────────────────────────────────
function MiniStatCard({ label, value, color, C }) {
  return (
    <View style={miniCard(C).card}>
      <View style={[miniCard(C).bar, { backgroundColor: color }]} />
      <Text style={miniCard(C).value}>{value}×</Text>
      <Text style={miniCard(C).label}>{label}</Text>
    </View>
  );
}

function miniCard(C) {
  return StyleSheet.create({
    card: {
      width:            90,
      marginHorizontal: 5,
      backgroundColor:  C.card,
      borderRadius:     12,
      borderWidth:      1,
      borderColor:      C.goldBorder,
      alignItems:       'center',
      paddingVertical:  14,
      overflow:         'hidden',
      shadowColor:      C.gold,
      shadowOffset:     { width: 0, height: 2 },
      shadowOpacity:    0.10,
      shadowRadius:     8,
      elevation:        3,
    },
    bar: {
      position: 'absolute',
      top:      0,
      left:     0,
      right:    0,
      height:   3,
      opacity:  0.75,
    },
    value: {
      color:         C.gold,
      fontSize:      22,
      fontWeight:    '700',
      letterSpacing: 0.4,
      marginTop:     6,
    },
    label: {
      color:         C.sub,
      fontSize:      9,
      letterSpacing: 0.7,
      textTransform: 'uppercase',
      marginTop:     5,
      textAlign:     'center',
      paddingHorizontal: 4,
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
function makeStyles(C) {
  return StyleSheet.create({
    safe: {
      flex:            1,
      backgroundColor: C.bg,
    },

    // ── Header ────────────────────────────────────────
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

    // ── Title ─────────────────────────────────────────
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
      fontSize:      24,
      fontWeight:    '600',
      letterSpacing: 0.6,
    },
    divider: {
      marginHorizontal: 22,
      marginTop:        12,
      marginBottom:     0,
      height:           1,
      backgroundColor:  C.goldBorder,
    },

    // ── Timeline ──────────────────────────────────────
    timeline: {
      flex: 1,
    },
    timelineContent: {
      paddingHorizontal: 22,
      paddingTop:        20,
      paddingBottom:     16,
    },
    emptyText: {
      color:      C.sub,
      fontSize:   14,
      fontStyle:  'italic',
      textAlign:  'center',
      lineHeight: 22,
      marginTop:  40,
      opacity:    0.7,
    },

    // ── Date group ────────────────────────────────────
    group: {
      marginBottom: 24,
    },
    dateHeader: {
      color:         C.gold,
      fontSize:      11,
      fontWeight:    '600',
      letterSpacing: 1.1,
      textTransform: 'uppercase',
      marginBottom:  10,
    },
    entriesWrap: {
      // slight indent for entries under the date header
    },
    entryRow: {
      flexDirection: 'row',
      alignItems:    'center',
      paddingVertical: 5,
    },
    entryDot: {
      width:        5,
      height:       5,
      borderRadius: 2.5,
      marginRight:  10,
      opacity:      0.7,
    },
    entryTime: {
      color:         C.text,
      fontSize:      14,
      fontWeight:    '400',
      letterSpacing: 0.3,
      opacity:       0.85,
    },

    // ── Pinned stat strip ─────────────────────────────
    stripWrap: {
      borderTopWidth: 1,
      borderTopColor: C.goldBorder,
      paddingVertical: 14,
      backgroundColor: C.bg,
    },
    stripScroll: {
      paddingHorizontal: 17,
    },
  });
}
