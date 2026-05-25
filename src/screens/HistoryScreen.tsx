import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { ScreenLayout } from '../components';
import { colors, strings } from '../constants';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

export function HistoryScreen(_props: Props) {
  return (
    <ScreenLayout title={strings.history.title} scrollable>
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>—</Text>
        <Text style={styles.emptyText}>{strings.history.empty}</Text>
        <Text style={styles.emptyHint}>Past SOS alerts will appear here.</Text>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    color: colors.border,
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  emptyHint: {
    color: colors.textMuted,
    marginTop: 8,
    fontSize: 14,
  },
});
