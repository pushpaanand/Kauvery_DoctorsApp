import * as Notifications from 'expo-notifications';

export const sendNotification = async (role, { title, message, data }) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: message,
        data: data || {},
      },
      trigger: null, // Send immediately
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}; 