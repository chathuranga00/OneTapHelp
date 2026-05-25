import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { colors, config, strings } from '../../constants';

type SosHoldButtonProps = {
  holding: boolean;
  holdProgress: number;
  onPressIn: () => void;
  onPressOut: () => void;
};

const SIZE = 200;
const HOLD_SEC = config.sosHoldDurationMs / 1000;

export function SosHoldButton({ holding, holdProgress, onPressIn, onPressOut }: SosHoldButtonProps) {
  const elapsedSec = Math.min(HOLD_SEC, Math.round(holdProgress * HOLD_SEC * 10) / 10);

  return (
    <View style={styles.wrapper}>
      <View style={styles.shadowLayer} />
      <View style={styles.backCircle} />
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={({ pressed }) => [
          styles.frontCircle,
          (pressed || holding) && styles.frontCirclePressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={strings.home.sosLabel}
        accessibilityHint={strings.home.holdHint}
      >
        <Text style={styles.sosText}>{strings.home.sosLabel}</Text>
        <Text style={styles.holdText}>{strings.home.holdLabel}</Text>
      </Pressable>
      <Text style={styles.hint}>
        {holding
          ? strings.home.holdProgress(elapsedSec, HOLD_SEC)
          : strings.home.holdHint}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  shadowLayer: {
    position: 'absolute',
    top: 28,
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: 'rgba(204, 0, 0, 0.12)',
  },
  backCircle: {
    position: 'absolute',
    top: 36,
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: colors.primary,
  },
  frontCircle: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  frontCirclePressed: {
    transform: [{ scale: 0.97 }],
    backgroundColor: '#8B0000',
  },
  sosText: {
    color: colors.text,
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: 2,
  },
  holdText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 3,
    marginTop: 2,
  },
  hint: {
    marginTop: SIZE + 24,
    color: colors.panelTextMuted,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 20,
  },
});
