import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '../icons';

import { SosLocationMap } from '../components/sos';
import { colors, strings } from '../constants';
import type { RootStackParamList } from '../navigation';
import { supabase } from '../services';

type Props = NativeStackScreenProps<RootStackParamList, 'Track'>;

function parseCoord(value: string | undefined): number | null {
  if (value == null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function TrackScreen({ route }: Props) {
  const insets = useSafeAreaInsets();
  const { eventId } = route.params;
  const initialLat = parseCoord(route.params.lat);
  const initialLng = parseCoord(route.params.lng);

  const [latitude, setLatitude] = useState<number | null>(initialLat);
  const [longitude, setLongitude] = useState<number | null>(initialLng);
  const [status, setStatus] = useState<'connecting' | 'live' | 'static'>(
    initialLat != null && initialLng != null ? 'static' : 'connecting',
  );

  const applyCoords = useCallback((lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    setStatus('live');
  }, []);

  useEffect(() => {
    const channelName = `sos:${eventId}`;
    const channel = supabase.channel(channelName);

    channel.on('broadcast', { event: 'location_update' }, ({ payload }) => {
      const data = payload as { latitude?: number; longitude?: number };
      if (data.latitude != null && data.longitude != null) {
        applyCoords(data.latitude, data.longitude);
      }
    });

    channel.subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [applyCoords, eventId]);

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="crosshairs-gps" size={36} color={colors.primary} />
          <Text style={styles.title}>{strings.track.title}</Text>
          <Text style={styles.subtitle}>{strings.track.subtitle}</Text>
        </View>

        {status === 'connecting' && latitude == null ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : null}

        <SosLocationMap latitude={latitude} longitude={longitude} />

        {latitude != null && longitude != null ? (
          <Text style={styles.coords}>
            {latitude.toFixed(5)}, {longitude.toFixed(5)}
          </Text>
        ) : (
          <Text style={styles.waiting}>{strings.track.waitingForLocation}</Text>
        )}

        <Text style={styles.eventId}>Event: {eventId}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 12,
    letterSpacing: 1,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  loader: {
    marginBottom: 16,
  },
  coords: {
    color: colors.text,
    textAlign: 'center',
    marginTop: 12,
    fontSize: 15,
    fontWeight: '600',
  },
  waiting: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
  },
  eventId: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 16,
    fontSize: 11,
  },
});
