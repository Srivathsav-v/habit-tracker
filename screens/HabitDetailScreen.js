import React, { useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp }    from '../context/AppContext';
import { useHabits } from '../context/HabitContext';
import { getCounts } from '../utils/counts';
import { GREEN_MESSAGES, RED_MESSAGES, getNextMessage } from '../constants/messages';

const MEDALLION = 210;

export default function HabitDetailScreen({ route, navigation }) {
  const { habitId } = route.params;
  const { C }       = useApp();
  const { habits, addTimestamp } = useHabits();
  const styles = useMemo(() => makeStyles(C), [C]);

  const habit = habits.find(h => h.id === habitId);

  const messages    = habit?.colorType === 'green' ? GREEN_MESSAGES : RED_MESSAGES;
  const lastMsgIdx  = useRef(-1);
  const [currentMessage, setCurrentMessage] = useState(() => {
    const { message, idx } = getNextMessage(messages, -1);
    lastMsgIdx.current = idx;
    return message;
  });

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const counts = useMemo(
    () => getCounts(habit?.timestamps ?? []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [habit?.timestamps.length]
  );

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

  const handlePress = () => {
    addTimestamp(habitId);
    const { message, idx } = getNextMessage(messages, lastMsgIdx.current);
    lastMsgIdx.current = idx;
    setCurrentMessage(message);
    pulse();
  };

  if (!habit) return null;

  const habitColor = habit.colorType === 'green' ? C.green : C.red;

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

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity onPress={handlePress} activeOpacity={1} style={styles.medallionWrap}>
            <View style={[styles.medallion, { shadowColor: C.gold }]}>
              <View style={[styles.glowDisc, { backgroundColor: habitColor }]} />
              <View style={styles.innerRing} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.countLarge}>{counts.month}×</Text>
        <Text style={styles.countSub}>this month</Text>

        <Text style={styles.affirmation}>{currentMessage}</Text>

        <TouchableOpacity
          style={styles.viewLink}
          onPress={() => navigation.navigate('HabitDashboard', { habitId })}
          activeOpacity={0.7}
        >
          <Text style={styles.viewLinkText}>View Habit Dashboard  →</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

function makeStyles(C) {
  return StyleSheet.create({
    safe: {
      flex:            1,
      backgroundColor: C.bg,
    },

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

    title: {
      color:             C.text,
      fontSize:          28,
      fontWeight:        '600',
      letterSpacing:     0.6,
      textAlign:         'center',
      paddingHorizontal: 24,
      marginTop:         10,
    },

    body: {
      flex:           1,
      alignItems:     'center',
      justifyContent: 'center',
      paddingBottom:  32,
    },

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
      position:     'absolute',
      width:        MEDALLION - 28,
      height:       MEDALLION - 28,
      borderRadius: (MEDALLION - 28) / 2,
      borderWidth:  0.8,
      borderColor:  'rgba(201,168,76,0.30)',
    },

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
}
