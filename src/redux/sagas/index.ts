import { all } from 'redux-saga/effects';
import { watchPlantSaga } from './plantSaga';
import { authSaga } from './authSaga';

export default function* rootSaga() {
  yield all([watchPlantSaga(), authSaga()]);
}
