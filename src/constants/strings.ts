export const strings = {
  appName: 'One Tap Help',
  tagline: 'Emergency help when you need it most',

  onboarding: {
    title: 'Your safety network',
    subtitle: 'One tap alerts your trusted contacts with your location.',
    getStarted: 'Get started',
  },

  auth: {
    title: 'Sign in',
    subtitle: 'Enter your mobile number to receive a one-time code',
    phone: 'Phone number',
    otp: '6-digit code',
    sendOtp: 'Send OTP',
    verifyOtp: 'Verify',
    otpSent: 'Code sent. Enter the 6-digit SMS code below.',
    resendOtp: 'Resend code',
  },

  setupContacts: {
    title: 'Emergency contacts',
    subtitle: 'Add people who will be notified when you trigger SOS',
    addContact: 'Add to list',
    updateContact: 'Update contact',
    saveContinue: 'Save and Continue',
    name: 'Name',
    phone: 'Phone number',
    relation: 'Relation',
    emptyList: 'No contacts added yet',
    maxReached: 'Maximum of 5 contacts reached',
  },

  home: {
    sosLabel: 'SOS',
    sosHint: 'PRESS AND HOLD FOR 2 SECONDS TO ACTIVATE SOS',
    history: 'History',
    settings: 'Settings',
    gpsActive: 'GPS: Active',
    gpsDenied: 'GPS: Denied',
    gpsUnavailable: 'GPS: Off',
    gpsChecking: 'GPS: …',
    contacts: 'Contacts',
    battery: 'Battery',
  },

  sosActive: {
    title: 'SOS ACTIVE',
    subtitle: 'Alerting your emergency contacts',
    cancel: 'Cancel SOS',
  },

  history: {
    title: 'Alert history',
    empty: 'No alerts yet',
  },

  settings: {
    title: 'Settings',
    contacts: 'Emergency contacts',
    notifications: 'Notifications',
    location: 'Location sharing',
    signOut: 'Sign out',
  },

  emergencyGuide: {
    title: 'Emergency guide',
    subtitle: 'Quick steps while help is on the way',
  },
} as const;
