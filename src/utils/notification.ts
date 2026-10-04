import { sounds } from './audio';

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.warn('Error requesting notification permission:', error);
    return false;
  }
}

export function hasNotificationPermission(): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  return Notification.permission === 'granted';
}

export function sendLocalNotification(title: string, options?: NotificationOptions) {
  if (hasNotificationPermission()) {
    try {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        dir: 'rtl',
        lang: 'ar',
        ...options
      });
    } catch (e) {
      console.warn('Failed to send native notification', e);
    }
  }
  // Play pleasant reminder alert
  sounds.playReminderAlert();
}
