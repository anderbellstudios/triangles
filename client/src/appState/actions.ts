import { appState } from '.'

export const setNotificationPermission = (
  notificationPermission: NotificationPermission
) => appState.set('app.notificationPermission', notificationPermission)
