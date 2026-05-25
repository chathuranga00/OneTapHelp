export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  SetupContacts: undefined;
  Home: undefined;
  SOSActive: { eventId: string };
  Track: { eventId: string; lat?: string; lng?: string };
  History: undefined;
  Settings: undefined;
  EmergencyGuide: undefined;
};
