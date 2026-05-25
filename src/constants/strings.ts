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
    appName: 'OneTap Help',
    safe: 'SAFE',
    sosLabel: 'SOS',
    holdLabel: 'HOLD',
    holdHint: 'Hold for 2 seconds to trigger emergency services.',
    holdProgress: (elapsed: number, total: number) =>
      `Hold… ${elapsed}s / ${total}s to trigger emergency services.`,
    locationMonitored: 'Your location is being monitored',
    locationOff: 'Location monitoring off — enable GPS for SOS',
    silentMode: 'Silent Mode',
    silentModeDesc: 'Audio recording only, no sirens',
    sosHint: 'PRESS AND HOLD FOR 2 SECONDS TO ACTIVATE SOS',
    readyTitle: 'YOU ARE PROTECTED',
    readySubtitle:
      'Your location and emergency contacts are ready. Hold the SOS button below if you need help.',
    contactsReady: 'Emergency contacts',
    contactsEnRoute: 'Ready to alert',
    gpsActive: 'GPS: Active',
    gpsDenied: 'GPS: Denied',
    gpsUnavailable: 'GPS: Off',
    gpsChecking: 'GPS: …',
    messageContacts: 'Message Contacts',
    emergencyGuide: 'Emergency Guide',
    navSos: 'SOS',
    navMap: 'Map',
    navContacts: 'Contacts',
    navProfile: 'Profile',
    history: 'History',
    settings: 'Settings',
    contacts: 'Contacts',
    battery: 'Battery',
  },

  track: {
    title: 'Live SOS location',
    subtitle: 'Shared location from an active emergency alert.',
    waitingForLocation: 'Waiting for location updates…',
  },

  sosActive: {
    title: 'SOS ACTIVE',
    subtitle: 'Help is on the way. Your location and audio are being shared.',
    elapsed: 'Elapsed',
    contactsNotified: 'Contacts notified',
    liveLocation: 'Live location',
    imSafe: 'I AM SAFE',
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
