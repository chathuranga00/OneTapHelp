import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '../../icons';

import { colors } from '../../constants';

type SosLocationMapProps = {
  latitude: number | null;
  longitude: number | null;
};

export function SosLocationMap({ latitude, longitude }: SosLocationMapProps) {
  const [region, setRegion] = useState<Region | null>(null);

  useEffect(() => {
    if (latitude != null && longitude != null) {
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [latitude, longitude]);

  if (latitude == null || longitude == null || !region) {
    return (
      <View style={styles.fallback}>
        <MaterialCommunityIcons name="map-marker-off" size={32} color={colors.textMuted} />
        <Text style={styles.fallbackText}>Waiting for location…</Text>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.fallback}>
        <MaterialCommunityIcons name="crosshairs-gps" size={36} color={colors.primary} />
        <Text style={styles.coords}>
          {latitude.toFixed(5)}, {longitude.toFixed(5)}
        </Text>
        <Text style={styles.fallbackText}>Live GPS coordinates</Text>
      </View>
    );
  }

  return (
    <MapView style={styles.map} region={region} showsUserLocation>
      <Marker
        coordinate={{ latitude, longitude }}
        title="SOS location"
        pinColor={colors.primary}
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  fallback: {
    height: 200,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  coords: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  fallbackText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
});
