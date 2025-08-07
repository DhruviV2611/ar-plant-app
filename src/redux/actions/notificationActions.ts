import {
  FETCH_NOTIFICATION_HISTORY_REQUEST,
  FETCH_NOTIFICATION_HISTORY_SUCCESS,
  FETCH_NOTIFICATION_HISTORY_FAILURE,
  SEND_NOTIFICATION_REQUEST,
  SEND_NOTIFICATION_SUCCESS,
  SEND_NOTIFICATION_FAILURE,
} from '../types/notificationTypes';

export const fetchNotificationHistoryRequest = () => ({
  type: FETCH_NOTIFICATION_HISTORY_REQUEST,
});

export const fetchNotificationHistorySuccess = (history:any) => ({
  type: FETCH_NOTIFICATION_HISTORY_SUCCESS,
  payload: history,
});

export const fetchNotificationHistoryFailure = (error:any) => ({
  type: FETCH_NOTIFICATION_HISTORY_FAILURE,
  payload: error,
});

export const sendNotificationRequest = () => ({
  type: SEND_NOTIFICATION_REQUEST,
});

export const sendNotificationSuccess = () => ({
  type: SEND_NOTIFICATION_SUCCESS,
});

export const sendNotificationFailure = (error: string) => ({
  type: SEND_NOTIFICATION_FAILURE,
  payload: error,
});