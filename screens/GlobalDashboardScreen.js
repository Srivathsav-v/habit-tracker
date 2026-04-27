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

export default function GlobalDashboardScreen({ navigation }) {
  const { C }       = useApp();
  const { habits }  = useHabits();
  const styles      = useMemo(() => makeStyles(C), [C]);
  const namedHabits = habits.filter(h => h.name);

  const handleShare = async () => {
    const lines = namedHabits
      .map(h => `${h.name} — ${getCounts(h.timestamps).month}×`)
      .join('\n');
    const message = `My habit stats this month:\n\n${lines}\n\nTracked with Vault.`;
    try { await Share.share({ message }); } catch {}
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
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
        <Text style={styles.title}>All Habits</Text>
        <View style={styles.titleDivider} />

        {namedHabits.length === 0 ? (
          <Text style={styles.emptyText}>
            No habits named yet. Add one from the home screen.
          </Text>
        ) : (
          <>
            {/* ── Column headers ── */}
            <View style={styles.colHeaders}>
              <View style={styles.nameCol} />
              {['Today', 'This Month', 'This Year'].map(lbl => (
                <Text key={lbl} style={styles.colHeader}>{lbl}</Text>
              ))}
            </View>

            {/* ── Habit rows ── */}
            {namedHabits.map((h, i) => {
              const counts = getCounts(h.timestamps);
              const color  = h.colorType === 'green' ? C.green : C.red;
              return (
                <HabitRow
                  key={h.id}
                  habit={h}
                  color={color}
                  counts={counts}
                  isLast={i === namedHabits.length - 1}
                  C={C}
                />
              );
            })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function HabitRow({ habit, color, counts, isLast, C }) {
  return (
    <View style={rowStyles(C, isLast).row}>
      <View style={rowStyles(C).nameCol}>
        <View style={[rowStyles(C).dot, { backgroundColor: color }]} />
        <Text style={rowStyles(C).habitName} numberOfLines={1}>{habit.name}</Text>
      </View>
      {[counts.today, counts.month, counts.year].map((val, idx) => (
        <View key={idx} style={rowStyles(C).statCol}>
          <Text style={rowStyles(C).statNum}>{val}×</Text>
        </View>
      ))}
    </View>
  );
}

function rowStyles(C, isLast = false) {
  return StyleSheet.create({
    row: {
      flexDirection:     'row',
      alignItems:        'center',
      marginHorizontal:  22,
      paddingVertical:   16,
      borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
      borderBottomColor: C.goldBorder,
    },
    nameCol: {
      flex:          1.6,
      flexDirection: 'row',
      alignItems:    'center',
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
}

function makeStyles(C) {
  return StyleSheet.create({
    safe: {
      flex:            1,
      backgroundColor: C.bg,
    },
    scroll: {
      paddingBottom: 48,
    },

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

    emptyText: {
      color:             C.sub,
      fontSize:          14,
      textAlign:         'center',
      paddingHorizontal: 36,
      marginTop:         40,
      lineHeight:        22,
      fontStyle:         'italic',
    },

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
  });
}
