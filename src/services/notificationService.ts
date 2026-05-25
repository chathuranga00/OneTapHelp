import * as Notifications from 'expo-notifications';

import { colors } from '../constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === Notifications.PermissionStatus.GRANTED) return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === Notifications.PermissionStatus.GRANTED;
}

export async function scheduleLocalAlert(
  title: string,
  body: string,
  seconds = 1,
): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      color: colors.primary,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
    },
  });
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
