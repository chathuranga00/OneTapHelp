import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../constants';

type ScreenLayoutProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  scrollable?: boolean;
  contentStyle?: ViewStyle;
  footer?: ReactNode;
};

export function ScreenLayout({
  children,
  title,
  subtitle,
  scrollable = false,
  contentStyle,
  footer,
}: ScreenLayoutProps) {
  const insets = useSafeAreaInsets();

  const content = (
    <>
      {(title || subtitle) && (
        <View style={styles.header}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      )}
      <View style={[styles.body, contentStyle]}>{children}</View>
    </>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {scrollable ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        <View style={styles.fill}>{content}</View>
      )}
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fill: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 8,
    lineHeight: 22,
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
});
