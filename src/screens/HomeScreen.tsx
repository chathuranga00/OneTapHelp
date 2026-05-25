import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { ScreenLayout } from '../components';
import { colors, config, strings } from '../constants';
import { useDeviceStatus, type GpsStatus } from '../hooks';
import type { RootStackParamList } from '../navigation';
import { requestLocationPermission, requestNotificationPermission } from '../services';
import { useAppStore } from '../store';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const SOS_SIZE = 220;

function gpsLabel(status: GpsStatus): string {
  switch (status) {
    case 'active':
      return strings.home.gpsActive;
    case 'denied':
      return strings.home.gpsDenied;
    case 'checking':
      return strings.home.gpsChecking;
    default:
      return strings.home.gpsUnavailable;
  }
}

export function HomeScreen({ navigation }: Props) {
  const setIsSosActive = useAppStore((s) => s.setIsSosActive);
  const emergencyContacts = useAppStore((s) => s.emergencyContacts);
  const { gpsStatus, batteryPercent, refreshGps } = useDeviceStatus();

  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [holding, setHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  const clearHoldTimers = useCallback(() => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    holdTimerRef.current = null;
    intervalRef.current = null;
    setHolding(false);
    setHoldProgress(0);
  }, []);

  useEffect(() => () => clearHoldTimers(), [clearHoldTimers]);

  const activateSos = useCallback(async () => {
    await requestLocationPermission();
    await requestNotificationPermission();
    refreshGps();
    setIsSosActive(true);
    navigation.navigate('SOSActive');
  }, [navigation, refreshGps, setIsSosActive]);

  const onPressIn = () => {
    setHolding(true);
    setHoldProgress(0);
    const startedAt = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setHoldProgress(Math.min(1, elapsed / config.sosHoldDurationMs));
    }, 50);

    holdTimerRef.current = setTimeout(() => {
      clearHoldTimers();
      void activateSos();
    }, config.sosHoldDurationMs);
  };

  const onPressOut = () => {
    clearHoldTimers();
  };

  const batteryText =
    batteryPercent !== null ? `${batteryPercent}%` : Platform.OS === 'web' ? 'N/A' : '—';

  return (
    <ScreenLayout contentStyle={styles.layout}>
      <View style={styles.statusBar}>
        <Text style={[styles.statusItem, gpsStatus === 'active' && styles.statusOk]}>
          {gpsLabel(gpsStatus)}
        </Text>
        <Text style={styles.statusItem}>
          {strings.home.contacts}: {emergencyContacts.length}
        </Text>
        <Text style={styles.statusItem}>
          {strings.home.battery}: {batteryText}
        </Text>
      </View>

      <View style={styles.center}>
        <Text style={styles.hint}>{strings.home.sosHint}</Text>

        <Pressable
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={({ pressed }) => [
            styles.sosButton,
            (pressed || holding) && styles.sosButtonActive,
          ]}
          accessibilityRole="button"
          accessibilityLabel={strings.home.sosLabel}
          accessibilityHint={strings.home.sosHint}
        >
          {holding ? (
            <View
              style={[styles.holdRing, { opacity: 0.35 + holdProgress * 0.65 }]}
            />
          ) : null}
          <Text style={styles.sosText}>{strings.home.sosLabel}</Text>
        </Pressable>
      </View>

      <View style={styles.bottomNav}>
        <Pressable style={styles.navLink} onPress={() => navigation.navigate('History')}>
          <Text style={styles.navLinkText}>{strings.home.history}</Text>
        </Pressable>
        <View style={styles.navDivider} />
        <Pressable style={styles.navLink} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.navLinkText}>{strings.home.settings}</Text>
        </Pressable>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
  statusBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statusItem: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  statusOk: {
    color: colors.success,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  hint: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 28,
    textTransform: 'uppercase',
  },
  sosButton: {
    width: SOS_SIZE,
    height: SOS_SIZE,
    minWidth: 200,
    minHeight: 200,
    borderRadius: SOS_SIZE / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    borderColor: colors.primaryDark,
    elevation: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.75,
    shadowRadius: 28,
    overflow: 'hidden',
  },
  sosButtonActive: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: 0.96 }],
  },
  holdRing: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.text,
    borderRadius: SOS_SIZE / 2,
  },
  sosText: {
    color: colors.text,
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 6,
    zIndex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 16,
    marginBottom: 8,
  },
  navLink: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navLinkText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  navDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
});
