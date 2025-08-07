import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { COLORS } from '../../theme/color';
import { FONTS } from '../../constant/Fonts';
import { responsiveFontSize, scale, verticalScale } from '../../utills/scallingUtills';
import { fetchNotificationHistoryRequest } from '../../redux/actions/notificationActions';

const NotificationHistoryScreen = () => {
  const dispatch = useDispatch();
  const { history, loading, error } = useSelector((state:any) => state.notification);
console.log(history,"history")
  useEffect(() => {
    dispatch(fetchNotificationHistoryRequest());
  }, [dispatch]);

    const handleRefresh = () => {
      dispatch(fetchNotificationHistoryRequest());
    };
  const renderItem = ({item}:any) => (
    <View style={styles.item}>
      <Text style={styles.message}>{item.title}</Text>
      <Text style={styles.message}>{item.body}</Text>
      <Text style={styles.timestamp}>{new Date(item.sentAt).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification History</Text>
      {loading ? (
        <ActivityIndicator size="large" color='black' />
      ) : error ? (
        <Text style={styles.noData}>Error: {error}</Text>
      ) : history.length === 0 ? (
        <Text style={styles.noData}>No notifications sent yet.</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
           refreshControl={
                      <RefreshControl refreshing={loading} onRefresh={handleRefresh}  colors={[COLORS.TEXT_COLOR]}/>
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
    fontSize: responsiveFontSize(2.5),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
    marginBottom: verticalScale(16),
    color: COLORS.TEXT_COLOR,
  },
  item: {
    backgroundColor: COLORS.CARD_BG_COLOR,
    borderRadius: 8,
    padding: scale(12),
    marginBottom: verticalScale(10),
  },
  message: {
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_MEDIUM,
    color: COLORS.TEXT_COLOR,
  },
  timestamp: {
    fontSize: responsiveFontSize(1.6),
    color: COLORS.TEXT_COLOR_3,
    marginTop: verticalScale(4),
  },
  noData: {
    fontSize: responsiveFontSize(2),
    color: COLORS.TEXT_COLOR_3,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOOK,
  },
});

export default NotificationHistoryScreen;
