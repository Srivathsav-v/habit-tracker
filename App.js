import React from 'react';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import HomeScreen            from './screens/HomeScreen';
import HabitDetailScreen     from './screens/HabitDetailScreen';
import GlobalDashboardScreen from './screens/GlobalDashboardScreen';
import HabitDashboardScreen  from './screens/HabitDashboardScreen';
import SettingsScreen        from './screens/SettingsScreen';
import { HabitProvider }     from './context/HabitContext';
import { AppProvider, useApp } from './context/AppContext';

const Stack = createNativeStackNavigator();

const PHONE_W = 390;
const PHONE_H = 844;

// ── Navigator lives inside both providers so it can call useApp() ──────────
function Navigator() {
  const { C, isDark } = useApp();
  return (
    <NavigationContainer>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack.Navigator
        screenOptions={{
          headerShown:  false,
          contentStyle: { backgroundColor: C.bg },
          animation:    'slide_from_right',
        }}
      >
        <Stack.Screen name="Home"            component={HomeScreen} />
        <Stack.Screen name="HabitDetail"     component={HabitDetailScreen} />
        <Stack.Screen name="GlobalDashboard" component={GlobalDashboardScreen} />
        <Stack.Screen name="HabitDashboard"  component={HabitDashboardScreen} />
        <Stack.Screen name="Settings"        component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ── AppShell handles the phone-frame wrapper on web ────────────────────────
function AppShell() {
  const { C } = useApp();
  const { width: winW, height: winH } = useWindowDimensions();

  if (Platform.OS !== 'web') {
    return <Navigator />;
  }

  const scale = Math.min((winW - 24) / PHONE_W, (winH - 24) / PHONE_H, 1);

  return (
    <View style={styles.root}>
      {/* warm ambient glow behind the frame */}
      <View
        style={[
          styles.glow,
          {
            width:       PHONE_W * scale,
            height:      PHONE_H * scale,
            shadowColor: C.gold,
          },
        ]}
      />
      <View
        style={{
          width:           PHONE_W,
          height:          PHONE_H,
          borderRadius:    44,
          overflow:        'hidden',
          backgroundColor: C.bg,
          borderWidth:     1,
          borderColor:     'rgba(201,168,76,0.18)',
          transform:       [{ scale }],
        }}
      >
        <Navigator />
      </View>
    </View>
  );
}

// ── Root: providers wrap everything ───────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <HabitProvider>
        <AppShell />
      </HabitProvider>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex:            1,
    backgroundColor: '#080704',
    alignItems:      'center',
    justifyContent:  'center',
  },
  glow: {
    position:        'absolute',
    borderRadius:    44,
    backgroundColor: 'transparent',
    shadowOffset:    { width: 0, height: 0 },
    shadowOpacity:   0.22,
    shadowRadius:    80,
  },
});
