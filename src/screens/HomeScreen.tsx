import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  HomeBottomNav,
  HomeHeader,
  LocationBanner,
  SilentModeCard,
  SosHoldButton,
} from '../components/home';
import { colors, config } from '../constants';
import { useDeviceStatus } from '../hooks';
import type { RootStackParamList } from '../navigation';
import {
  getActiveSosEventId,
  requestLocationPermission,
  requestNotificationPermission,
  triggerSOS,
} from '../services';
import { useAppStore } from '../store';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const session = useAppStore((s) => s.session);
  const setActiveSos = useAppStore((s) => s.setActiveSos);
  const { gpsStatus, refreshGps } = useDeviceStatus();
  const [sosError, setSosError] = useState<string | null>(null);

  const [silentMode, setSilentMode] = useState(false);
  const [holding, setHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearHoldTimers = useCallback(() => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    holdTimerRef.current = null;
    intervalRef.current = null;
    setHolding(false);
    setHoldProgress(0);
  }, []);

  useEffect(() => () => clearHoldTimers(), [clearHoldTimers]);

  useEffect(() => {
    void requestLocationPermission().then(() => refreshGps());
  }, [refreshGps]);

  const activateSos = useCallback(async () => {
    const userId = session?.user.id;
    if (!userId) {
      setSosError('You must be signed in to trigger SOS.');
      return;
    }

    setSosError(null);
    try {
      await requestLocationPermission();
      await requestNotificationPermission();
      refreshGps();
      await triggerSOS(userId);
      const eventId = getActiveSosEventId();
      if (!eventId) {
        throw new Error('SOS event was not created.');
      }
      setActiveSos(eventId, Date.now());
      navigation.navigate('SOSActive', { eventId });
    } catch (e) {
      setSosError(e instanceof Error ? e.message : 'Failed to trigger SOS');
    }
  }, [navigation, refreshGps, session?.user.id, setActiveSos]);

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

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <HomeHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LocationBanner gpsStatus={gpsStatus} />

        <SosHoldButton
          holding={holding}
          holdProgress={holdProgress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        />

        <SilentModeCard enabled={silentMode} onToggle={setSilentMode} />

        {sosError ? <Text style={styles.sosError}>{sosError}</Text> : null}
      </ScrollView>

      <HomeBottomNav navigation={navigation} activeTab="sos" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  sosError: {
    color: colors.error,
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 8,
    fontSize: 13,
  },
});
