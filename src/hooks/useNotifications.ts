import { useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

/**
 * Custom React Hook for handling Firebase Cloud Messaging (FCM) notifications.
 * It requests user permissions, retrieves FCM token, and listens for incoming messages.
 *
 * @returns {object} An object containing:
 * - notification: The current remote notification object, or null if no notification.
 * - setNotification: A function to manually clear the current notification.
 */
const useNotifications = () => {
  const [notification, setNotification] = useState<FirebaseMessagingTypes.RemoteMessage['notification'] | null>(null);

  useEffect(() => {
    // Request user permission for notifications
    const requestUserPermission = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('FCM Authorization status:', authStatus);
          getFCMToken(); // Get the FCM token if permissions are granted
        } else {
          console.log('FCM Authorization status not granted:', authStatus);
        }
      } catch (error) {
        console.error('Error requesting FCM permission:', error);
      }
    };

    // Get the FCM device token
    const getFCMToken = async () => {
      try {
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
      } catch (error) {
        console.error('Error getting FCM token:', error);
      }
    };

    // Listen for messages when the app is in the foreground
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('FCM Message received in foreground:', remoteMessage);
      if (remoteMessage.notification) {
        setNotification(remoteMessage.notification);
      } else {
        setNotification(null);
      }
    });

    // Handle messages when the app is in the background or quit state
    // This handler runs in a separate, isolated JavaScript thread
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('FCM Message handled in the background!', remoteMessage);
      // You might want to store this notification or trigger local notifications here
      // setNotification(remoteMessage.notification); // Not directly possible as component is not mounted
    });

    // Request permission and token on component mount
    requestUserPermission();
     
    // Cleanup the foreground message listener when the component unmounts
    return () => {
      unsubscribeOnMessage();
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return { notification, setNotification };
};

export default useNotifications;
