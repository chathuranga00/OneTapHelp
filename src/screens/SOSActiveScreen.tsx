import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { ScreenLayout } from '../components';
import { colors, strings } from '../constants';
import type { RootStackParamList } from '../navigation';
import {
  getCurrentPosition,
  playAlarmLoop,
  scheduleLocalAlert,
  stopAlarm,
  watchPosition,
} from '../services';
import { useAppStore } from '../store';

type Props = NativeStackScreenProps<RootStackParamList, 'SOSActive'>;

export function SOSActiveScreen({ navigation }: Props) {
  const setIsSosActive = useAppStore((s) => s.setIsSosActive);
  const emergencyContacts = useAppStore((s) => s.emergencyContacts);

  useEffect(() => {
    let stopWatching: (() => void) | undefined;

    const activate = async () => {
      await playAlarmLoop();
      await scheduleLocalAlert(
        strings.sosActive.title,
        `Notifying ${emergencyContacts.length} contact(s)`,
      );
      await getCurrentPosition();
      stopWatching = await watchPosition(() => undefined, 10_000);
    };

    void activate();

    return () => {
      void stopAlarm();
      stopWatching?.();
    };
  }, [emergencyContacts.length]);

  const handleCancel = async () => {
    await stopAlarm();
    setIsSosActive(false);
    navigation.replace('Home');
  };

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <View style={styles.pulseOuter}>
          <View style={styles.pulseInner}>
            <Text style={styles.alertText}>{strings.sosActive.title}</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>{strings.sosActive.subtitle}</Text>
        <Text style={styles.detail}>
          Alerting {emergencyContacts.length} emergency contact
          {emergencyContacts.length === 1 ? '' : 's'}
        </Text>
        <Button
          mode="outlined"
          onPress={handleCancel}
          textColor={colors.text}
          style={styles.cancelButton}
        >
          {strings.sosActive.cancel}
        </Button>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseOuter: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 3,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(204, 0, 0, 0.15)',
  },
  pulseInner: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertText: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 3,
  },
  subtitle: {
    color: colors.text,
    fontSize: 18,
    marginTop: 32,
    fontWeight: '600',
  },
  detail: {
    color: colors.textSecondary,
    marginTop: 8,
    fontSize: 14,
  },
  cancelButton: {
    marginTop: 48,
    borderColor: colors.border,
    minWidth: 200,
  },
});
