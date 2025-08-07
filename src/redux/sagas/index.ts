import { all } from 'redux-saga/effects';
import { watchPlantSaga } from './plantSaga';
import { authSaga } from './authSaga';
import { watchNotificationHistory } from './notificationSaga';

export default function* rootSaga() {
  yield all([watchPlantSaga(), authSaga(), watchNotificationHistory(),]);
}
