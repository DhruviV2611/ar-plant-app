import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

export const setupNotificationHandlers = async () => {
  // Request permission
  const authStatus = await messaging().requestPermission();
  const enabled = 
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('FCM Permission granted');
  }

  messaging().onMessage(async (remoteMessage) => {
    PushNotification.localNotification({
      title: remoteMessage.notification?.title,
      message: remoteMessage.notification?.body ?? '',
      channelId: '',
    });
  });

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  PushNotification.localNotification({
    title: remoteMessage.notification?.title,
    message: remoteMessage.notification?.body ?? '',   
     channelId: '',
  });
});
  
  messaging().getInitialNotification().then(remoteMessage => {
    if (remoteMessage) {
      console.log(
        'Notification caused app to open from quit state:',
        remoteMessage.notification,
      );
    }
  });

};