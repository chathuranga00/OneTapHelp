import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { Button, Divider, List, Switch } from 'react-native-paper';
import { useState } from 'react';

import { ScreenLayout } from '../components';
import { colors, strings } from '../constants';
import type { RootStackParamList } from '../navigation';
import { signOut } from '../services';
import { useAppStore } from '../store';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const reset = useAppStore((s) => s.reset);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      // Still clear local state if remote sign-out fails
    }
    reset();
    navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
  };

  return (
    <ScreenLayout scrollable>
      <List.Section>
        <List.Subheader style={styles.subheader}>{strings.settings.contacts}</List.Subheader>
        <List.Item
          title="Manage emergency contacts"
          description="Add or remove trusted contacts"
          left={(props) => <List.Icon {...props} icon="account-group" color={colors.primary} />}
          onPress={() => navigation.navigate('SetupContacts')}
          titleStyle={styles.itemTitle}
          descriptionStyle={styles.itemDescription}
          style={styles.item}
        />
        <Divider style={styles.divider} />
        <List.Subheader style={styles.subheader}>{strings.settings.notifications}</List.Subheader>
        <List.Item
          title="Push notifications"
          left={(props) => <List.Icon {...props} icon="bell" color={colors.primary} />}
          right={() => (
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              color={colors.primary}
            />
          )}
          titleStyle={styles.itemTitle}
          style={styles.item}
        />
        <List.Subheader style={styles.subheader}>{strings.settings.location}</List.Subheader>
        <List.Item
          title="Share location during SOS"
          left={(props) => <List.Icon {...props} icon="map-marker" color={colors.primary} />}
          right={() => (
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              color={colors.primary}
            />
          )}
          titleStyle={styles.itemTitle}
          style={styles.item}
        />
      </List.Section>

      <Button
        mode="outlined"
        onPress={handleSignOut}
        textColor={colors.primary}
        style={styles.signOut}
      >
        {strings.settings.signOut}
      </Button>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  subheader: {
    color: colors.textMuted,
  },
  item: {
    backgroundColor: colors.surface,
  },
  itemTitle: {
    color: colors.text,
  },
  itemDescription: {
    color: colors.textSecondary,
  },
  divider: {
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  signOut: {
    marginTop: 24,
    borderColor: colors.primary,
  },
});
