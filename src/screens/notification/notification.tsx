import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { COLORS } from '../../theme/color';
import { FONTS } from '../../constant/Fonts';
import {
  responsiveFontSize,
  scale,
  verticalScale,
} from '../../utills/scallingUtills';
import {
  fetchNotificationHistoryRequest,
  sendNotificationRequest,
} from '../../redux/actions/notificationActions';
import { AppState } from '../../redux/store';

const NotificationHistoryScreen = () => {
  const dispatch = useDispatch();
  const { history, loading, error } = useSelector(
    (state: any) => state.notification,
  );
  const { user } = useSelector((state: AppState) => state.authState);
  console.log(history, 'history');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    dispatch(fetchNotificationHistoryRequest());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchNotificationHistoryRequest());
  };
  const handleSendTestNotification = () => {
    if (!user?.fcmToken) {
      Alert.alert(
        'Notification Error',
        'FCM token not registered yet. Please wait a moment or re-login and try again.',
      );
      console.warn(
        'Attempted to send test notification without FCM token in Redux state.',
      );
      return;
    }
    dispatch(sendNotificationRequest());
  };

  const toggleExpand = (_id: string) => {
    setExpandedItems(prevState => ({
      ...prevState,
      [_id]: !prevState[_id],
    }));
  };

  const renderItem = ({ item }: any) => {
    const sentDate = new Date(item.sentAt);
    const today = new Date();
    const isToday =
      sentDate.getDate() === today.getDate() &&
      sentDate.getMonth() === today.getMonth() &&
      sentDate.getFullYear() === today.getFullYear();
    const timeString = sentDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const isExpanded = expandedItems[item._id];
    const shortBody =
      item.body.length > 50 && !isExpanded
        ? item.body.substring(0, 50) + '...'
        : item.body;
    return (
      <View style={styles.notification}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationBody}>{shortBody}</Text>
        {item.body.length > 50 && (
          <TouchableOpacity onPress={() => toggleExpand(item._id)}>
            <Text style={styles.notificationLink}>
              {isExpanded ? 'See less' : 'See more'}
            </Text>
          </TouchableOpacity>
        )}
        <Text style={styles.timestamp}>
          {isToday ? `Today, ${timeString}` : sentDate.toLocaleDateString()}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notification History</Text>
        <TouchableOpacity
          style={[
            styles.notificationButton,
            { marginBottom: verticalScale(2) },
          ]}
          onPress={handleSendTestNotification}
          disabled={!user?.fcmToken}
        >
          <Text style={styles.notificationButtonText}>Notification</Text>
        </TouchableOpacity>
        {!user?.fcmToken && (
          <Text style={styles.fcmWarningText}>
            Waiting for notification token registration...
          </Text>
        )}
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.TEXT_COLOR} />
      ) : error ? (
        <Text style={styles.noData}>Error: {error}</Text>
      ) : history.length === 0 ? (
        <Text style={styles.noData}>No notifications sent yet.</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleRefresh}
              colors={[COLORS.TEXT_COLOR]}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.MAIN_BG_COLOR,
    padding: scale(16),
  },
  title: {
    fontSize: responsiveFontSize(2.2),
    color: COLORS.TEXT_COLOR,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
  },
  notification: {
    backgroundColor: COLORS.CARD_BG_COLOR, // Use a darker color
    borderRadius: scale(15),
    padding: scale(15),
    marginBottom: verticalScale(10),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(20),
    marginTop: verticalScale(20),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
    backgroundColor: COLORS.HEADER_BG_COLOR,
    borderRadius: scale(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  notificationTitle: {
    flex: 1,
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
    color: COLORS.TEXT_COLOR_1, // Use a light color
  },
  notificationBody: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOOK,
    color: COLORS.TEXT_COLOR_2, // Use a slightly lighter color
  },
  timestamp: {
    fontSize: responsiveFontSize(1.5),
    color: COLORS.TEXT_COLOR_3,
    marginTop: verticalScale(4),
  },
  noData: {
    fontSize: responsiveFontSize(2),
    color: COLORS.TEXT_COLOR_3,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOOK,
  },
  notificationButton: {
    backgroundColor: COLORS.BUTTON_PRIMARY_COLOR,
    borderRadius: scale(8),
    paddingVertical: verticalScale(13),
    alignItems: 'center',
    paddingHorizontal: scale(4),
  },
  notificationButtonText: {
    color: COLORS.PRIMARY_BUTTON_TEXT_COLOR,
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_MEDIUM,
  },
  fcmWarningText: {
    fontSize: responsiveFontSize(1.6),
    color: COLORS.TEXT_COLOR_5,
    textAlign: 'center',
    marginTop: verticalScale(10),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOOK,
  },
  notificationLink: {
    fontSize: responsiveFontSize(1.5),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_MEDIUM,
    color: COLORS.TEXT_COLOR_9, // Or a color for a 'see more' link
  },
});

export default NotificationHistoryScreen;
