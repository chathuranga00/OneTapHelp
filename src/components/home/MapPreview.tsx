import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '../../icons';
import { Text } from 'react-native-paper';

import { colors, strings } from '../../constants';
import type { GpsStatus } from '../../hooks';

type MapPreviewProps = {
  contactCount: number;
  gpsStatus: GpsStatus;
};

export function MapPreview({ contactCount, gpsStatus }: MapPreviewProps) {
  const gpsOk = gpsStatus === 'active';

  return (
    <View style={styles.wrapper}>
      <View style={styles.statusCard}>
        <View style={styles.statusIcon}>
          <MaterialCommunityIcons name="account-group" size={22} color={colors.accentBlue} />
        </View>
        <View style={styles.statusBody}>
          <Text style={styles.statusTitle}>
            {strings.home.contactsReady}: {contactCount}
          </Text>
          <Text style={styles.statusSub}>{strings.home.contactsEnRoute}</Text>
        </View>
        <View style={styles.statusRight}>
          <Text style={styles.distance}>{gpsOk ? 'LIVE' : '—'}</Text>
          <Text style={styles.distanceLabel}>GPS</Text>
        </View>
      </View>

      <View style={styles.map}>
        {Array.from({ length: 6 }).map((_, row) => (
          <View key={row} style={styles.gridRow}>
            {Array.from({ length: 8 }).map((__, col) => (
              <View key={col} style={styles.gridCell} />
            ))}
          </View>
        ))}
        <View style={[styles.marker, styles.markerBlue]}>
          <MaterialCommunityIcons name="map-marker" size={28} color={colors.accentBlue} />
        </View>
        <View style={[styles.marker, styles.markerRed]}>
          <MaterialCommunityIcons name="map-marker" size={24} color={colors.primary} />
        </View>
        <View style={styles.userDotOuter}>
          <View style={styles.userDotInner} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.mapBackground,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentBlueLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  statusBody: {
    flex: 1,
  },
  statusTitle: {
    color: colors.panelText,
    fontSize: 15,
    fontWeight: '700',
  },
  statusSub: {
    color: colors.panelTextMuted,
    fontSize: 12,
    marginTop: 2,
  },
  statusRight: {
    alignItems: 'flex-end',
  },
  distance: {
    color: colors.accentBlue,
    fontSize: 20,
    fontWeight: '800',
  },
  distanceLabel: {
    color: colors.panelTextMuted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
  map: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: colors.mapGrid,
    overflow: 'hidden',
    minHeight: 160,
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row',
  },
  gridCell: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  marker: {
    position: 'absolute',
  },
  markerBlue: {
    top: '28%',
    left: '22%',
  },
  markerRed: {
    top: '45%',
    right: '28%',
  },
  userDotOuter: {
    position: 'absolute',
    bottom: '32%',
    left: '48%',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
});
