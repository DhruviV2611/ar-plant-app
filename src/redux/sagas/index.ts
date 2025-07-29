import { all } from 'redux-saga/effects';
import { watchPlantSaga } from './plantSaga';

export default function* rootSaga() {
  yield all([watchPlantSaga()]);
}
