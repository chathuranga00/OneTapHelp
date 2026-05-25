import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '../../icons';
import { Text } from 'react-native-paper';

import { colors, strings } from '../../constants';
import type { RootStackParamList } from '../../navigation';

type HomeBottomNavProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
  activeTab?: 'sos' | 'map' | 'contacts' | 'profile';
};

export function HomeBottomNav({ navigation, activeTab = 'sos' }: HomeBottomNavProps) {
  return (
    <View style={styles.bar}>
      <Pressable style={styles.tab}>
        <View style={[styles.sosTab, activeTab === 'sos' && styles.sosTabActive]}>
          <MaterialCommunityIcons name="asterisk" size={22} color={colors.text} />
        </View>
        <Text style={[styles.tabLabel, activeTab === 'sos' && styles.tabLabelActive]}>
          {strings.home.navSos}
        </Text>
      </Pressable>

      <Pressable style={styles.tab}>
        <MaterialCommunityIcons
          name="map-outline"
          size={26}
          color={activeTab === 'map' ? colors.primary : colors.navInactive}
        />
        <Text style={[styles.tabLabel, activeTab === 'map' && styles.tabLabelActive]}>
          {strings.home.navMap}
        </Text>
      </Pressable>

      <Pressable style={styles.tab} onPress={() => navigation.navigate('SetupContacts')}>
        <MaterialCommunityIcons
          name="card-account-details-outline"
          size={26}
          color={activeTab === 'contacts' ? colors.primary : colors.navInactive}
        />
        <Text style={[styles.tabLabel, activeTab === 'contacts' && styles.tabLabelActive]}>
          {strings.home.navContacts}
        </Text>
      </Pressable>

      <Pressable style={styles.tab} onPress={() => navigation.navigate('Settings')}>
        <MaterialCommunityIcons
          name="account-outline"
          size={26}
          color={activeTab === 'profile' ? colors.primary : colors.navInactive}
        />
        <Text style={[styles.tabLabel, activeTab === 'profile' && styles.tabLabelActive]}>
          {strings.home.navProfile}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
    paddingTop: 10,
    paddingBottom: 6,
    paddingHorizontal: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  sosTab: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosTabActive: {
    backgroundColor: colors.primaryDark,
  },
  tabLabel: {
    fontSize: 12,
    color: colors.navInactive,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});
