import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '../../icons';

import { colors } from '../../constants';

type SosLocationMapProps = {
  latitude: number | null;
  longitude: number | null;
};

export function SosLocationMap({ latitude, longitude }: SosLocationMapProps) {
  if (latitude == null || longitude == null) {
    return (
      <View style={styles.fallback}>
        <MaterialCommunityIcons name="map-marker-off" size={32} color={colors.textMuted} />
        <Text style={styles.fallbackText}>Waiting for location…</Text>
      </View>
    );
  }

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

const styles = StyleSheet.create({
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
