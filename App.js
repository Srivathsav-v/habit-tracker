import React from 'react';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import HomeScreen            from './screens/HomeScreen';
import HabitDetailScreen     from './screens/HabitDetailScreen';
import GlobalDashboardScreen from './screens/GlobalDashboardScreen';
import HabitDashboardScreen  from './screens/HabitDashboardScreen';
import { C } from './constants/theme';
import { HabitProvider }     from './context/HabitContext';

const Stack = createNativeStackNavigator();

const PHONE_W = 390;
const PHONE_H = 844;

function Navigator() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: C.bg },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Home"            component={HomeScreen} />
        <Stack.Screen name="HabitDetail"     component={HabitDetailScreen} />
        <Stack.Screen name="GlobalDashboard" component={GlobalDashboardScreen} />
        <Stack.Screen name="HabitDashboard"  component={HabitDashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const { width: winW, height: winH } = useWindowDimensions();

  if (Platform.OS !== 'web') {
    return (
      <HabitProvider>
        <Navigator />
      </HabitProvider>
    );
  }

  // Scale the phone frame to always fit the viewport with 24px padding
  const scale = Math.min((winW - 24) / PHONE_W, (winH - 24) / PHONE_H, 1);

  return (
    <View style={styles.root}>
      {/* warm gold ambient glow behind the frame */}
      <View style={[styles.glow, { width: PHONE_W * scale, height: PHONE_H * scale }]} />

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
        <HabitProvider>
          <Navigator />
        </HabitProvider>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#080704',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position:        'absolute',
    borderRadius:    44,
    backgroundColor: 'transparent',
    shadowColor:     C.gold,
    shadowOffset:    { width: 0, height: 0 },
    shadowOpacity:   0.22,
    shadowRadius:    80,
  },
});
