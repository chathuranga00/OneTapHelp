import * as Battery from 'expo-battery';
import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

export type GpsStatus = 'active' | 'denied' | 'unavailable' | 'checking';

export function useDeviceStatus() {
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>('checking');
  const [batteryPercent, setBatteryPercent] = useState<number | null>(null);

  const refreshGps = useCallback(async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === Location.PermissionStatus.GRANTED) {
        setGpsStatus('active');
        return;
      }
      if (status === Location.PermissionStatus.DENIED) {
        setGpsStatus('denied');
        return;
      }
      setGpsStatus('unavailable');
    } catch {
      setGpsStatus('unavailable');
    }
  }, []);

  const refreshBattery = useCallback(async () => {
    if (Platform.OS === 'web') {
      setBatteryPercent(null);
      return;
    }
    try {
      const available = await Battery.isAvailableAsync();
      if (!available) {
        setBatteryPercent(null);
        return;
      }
      const level = await Battery.getBatteryLevelAsync();
      setBatteryPercent(level >= 0 ? Math.round(level * 100) : null);
    } catch {
      setBatteryPercent(null);
    }
  }, []);

  useEffect(() => {
    void refreshGps();
    void refreshBattery();

    if (Platform.OS === 'web') {
      return;
    }

    let subscription: { remove: () => void } | null = null;

    const startBatteryListener = async () => {
      try {
        const available = await Battery.isAvailableAsync();
        if (!available) return;

        subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
          setBatteryPercent(batteryLevel >= 0 ? Math.round(batteryLevel * 100) : null);
        });
      } catch {
        setBatteryPercent(null);
      }
    };

    void startBatteryListener();

    return () => subscription?.remove();
  }, [refreshGps, refreshBattery]);

  return {
    gpsStatus,
    batteryPercent,
    refreshGps,
    refreshBattery,
  };
}
