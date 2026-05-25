export { supabase, getSupabaseClient, isSupabaseConfigured } from './supabase';
export {
  formatPhoneE164,
  getAuthErrorMessage,
  sendPhoneOtp,
  verifyPhoneOtp,
  signOut,
  getSession,
} from './authService';
export {
  fetchEmergencyContacts,
  hasEmergencyContacts,
  saveEmergencyContacts,
  type EmergencyContactInput,
} from './contactsService';
export {
  requestLocationPermission,
  getCurrentPosition,
  watchPosition,
  type Coordinates,
} from './locationService';
export {
  requestNotificationPermission,
  scheduleLocalAlert,
  cancelAllNotifications,
} from './notificationService';
export { configureAudioMode, playAlarmLoop, stopAlarm } from './audioService';
export {
  triggerSOS,
  resolveSOS,
  sendSMSAlert,
  getActiveSosEventId,
  getSosEventLocation,
} from './sosService';
