import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  PanResponder,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp }    from '../context/AppContext';
import { useHabits } from '../context/HabitContext';

// ─────────────────────────────────────────────────────────────────────────────
// Drag-to-reorder constants
// ─────────────────────────────────────────────────────────────────────────────
const DRAG_H = 58;   // height of each reorder row (matches style below)

// ─────────────────────────────────────────────────────────────────────────────
// Root screen
// ─────────────────────────────────────────────────────────────────────────────
export default function SettingsScreen({ navigation }) {
  const { C, settings, updateSettings } = useApp();
  const { habits } = useHabits();
  const styles = useMemo(() => makeStyles(C), [C]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        // Disable scroll while dragging so PanResponder can claim the gesture
        scrollEnabled
      >
        {/* ── Header ── */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Settings</Text>
          <View style={{ width: 48 }} />
        </View>
        <View style={styles.divider} />

        {/* ── Appearance ── */}
        <SectionHeader label="APPEARANCE" styles={styles} />
        <View style={styles.card}>
          <Text style={styles.rowLabel}>Theme</Text>
          <SegmentControl
            C={C}
            options={[
              { label: 'System', value: 'system' },
              { label: 'Dark',   value: 'dark'   },
              { label: 'Light',  value: 'light'  },
            ]}
            value={settings.themePref}
            onChange={v => updateSettings({ themePref: v })}
          />
        </View>

        {/* ── Display ── */}
        <SectionHeader label="DISPLAY" styles={styles} />
        <View style={[styles.card, styles.rowBetween]}>
          <Text style={styles.rowLabel}>Show count on cards</Text>
          <Toggle
            C={C}
            value={settings.showCount}
            onToggle={() => updateSettings({ showCount: !settings.showCount })}
          />
        </View>

        {/* ── Habit Cards ── */}
        <SectionHeader label="HABIT CARDS" styles={styles} />
        <View style={styles.card}>
          <Text style={styles.rowLabel}>Card style</Text>
          <View style={styles.shapeRow}>
            {[
              { label: 'Rounded', value: 'rounded', radius: 14 },
              { label: 'Pill',    value: 'pill',    radius: 38 },
              { label: 'Square',  value: 'square',  radius: 4  },
            ].map(opt => (
              <ShapeOption
                key={opt.value}
                C={C}
                label={opt.label}
                radius={opt.radius}
                selected={settings.buttonShape === opt.value}
                onPress={() => updateSettings({ buttonShape: opt.value })}
              />
            ))}
          </View>
        </View>

        {/* ── Habit Order ── */}
        <SectionHeader label="HABIT ORDER" styles={styles} />
        <Text style={styles.sectionHint}>Hold and drag the handle to reorder</Text>
        <View style={[styles.card, { paddingHorizontal: 0, paddingVertical: 0 }]}>
          <DraggableList
            order={settings.habitOrder}
            habits={habits}
            C={C}
            onReorder={newOrder => updateSettings({ habitOrder: newOrder })}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Small helpers
// ─────────────────────────────────────────────────────────────────────────────
function SectionHeader({ label, styles }) {
  return <Text style={styles.sectionHeader}>{label}</Text>;
}

// ── Segmented control ────────────────────────────────────────────────────────
function SegmentControl({ C, options, value, onChange }) {
  return (
    <View style={segStyles(C).wrap}>
      {options.map(opt => {
        const active = opt.value === value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[segStyles(C).btn, active && segStyles(C).btnActive]}
            onPress={() => onChange(opt.value)}
            activeOpacity={0.7}
          >
            <Text style={[segStyles(C).text, active && segStyles(C).textActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function segStyles(C) {
  return StyleSheet.create({
    wrap: {
      flexDirection:   'row',
      marginTop:       12,
      borderRadius:    10,
      borderWidth:     1,
      borderColor:     C.goldBorder,
      overflow:        'hidden',
    },
    btn: {
      flex:            1,
      paddingVertical: 9,
      alignItems:      'center',
      backgroundColor: 'transparent',
    },
    btnActive: {
      backgroundColor: 'rgba(201,168,76,0.15)',
    },
    text: {
      color:         C.sub,
      fontSize:      13,
      fontWeight:    '500',
      letterSpacing: 0.3,
    },
    textActive: {
      color:      C.gold,
      fontWeight: '600',
    },
  });
}

// ── Animated toggle ──────────────────────────────────────────────────────────
function Toggle({ C, value, onToggle }) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue:         value ? 1 : 0,
      duration:        200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [2, 22] });
  const trackColor = anim.interpolate({
    inputRange:  [0, 1],
    outputRange: ['rgba(138,128,112,0.3)', 'rgba(201,168,76,0.5)'],
  });
  const borderColor = anim.interpolate({
    inputRange:  [0, 1],
    outputRange: [C.sub, C.gold],
  });

  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
      <Animated.View
        style={{
          width:        44,
          height:       24,
          borderRadius: 12,
          borderWidth:  1,
          borderColor,
          backgroundColor: trackColor,
          justifyContent:  'center',
        }}
      >
        <Animated.View
          style={{
            width:           20,
            height:          20,
            borderRadius:    10,
            backgroundColor: C.text,
            transform:       [{ translateX }],
          }}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

// ── Shape option button ──────────────────────────────────────────────────────
function ShapeOption({ C, label, radius, selected, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={shapeStyles(C, selected).wrap}
    >
      <View style={shapeStyles(C, selected, radius).preview} />
      <Text style={shapeStyles(C, selected).label}>{label}</Text>
    </TouchableOpacity>
  );
}

function shapeStyles(C, selected, radius = 14) {
  return StyleSheet.create({
    wrap: {
      flex:       1,
      alignItems: 'center',
      paddingVertical: 10,
      marginHorizontal: 4,
      borderRadius: 10,
      borderWidth:  1,
      borderColor:  selected ? C.gold : C.goldBorder,
      backgroundColor: selected ? 'rgba(201,168,76,0.10)' : 'transparent',
    },
    preview: {
      width:           44,
      height:          28,
      borderRadius:    radius,
      borderWidth:     1.5,
      borderColor:     selected ? C.gold : C.sub,
      marginBottom:    8,
    },
    label: {
      color:         selected ? C.gold : C.sub,
      fontSize:      11,
      letterSpacing: 0.5,
      fontWeight:    selected ? '600' : '400',
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Drag-to-reorder list
// ─────────────────────────────────────────────────────────────────────────────
function DraggableList({ order, habits, C, onReorder }) {
  // Keep a mutable ref so pan-responder callbacks always see the latest order
  const orderRef   = useRef([...order]);
  const dragging   = useRef(null);             // { id, startIdx }
  const dragOffset = useRef(new Animated.Value(0)).current;
  const [activeId, setActiveId] = useState(null);
  const [renderOrder, setRenderOrder] = useState([...order]);

  // Sync if parent changes (e.g. first load from AsyncStorage)
  useEffect(() => {
    orderRef.current = [...order];
    setRenderOrder([...order]);
  }, [order.join(',')]);

  // Build pan responders — one per ID, created once and reused
  const prsRef = useRef({});
  for (const id of renderOrder) {
    if (!prsRef.current[id]) {
      prsRef.current[id] = PanResponder.create({
        onStartShouldSetPanResponder:         () => true,
        onMoveShouldSetPanResponder:          () => true,
        onStartShouldSetPanResponderCapture:  () => true,
        onMoveShouldSetPanResponderCapture:   () => true,

        onPanResponderGrant: () => {
          const startIdx = orderRef.current.indexOf(id);
          dragging.current = { id, startIdx };
          dragOffset.setValue(0);
          setActiveId(id);
        },

        onPanResponderMove: (_, gs) => {
          if (!dragging.current) return;
          const { startIdx } = dragging.current;
          const n = orderRef.current.length;

          // Where the user wants this item to land
          const targetIdx = Math.max(
            0,
            Math.min(n - 1, Math.round(startIdx + gs.dy / DRAG_H))
          );
          const currentIdx = orderRef.current.indexOf(id);

          // Visual: show sub-slot offset so the item tracks the finger
          const residual = gs.dy - (targetIdx - startIdx) * DRAG_H;
          dragOffset.setValue(residual);

          if (targetIdx !== currentIdx) {
            const newOrder = [...orderRef.current];
            newOrder.splice(currentIdx, 1);
            newOrder.splice(targetIdx, 0, id);
            orderRef.current = newOrder;
            setRenderOrder([...newOrder]);
          }
        },

        onPanResponderRelease: () => {
          Animated.timing(dragOffset, {
            toValue:         0,
            duration:        120,
            useNativeDriver: false,
          }).start();
          setActiveId(null);
          dragging.current = null;
          onReorder([...orderRef.current]);
        },

        onPanResponderTerminate: () => {
          dragOffset.setValue(0);
          setActiveId(null);
          dragging.current = null;
        },
      });
    }
  }

  const habitsMap = Object.fromEntries(habits.map(h => [h.id, h]));

  return (
    <View>
      {renderOrder.map((id, idx) => {
        const habit    = habitsMap[id];
        const isActive = activeId === id;
        const color    = habit?.colorType === 'green' ? C.green : C.red;
        const isLast   = idx === renderOrder.length - 1;

        return (
          <Animated.View
            key={id}
            style={[
              dragRow(C, isActive, isLast).row,
              isActive && {
                transform:    [{ translateY: dragOffset }],
                zIndex:       99,
                shadowColor:  C.gold,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 12,
                elevation:    8,
              },
            ]}
          >
            <View style={[dragRow(C).dot, { backgroundColor: color }]} />
            <Text
              numberOfLines={1}
              style={[dragRow(C).name, { color: C.text }]}
            >
              {habit?.name || `Habit ${id}`}
            </Text>
            {/* Drag handle — pan responder lives here */}
            <View
              {...prsRef.current[id].panHandlers}
              style={dragRow(C).handle}
            >
              <Text style={[dragRow(C).dots, { color: C.sub }]}>⠿</Text>
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
}

function dragRow(C, isActive = false, isLast = false) {
  return StyleSheet.create({
    row: {
      flexDirection:     'row',
      alignItems:        'center',
      height:            DRAG_H,
      paddingHorizontal: 18,
      borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
      borderBottomColor: C.goldBorder,
      backgroundColor:   isActive ? 'rgba(201,168,76,0.06)' : 'transparent',
    },
    dot: {
      width:        8,
      height:       8,
      borderRadius: 4,
      marginRight:  12,
    },
    name: {
      flex:          1,
      fontSize:      15,
      fontWeight:    '500',
      letterSpacing: 0.3,
    },
    handle: {
      paddingLeft:  16,
      paddingRight:  4,
      paddingVertical: 8,
    },
    dots: {
      fontSize:  18,
      lineHeight: 22,
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
      paddingBottom: 48,
    },

    // ── Header ──────────────────────────────────────────────
    headerRow: {
      flexDirection:     'row',
      alignItems:        'center',
      justifyContent:    'space-between',
      paddingTop:        14,
      paddingHorizontal: 22,
      marginBottom:      4,
    },
    backText: {
      color:         C.gold,
      fontSize:      14,
      fontWeight:    '500',
      letterSpacing: 0.4,
      width:         48,
    },
    screenTitle: {
      color:         C.text,
      fontSize:      17,
      fontWeight:    '600',
      letterSpacing: 0.5,
    },
    divider: {
      marginHorizontal: 22,
      marginTop:        12,
      marginBottom:     24,
      height:           1,
      backgroundColor:  C.goldBorder,
    },

    // ── Sections ────────────────────────────────────────────
    sectionHeader: {
      color:             C.sub,
      fontSize:          10,
      fontWeight:        '600',
      letterSpacing:     1.2,
      textTransform:     'uppercase',
      paddingHorizontal: 22,
      marginBottom:      8,
      marginTop:         4,
    },
    sectionHint: {
      color:             C.sub,
      fontSize:          11,
      letterSpacing:     0.3,
      paddingHorizontal: 22,
      marginBottom:      8,
      opacity:           0.7,
      fontStyle:         'italic',
    },

    // ── Card container ──────────────────────────────────────
    card: {
      marginHorizontal:  22,
      marginBottom:      20,
      backgroundColor:   C.card,
      borderRadius:      14,
      borderWidth:       1,
      borderColor:       C.goldBorder,
      padding:           16,
    },
    rowBetween: {
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'space-between',
    },
    rowLabel: {
      color:         C.text,
      fontSize:      15,
      fontWeight:    '500',
      letterSpacing: 0.3,
    },

    // ── Shape row ───────────────────────────────────────────
    shapeRow: {
      flexDirection: 'row',
      marginTop:     12,
    },
  });
}
