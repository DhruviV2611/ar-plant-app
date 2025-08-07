// notificationSaga.ts
import { call, Effect, put, select, takeLatest } from 'redux-saga/effects';

import {
  FETCH_NOTIFICATION_HISTORY_REQUEST,
  FETCH_NOTIFICATION_HISTORY_SUCCESS,
  FETCH_NOTIFICATION_HISTORY_FAILURE,
  SEND_NOTIFICATION_REQUEST, // Import the new request type
} from '../types/notificationTypes';
import api from '../api';
import {
  fetchNotificationHistoryFailure,
  sendNotificationSuccess,
  sendNotificationFailure,
  fetchNotificationHistoryRequest,
} from '../actions/notificationActions';

function* getToken(): Generator<any, string | null, any> {
  const token: string | null = yield select((state: any) => state.authState.token); // Corrected path to authState
  if (!token) {
    yield put(fetchNotificationHistoryFailure('Authentication required. Please log in.'));
    return null;
  }
  return token;
}

function* fetchNotificationHistory(): Generator<Effect, void, any> {
  try {
    const token = yield call(getToken);
    if (!token) throw new Error('Token not found');

    const response = yield call(api.get, 'notifications/notificationHistory', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    yield put({
      type: FETCH_NOTIFICATION_HISTORY_SUCCESS,
      payload: response.data.notifications,
    });
  } catch (error: any) {
    yield put({
      type: FETCH_NOTIFICATION_HISTORY_FAILURE,
      payload: error?.response?.data?.message || error.message,
    });
  }
}

// New saga for sending a notification
function* sendNotification(): Generator<Effect, void, any> {
  try {
    const token = yield call(getToken);
    if (!token) throw new Error('Token not found');

    // The API call to send the test notification
    yield call(api.post, 'notifications/send-test', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Dispatch success action
    yield put(sendNotificationSuccess());
    console.log('Success', 'Notification sent and saved successfully!');

    // After a successful send, fetch the history to update the list
    yield put(fetchNotificationHistoryRequest());

  } catch (error: any) {
    yield put(sendNotificationFailure(error?.response?.data?.message || error.message));
    console.error(
      '❌ Error',
      'Failed to send notification. Please check server logs.',
    );
  }
}

export function* watchNotificationHistory() {
  yield takeLatest(FETCH_NOTIFICATION_HISTORY_REQUEST, fetchNotificationHistory);
  yield takeLatest(SEND_NOTIFICATION_REQUEST, sendNotification); // Watch for the new action
}