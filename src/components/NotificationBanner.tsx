// src/components/NotificationBanner.js
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import useNotifications from '../hooks/useNotifications'; // Import the custom hook

const { width } = Dimensions.get('window');

/**
 * Renders a dismissible notification banner at the top of the screen.
 * It consumes notification data from the `useNotifications` hook.
 */
const NotificationBanner = () => {
  const { notification, setNotification } = useNotifications(); // Use the custom hook

  if (!notification) {
    return null; // Don't render if there's no notification
  }

  return (
    <View style={styles.notificationBannerContainer}>
      <View style={styles.notificationBanner}>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          <Text style={styles.notificationBody}>{notification.body}</Text>
        </View>
        <TouchableOpacity 
          onPress={() => setNotification(null)} // Dismiss the notification
          style={styles.dismissButtonContainer}
        >
          <Text style={styles.dismissButton}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  notificationBannerContainer: {
    position: 'absolute', 
    top: 0, 
    left: 0,
    right: 0,
    zIndex: 1000, 
    paddingTop: 40, // Adjust as needed for safe area or notch
    alignItems: 'center', 
  },
  notificationBanner: {
    backgroundColor: '#28a745', // Green success color
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10, // Rounded corners
    width: width * 0.9, // 90% of screen width
    maxWidth: 400, // Max width for larger screens
    elevation: 8, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  notificationContent: {
    flex: 1, // Takes up available space
    paddingRight: 10, // Space between text and dismiss button
  },
  notificationTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 3,
  },
  notificationBody: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
  },
  dismissButtonContainer: {
    padding: 8,
    borderRadius: 20, // Circular button
    backgroundColor: 'rgba(255,255,255,0.2)', // Semi-transparent white
  },
  dismissButton: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 16, // Ensures the 'x' is vertically centered
  },
});

export default NotificationBanner;
