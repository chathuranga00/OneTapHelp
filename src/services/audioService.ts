import { Audio } from 'expo-av';

let alarmSound: Audio.Sound | null = null;

export async function configureAudioMode(): Promise<void> {
  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    staysActiveInBackground: true,
    shouldDuckAndroid: false,
  });
}

export async function playAlarmLoop(): Promise<void> {
  await configureAudioMode();
  if (alarmSound) {
    await alarmSound.replayAsync();
    return;
  }

  // Placeholder: wire a local alarm asset when available
  const { sound } = await Audio.Sound.createAsync(
    { uri: 'https://www.soundjay.com/buttons/beep-01a.mp3' },
    { shouldPlay: true, isLooping: true, volume: 1 },
  );
  alarmSound = sound;
}

export async function stopAlarm(): Promise<void> {
  if (!alarmSound) return;
  await alarmSound.stopAsync();
  await alarmSound.unloadAsync();
  alarmSound = null;
}
