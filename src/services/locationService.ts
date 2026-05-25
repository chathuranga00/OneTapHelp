import * as Location from 'expo-location';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === Location.PermissionStatus.GRANTED;
}

export async function getCurrentPosition(): Promise<Coordinates | null> {
  const granted = await requestLocationPermission();
  if (!granted) return null;

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}

export async function watchPosition(
  onUpdate: (coords: Coordinates) => void,
  intervalMs: number,
): Promise<() => void> {
  const granted = await requestLocationPermission();
  if (!granted) return () => undefined;

  const subscription = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: intervalMs,
      distanceInterval: 10,
    },
    (position) => {
      onUpdate({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
  );

  return () => subscription.remove();
}
