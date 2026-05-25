import { StyleSheet, View } from 'react-native';
import { Switch, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '../../icons';

import { colors, strings } from '../../constants';

type SilentModeCardProps = {
  enabled: boolean;
  onToggle: (value: boolean) => void;
};

export function SilentModeCard({ enabled, onToggle }: SilentModeCardProps) {
  return (
    <View style={styles.card}>
      <MaterialCommunityIcons
        name="microphone-off"
        size={26}
        color={colors.panelText}
      />
      <View style={styles.body}>
        <Text style={styles.title}>{strings.home.silentMode}</Text>
        <Text style={styles.subtitle}>{strings.home.silentModeDesc}</Text>
      </View>
      <Switch value={enabled} onValueChange={onToggle} color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 14,
    gap: 12,
  },
  body: {
    flex: 1,
  },
  title: {
    color: colors.panelText,
    fontSize: 16,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.panelTextMuted,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
});
