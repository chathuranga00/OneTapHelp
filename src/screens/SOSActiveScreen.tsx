import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '../icons';

import { HomeHeader } from '../components/home';
import { SosLocationMap } from '../components/sos';
import { colors, strings } from '../constants';
import type { RootStackParamList } from '../navigation';
import { getSosEventLocation, resolveSOS } from '../services';
import { useAppStore } from '../store';

type Props = NativeStackScreenProps<RootStackParamList, 'SOSActive'>;

function formatElapsed(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export function SOSActiveScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const eventId = route.params.eventId;
  const sosStartedAt = useAppStore((s) => s.sosStartedAt);
  const emergencyContacts = useAppStore((s) => s.emergencyContacts);
  const clearActiveSos = useAppStore((s) => s.clearActiveSos);

  const [elapsed, setElapsed] = useState('00:00');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [resolving, setResolving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startedAt = sosStartedAt ?? Date.now();

  const refreshLocation = useCallback(async () => {
    try {
      const loc = await getSosEventLocation(eventId);
      if (loc) {
        setLatitude(loc.latitude);
        setLongitude(loc.longitude);
      }
    } catch {
      // Keep last known coordinates on poll failure
    }
  }, [eventId]);

  useEffect(() => {
    void refreshLocation();
    const locationPoll = setInterval(() => void refreshLocation(), 10_000);

    const timer = setInterval(() => {
      setElapsed(formatElapsed(Date.now() - startedAt));
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(locationPoll);
    };
  }, [refreshLocation, startedAt]);

  const handleSafe = async () => {
    setError(null);
    setResolving(true);
    try {
      await resolveSOS(eventId);
      clearActiveSos();
      navigation.replace('Home');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not resolve SOS');
    } finally {
      setResolving(false);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <HomeHeader showRecording />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.alertHeader}>
          <MaterialCommunityIcons name="alert-circle" size={32} color={colors.primary} />
          <Text style={styles.alertTitle}>{strings.sosActive.title}</Text>
          <Text style={styles.alertSubtitle}>{strings.sosActive.subtitle}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>{strings.sosActive.elapsed}</Text>
            <Text style={styles.statValue}>{elapsed}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>{strings.sosActive.contactsNotified}</Text>
            <Text style={styles.statValue}>{emergencyContacts.length}</Text>
          </View>
        </View>

        <Text style={styles.mapLabel}>{strings.sosActive.liveLocation}</Text>
        <SosLocationMap latitude={latitude} longitude={longitude} />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          mode="contained"
          onPress={handleSafe}
          loading={resolving}
          disabled={resolving}
          buttonColor={colors.primary}
          textColor={colors.text}
          style={styles.safeButton}
        >
          {strings.sosActive.imSafe}
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  alertHeader: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  alertTitle: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 8,
  },
  alertSubtitle: {
    color: colors.panelTextMuted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.panelBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  statLabel: {
    color: colors.panelTextMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  statValue: {
    color: colors.panelText,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 6,
  },
  mapLabel: {
    color: colors.panelText,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  safeButton: {
    marginTop: 24,
    borderRadius: 12,
    minHeight: 56,
  },
  error: {
    color: colors.error,
    textAlign: 'center',
    marginTop: 12,
    fontSize: 13,
  },
});
