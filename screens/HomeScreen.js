import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp }    from '../context/AppContext';
import { useHabits } from '../context/HabitContext';
import { getCounts } from '../utils/counts';

// borderRadius per shape
const SHAPE_RADIUS = { rounded: 14, pill: 38, square: 4 };

export default function HomeScreen({ navigation }) {
  const { C, settings } = useApp();
  const { habits, updateHabitName } = useHabits();
  const styles = useMemo(() => makeStyles(C), [C]);

  const [modal, setModal]           = useState(null);
  const [inputValue, setInputValue] = useState('');

  const openModal = (habitId, initialValue = '') => {
    setInputValue(initialValue);
    setModal({ habitId, initialValue });
  };

  const confirmModal = () => {
    if (modal && inputValue.trim()) {
      updateHabitName(modal.habitId, inputValue.trim());
    }
    setModal(null);
    setInputValue('');
  };

  const cancelModal = () => {
    setModal(null);
    setInputValue('');
  };

  // Order habits according to settings.habitOrder
  const orderedHabits = useMemo(() => {
    const map = Object.fromEntries(habits.map(h => [h.id, h]));
    return settings.habitOrder.map(id => map[id]).filter(Boolean);
  }, [habits, settings.habitOrder]);

  const cardRadius = SHAPE_RADIUS[settings.buttonShape] ?? 14;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Logo row ── */}
        <View style={styles.logoRow}>
          {/* Left spacer balances the gear icon */}
          <View style={styles.logoSpacer} />

          <View style={styles.logoCenter}>
            <Text style={styles.logo}>VAULT</Text>
            <View style={styles.logoDivider} />
          </View>

          <TouchableOpacity
            style={styles.gearBtn}
            onPress={() => navigation.navigate('Settings')}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.gearIcon}>⚙</Text>
          </TouchableOpacity>
        </View>

        {/* ── Habit Cards ── */}
        <View style={styles.cardsSection}>
          {orderedHabits.map(h => (
            <HabitCard
              key={h.id}
              habit={h}
              cardRadius={cardRadius}
              showCount={settings.showCount}
              C={C}
              onPress={() => {
                if (h.name) {
                  navigation.navigate('HabitDetail', { habitId: h.id });
                } else {
                  openModal(h.id);
                }
              }}
              onLongPress={() => {
                if (h.name) openModal(h.id, h.name);
              }}
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

      {/* ── Add / Rename modal ── */}
      <Modal
        visible={!!modal}
        transparent
        animationType="fade"
        onRequestClose={cancelModal}
      >
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {modal?.initialValue ? 'Rename Habit' : 'Name This Habit'}
            </Text>
            <TextInput
              style={styles.modalInput}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="e.g. Morning Run"
              placeholderTextColor={C.sub}
              autoFocus
              returnKeyType="done"
              maxLength={32}
              onSubmitEditing={confirmModal}
              selectionColor={C.gold}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={cancelModal}
                style={styles.modalCancelBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmModal}
                style={styles.modalConfirmBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.modalConfirmText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Habit card
// ─────────────────────────────────────────────────────────────────────────────
function HabitCard({ habit, cardRadius, showCount, C, onPress, onLongPress }) {
  const color = habit.colorType === 'green' ? C.green : C.red;
  const { month } = getCounts(habit.timestamps);
  const cs = useMemo(() => cardStyles(C, cardRadius), [C, cardRadius]);

  return (
    <TouchableOpacity
      style={cs.card}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.82}
      delayLongPress={450}
    >
      <View style={[cs.stripe, { backgroundColor: color }]} />
      <View style={cs.cardBody}>
        {habit.name ? (
          <>
            <Text style={cs.habitName}>{habit.name}</Text>
            {showCount && (
              <Text style={cs.count}>{month}×</Text>
            )}
          </>
        ) : (
          <Text style={cs.addHabitText}>+ Add Habit</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

function cardStyles(C, radius) {
  return StyleSheet.create({
    card: {
      flexDirection:   'row',
      backgroundColor: C.card,
      borderRadius:    radius,
      borderWidth:     1,
      borderColor:     C.goldBorder,
      marginBottom:    14,
      height:          76,
      overflow:        'hidden',
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
    addHabitText: {
      flex:          1,
      textAlign:     'center',
      color:         C.gold,
      fontSize:      14,
      fontWeight:    '400',
      letterSpacing: 0.6,
      opacity:       0.5,
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Static styles
// ─────────────────────────────────────────────────────────────────────────────
function makeStyles(C) {
  return StyleSheet.create({
    safe: {
      flex:            1,
      backgroundColor: C.bg,
    },
    scroll: {
      paddingTop:    12,
      paddingBottom: 48,
    },

    // ── Logo ─────────────────────────────────────────
    logoRow: {
      flexDirection:     'row',
      alignItems:        'center',
      justifyContent:    'space-between',
      paddingHorizontal: 22,
      paddingTop:        20,
      marginBottom:      40,
    },
    logoSpacer: {
      width: 32,
    },
    logoCenter: {
      flex:       1,
      alignItems: 'center',
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
    gearBtn: {
      width:  32,
      height: 32,
      alignItems:     'center',
      justifyContent: 'center',
    },
    gearIcon: {
      color:    C.gold,
      fontSize: 18,
      opacity:  0.75,
    },

    // ── Cards ────────────────────────────────────────
    cardsSection: {
      paddingHorizontal: 22,
    },

    // ── Dashboard link ───────────────────────────────
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

    // ── Modal ────────────────────────────────────────
    overlay: {
      flex:              1,
      backgroundColor:   'rgba(0,0,0,0.72)',
      alignItems:        'center',
      justifyContent:    'center',
      paddingHorizontal: 32,
    },
    modalCard: {
      width:           '100%',
      backgroundColor: C.card,
      borderRadius:    18,
      borderWidth:     1,
      borderColor:     C.goldBorder,
      padding:         24,
    },
    modalTitle: {
      color:         C.text,
      fontSize:      16,
      fontWeight:    '600',
      letterSpacing: 0.5,
      marginBottom:  16,
      textAlign:     'center',
    },
    modalInput: {
      backgroundColor:   C.bg,
      borderRadius:      10,
      borderWidth:       1,
      borderColor:       C.goldBorder,
      paddingHorizontal: 14,
      paddingVertical:   11,
      color:             C.text,
      fontSize:          15,
      letterSpacing:     0.4,
      marginBottom:      20,
    },
    modalButtons: {
      flexDirection:  'row',
      justifyContent: 'flex-end',
    },
    modalCancelBtn: {
      paddingHorizontal: 16,
      paddingVertical:   9,
      marginRight:       8,
    },
    modalCancelText: {
      color:         C.sub,
      fontSize:      14,
      fontWeight:    '500',
      letterSpacing: 0.3,
    },
    modalConfirmBtn: {
      paddingHorizontal: 20,
      paddingVertical:   9,
      backgroundColor:   'rgba(201,168,76,0.12)',
      borderRadius:      8,
      borderWidth:       1,
      borderColor:       C.goldBorder,
    },
    modalConfirmText: {
      color:         C.gold,
      fontSize:      14,
      fontWeight:    '600',
      letterSpacing: 0.4,
    },
  });
}
