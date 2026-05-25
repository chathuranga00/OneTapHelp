import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { colors } from '../constants';
import {
  AuthScreen,
  EmergencyGuideScreen,
  HistoryScreen,
  HomeScreen,
  OnboardingScreen,
  SettingsScreen,
  SetupContactsScreen,
  SOSActiveScreen,
} from '../screens';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: '700' as const },
  headerShadowVisible: false,
  contentStyle: { backgroundColor: colors.background },
  animation: 'fade' as const,
};

export function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Onboarding" screenOptions={screenOptions}>
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="SetupContacts"
        component={SetupContactsScreen}
        options={{ title: 'Contacts' }}
      />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="SOSActive"
        component={SOSActiveScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'History' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      <Stack.Screen
        name="EmergencyGuide"
        component={EmergencyGuideScreen}
        options={{ title: 'Emergency guide' }}
      />
    </Stack.Navigator>
  );
}
