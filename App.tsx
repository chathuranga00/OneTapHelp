import 'react-native-gesture-handler';

import { MaterialCommunityIcons } from './src/icons';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from './src/constants';
import { appTheme } from './src/hooks';
import { linking, RootNavigator } from './src/navigation';

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.primary,
  },
};

export default function App() {
  return (
    <SafeAreaProvider style={styles.root}>
      <PaperProvider
        theme={appTheme}
        settings={{
          icon: (props) => <MaterialCommunityIcons {...props} />,
        }}
      >
        <NavigationContainer
          theme={navigationTheme}
          linking={linking}
          fallback={
            <View style={styles.fallback}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.fallbackText}>Loading…</Text>
            </View>
          }
          documentTitle={{
            formatter: (options, route) =>
              options?.title ?? route?.name ?? 'One Tap Help',
          }}
          style={styles.root}
        >
          <StatusBar style="light" />
          <RootNavigator />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    ...(Platform.OS === 'web' ? { minHeight: '100vh' } : null),
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    gap: 12,
  },
  fallbackText: {
    color: colors.textSecondary,
  },
});
