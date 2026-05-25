import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { ScreenLayout } from '../components';
import { colors, strings } from '../constants';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'EmergencyGuide'>;

const GUIDE_STEPS = [
  'Stay as calm as possible. Help is being notified.',
  'If safe, move to a well-lit, public area.',
  'Keep your phone unlocked and volume up.',
  'Do not hang up if you reach emergency services.',
  'Share your exact location when contacts respond.',
] as const;

export function EmergencyGuideScreen(_props: Props) {
  return (
    <ScreenLayout title={strings.emergencyGuide.title} subtitle={strings.emergencyGuide.subtitle} scrollable>
      {GUIDE_STEPS.map((step, index) => (
        <View key={step} style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>{index + 1}</Text>
          </View>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}
      <View style={styles.warning}>
        <Text style={styles.warningText}>
          If you are in immediate danger, call your local emergency number.
        </Text>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  warning: {
    marginTop: 8,
    padding: 16,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 4,
  },
  warningText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
});
