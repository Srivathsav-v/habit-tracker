import React, { useState } from 'react';
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
import { C } from '../constants/theme';
import { useHabits } from '../context/HabitContext';
import { getCounts } from '../utils/counts';

export default function HomeScreen({ navigation }) {
  const { habits, updateHabitName } = useHabits();

  // modal state: null means closed; { habitId, initialValue } means open
  const [modal, setModal] = useState(null);
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
          {habits.map(h => (
            <HabitCard
              key={h.id}
              habit={h}
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
              <TouchableOpacity onPress={cancelModal} style={styles.modalCancelBtn} activeOpacity={0.7}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmModal} style={styles.modalConfirmBtn} activeOpacity={0.7}>
                <Text style={styles.modalConfirmText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

function HabitCard({ habit, onPress, onLongPress }) {
  const color = habit.colorType === 'green' ? C.green : C.red;
  const { month } = getCounts(habit.timestamps);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.82}
      delayLongPress={450}
    >
      {/* left color stripe */}
      <View style={[styles.stripe, { backgroundColor: color }]} />

      {/* card body */}
      <View style={styles.cardBody}>
        {habit.name ? (
          <>
            <Text style={styles.habitName}>{habit.name}</Text>
            <Text style={styles.count}>{month}×</Text>
          </>
        ) : (
          <Text style={styles.addHabitText}>+ Add Habit</Text>
        )}
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

  // ── Modal ─────────────────────────────────────
  overlay: {
    flex:            1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    alignItems:      'center',
    justifyContent:  'center',
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
    backgroundColor:  '#252218',
    borderRadius:     10,
    borderWidth:      1,
    borderColor:      C.goldBorder,
    paddingHorizontal: 14,
    paddingVertical:   11,
    color:            C.text,
    fontSize:         15,
    letterSpacing:    0.4,
    marginBottom:     20,
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
