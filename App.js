import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AppProvider } from './src/context/AppContext';
import { colors } from './src/theme';

import ForecastScreen from './src/screens/ForecastScreen';
import TimelineScreen from './src/screens/TimelineScreen';
import ActivityScreen from './src/screens/ActivityScreen';
import GlossaryScreen from './src/screens/GlossaryScreen';
import ModelsScreen from './src/screens/ModelsScreen';

const Stack = createNativeStackNavigator();

// Usamos cabeçalhos próprios (ScreenHeader) para ter controle total de
// acessibilidade, então o header nativo fica desativado.
const navTheme = {
  dark: false,
  colors: {
    primary: colors.primary,
    background: colors.background,
    card: colors.background,
    text: colors.textPrimary,
    border: colors.border,
    notification: colors.primary,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="dark" />
          <Stack.Navigator
            initialRouteName="Forecast"
            screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}
          >
            <Stack.Screen name="Forecast" component={ForecastScreen} />
            <Stack.Screen name="Timeline" component={TimelineScreen} />
            <Stack.Screen name="Activity" component={ActivityScreen} />
            <Stack.Screen name="Glossary" component={GlossaryScreen} />
            <Stack.Screen name="Models" component={ModelsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
