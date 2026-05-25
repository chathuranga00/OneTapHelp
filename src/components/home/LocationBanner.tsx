import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '../../icons';

import { colors, strings } from '../../constants';
import type { GpsStatus } from '../../hooks';

type LocationBannerProps = {
  gpsStatus: GpsStatus;
};

export function LocationBanner({ gpsStatus }: LocationBannerProps) {
  const active = gpsStatus === 'active' || gpsStatus === 'checking';

  return (
    <View style={[styles.banner, !active && styles.bannerInactive]}>
      <MaterialCommunityIcons
        name="crosshairs-gps"
        size={22}
        color={active ? colors.accentBlue : colors.panelTextMuted}
      />
      <Text style={[styles.text, !active && styles.textInactive]}>
        {active ? strings.home.locationMonitored : strings.home.locationOff}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.locationBannerBg,
    borderWidth: 1,
    borderColor: colors.locationBannerBorder,
    borderRadius: 12,
  },
  bannerInactive: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  text: {
    flex: 1,
    color: colors.accentBlue,
    fontSize: 15,
    fontWeight: '700',
  },
  textInactive: {
    color: colors.panelTextMuted,
  },
});
