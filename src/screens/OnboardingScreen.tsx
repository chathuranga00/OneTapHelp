import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { ScreenLayout } from '../components';
import { colors, strings } from '../constants';
import type { RootStackParamList } from '../navigation';
import { useAppStore } from '../store';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export function OnboardingScreen({ navigation }: Props) {
  const setHasCompletedOnboarding = useAppStore((s) => s.setHasCompletedOnboarding);

  const handleGetStarted = () => {
    setHasCompletedOnboarding(true);
    navigation.replace('Auth');
  };

  return (
    <ScreenLayout
      footer={
        <Button
          mode="contained"
          onPress={handleGetStarted}
          buttonColor={colors.primary}
          textColor={colors.text}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          {strings.onboarding.getStarted}
        </Button>
      }
    >
      <View style={styles.hero}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>SOS</Text>
        </View>
        <Text style={styles.appName}>{strings.appName}</Text>
        <Text style={styles.title}>{strings.onboarding.title}</Text>
        <Text style={styles.subtitle}>{strings.onboarding.subtitle}</Text>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  badge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  badgeText: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 2,
  },
  appName: {
    color: colors.textMuted,
    fontSize: 13,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    borderRadius: 4,
  },
  buttonContent: {
    paddingVertical: 6,
  },
});
