import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

import { config } from '../constants';
import type { EmergencyContact } from '../store';
import { fetchEmergencyContacts } from './contactsService';
import { getCurrentPosition } from './locationService';
import { supabase } from './supabase';

const LOCATION_UPDATE_MS = config.sosLocationUpdateIntervalMs;
const STORAGE_BUCKET = 'sos-recordings';

let activeRecording: Audio.Recording | null = null;
let locationInterval: ReturnType<typeof setInterval> | null = null;
let activeEventId: string | null = null;
let cachedUserName = 'User';
let lastContacts: EmergencyContact[] = [];

function buildTrackingUrl(eventId: string, lat: number, lng: number): string {
  const base = config.trackingBaseUrl || config.supabaseUrl.replace(/\/$/, '');
  return `${base}/track/${eventId}?lat=${lat}&lng=${lng}`;
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function fetchUserDisplayName(userId: string): Promise<string> {
  const { data, error } = await supabase
    .from('users')
    .select('full_name, phone')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data?.full_name?.trim() || data?.phone || 'User';
}

async function fetchAutoCallPolice(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_settings')
    .select('auto_call_police')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data?.auto_call_police ?? false;
}

async function startSilentRecording(): Promise<void> {
  const permission = await Audio.requestPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Microphone permission is required for SOS evidence recording.');
  }

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
    staysActiveInBackground: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  });

  if (activeRecording) {
    await stopSilentRecording();
  }

  const { recording } = await Audio.Recording.createAsync(
    Audio.RecordingOptionsPresets.HIGH_QUALITY,
  );
  activeRecording = recording;
}

async function stopSilentRecording(): Promise<string | null> {
  if (!activeRecording) return null;

  await activeRecording.stopAndUnloadAsync();
  const uri = activeRecording.getURI();
  activeRecording = null;
  return uri;
}

function stopLocationUpdates(): void {
  if (locationInterval) {
    clearInterval(locationInterval);
    locationInterval = null;
  }
  activeEventId = null;
}

function startLocationUpdates(eventId: string): void {
  stopLocationUpdates();
  activeEventId = eventId;

  locationInterval = setInterval(() => {
    void (async () => {
      const coords = await getCurrentPosition();
      if (!coords || !activeEventId) return;

      await supabase
        .from('sos_events')
        .update({
          latitude: coords.latitude,
          longitude: coords.longitude,
        })
        .eq('id', activeEventId);
    })();
  }, LOCATION_UPDATE_MS);
}

export async function sendSMSAlert(
  contact: EmergencyContact,
  eventId: string,
  lat: number,
  lng: number,
): Promise<void> {
  const message = `EMERGENCY: ${cachedUserName} triggered SOS. Track live location: ${buildTrackingUrl(eventId, lat, lng)}`;

  const { error } = await supabase.functions.invoke('send-sms', {
    body: {
      phone: contact.phone,
      message,
      eventId,
      latitude: lat,
      longitude: lng,
      contactName: contact.name,
    },
  });

  if (error) throw error;
}

async function sendSafeFollowUpSms(contact: EmergencyContact): Promise<void> {
  const message = `${cachedUserName} is now safe.`;

  const { error } = await supabase.functions.invoke('send-sms', {
    body: {
      phone: contact.phone,
      message,
      contactName: contact.name,
    },
  });

  if (error) throw error;
}

async function uploadAudioRecording(
  userId: string,
  eventId: string,
  fileUri: string,
): Promise<string> {
  const base64 = await FileSystem.readAsStringAsync(fileUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const filePath = `${userId}/${eventId}.m4a`;
  const bytes = base64ToUint8Array(base64);

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, bytes, {
      contentType: 'audio/m4a',
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Triggers SOS for the user. Caller should navigate to SOSActiveScreen after this resolves.
 */
export async function triggerSOS(userId: string): Promise<void> {
  const coords = await getCurrentPosition();
  if (!coords) {
    throw new Error('Unable to get GPS location. Enable location services and try again.');
  }

  await startSilentRecording();

  cachedUserName = await fetchUserDisplayName(userId);

  const { data: event, error: insertError } = await supabase
    .from('sos_events')
    .insert({
      user_id: userId,
      latitude: coords.latitude,
      longitude: coords.longitude,
      status: 'active',
    })
    .select('id')
    .single();

  if (insertError) throw insertError;
  if (!event?.id) throw new Error('Failed to create SOS event.');

  const eventId = event.id;
  activeEventId = eventId;

  const contacts = await fetchEmergencyContacts(userId);
  lastContacts = contacts;

  await Promise.all(
    contacts.map((contact) => sendSMSAlert(contact, eventId, coords.latitude, coords.longitude)),
  );

  const autoCallPolice = await fetchAutoCallPolice(userId);
  if (autoCallPolice) {
    const telUrl = `tel:${config.emergencyPoliceNumber}`;
    const canOpen = await Linking.canOpenURL(telUrl);
    if (canOpen) {
      await Linking.openURL(telUrl);
    }
  }

  startLocationUpdates(eventId);
}

export async function resolveSOS(eventId: string): Promise<void> {
  const recordingUri = await stopSilentRecording();
  stopLocationUpdates();

  const { data: event, error: fetchError } = await supabase
    .from('sos_events')
    .select('user_id')
    .eq('id', eventId)
    .single();

  if (fetchError) throw fetchError;

  let audioUrl: string | null = null;
  if (recordingUri && event?.user_id) {
    audioUrl = await uploadAudioRecording(event.user_id, eventId, recordingUri);
  }

  const { error: updateError } = await supabase
    .from('sos_events')
    .update({
      status: 'resolved',
      resolved_at: new Date().toISOString(),
      audio_url: audioUrl,
    })
    .eq('id', eventId);

  if (updateError) throw updateError;

  if (!event?.user_id) {
    throw new Error('SOS event not found.');
  }

  const contacts =
    lastContacts.length > 0 ? lastContacts : await fetchEmergencyContacts(event.user_id);

  await Promise.all(contacts.map((contact) => sendSafeFollowUpSms(contact)));

  lastContacts = [];
  cachedUserName = 'User';
}

export function getActiveSosEventId(): string | null {
  return activeEventId;
}

export async function getSosEventLocation(
  eventId: string,
): Promise<{ latitude: number; longitude: number } | null> {
  const { data, error } = await supabase
    .from('sos_events')
    .select('latitude, longitude')
    .eq('id', eventId)
    .maybeSingle();

  if (error) throw error;
  if (data?.latitude == null || data?.longitude == null) return null;
  return { latitude: data.latitude, longitude: data.longitude };
}
