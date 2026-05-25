import * as Linking from 'expo-linking';
import type { LinkingOptions } from '@react-navigation/native';

import { config } from '../constants';
import type { RootStackParamList } from './types';

function getWebPrefixes(): string[] {
  if (typeof window === 'undefined' || !window.location?.origin) {
    return [];
  }
  return [window.location.origin];
}

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [
    Linking.createURL('/'),
    ...getWebPrefixes(),
    ...(config.trackingBaseUrl ? [config.trackingBaseUrl.replace(/\/$/, '')] : []),
  ],
  config: {
    screens: {
      Track: {
        path: 'track/:eventId',
        parse: {
          eventId: (value: string) => value,
          lat: String,
          lng: String,
        },
      },
      Onboarding: '',
      Auth: 'auth',
      SetupContacts: 'setup-contacts',
      Home: 'home',
      SOSActive: 'sos/:eventId',
      History: 'history',
      Settings: 'settings',
      EmergencyGuide: 'guide',
    },
  },
};
