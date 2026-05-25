import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '../../icons';

import { colors, strings } from '../../constants';

type HomeHeaderProps = {
  showRecording?: boolean;
};

export function HomeHeader({ showRecording = false }: HomeHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.brand}>
        <MaterialCommunityIcons name="shield-check" size={26} color={colors.primary} />
        <Text style={styles.brandText}>{strings.home.appName}</Text>
      </View>
      <View style={styles.badges}>
        {showRecording ? (
          <View style={styles.recBadge}>
            <Text style={styles.recDot}>●</Text>
            <Text style={styles.recText}>REC</Text>
          </View>
        ) : null}
        <View style={styles.safePill}>
          <Text style={styles.safeText}>{strings.home.safe}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '800',
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  recDot: {
    color: colors.text,
    fontSize: 10,
  },
  recText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  safePill: {
    backgroundColor: colors.safePillBg,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  safeText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});
