// plantSaga.ts
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  FETCH_PLANTS_REQUEST,
  ADD_PLANT_REQUEST,
  Plant,
  DELETE_PLANT_REQUEST,
  UPDATE_PLANT_REQUEST,
} from '../types/plantType';
import {
  fetchPlantsSuccess,
  fetchPlantsFailure,
  addPlantSuccess,
  addPlantFailure,
  deletePlantSuccess,
  deletePlantFailure,
  updatePlantSuccess,
  updatePlantFailure,
} from '../actions/plantAction';
import api from '../Api';

function* fetchPlantsSaga(): Generator {
  try {
    const response = yield call(api.get, '/plants/getPlants'); // Corrected: '/plants/getPlants'
    yield put(fetchPlantsSuccess(response.data));
  } catch (error) {
    if (error instanceof Error) {
      yield put(fetchPlantsFailure(error.message));
    } else {
      yield put(fetchPlantsFailure('An unknown error occurred'));
    }
  }
}

function* addPlantSaga(action: { type: string; payload: Plant }): Generator {
  try {
    const response = yield call(api.post, '/plants/addPlant', action.payload); // Corrected: '/plants/addPlant'
    yield put(addPlantSuccess(response.data));
  } catch (error) {
    if (error instanceof Error) {
      yield put(addPlantFailure(error.message));
    } else {
      yield put(addPlantFailure('An unknown error occurred'));
    }
  }
}
function* deletePlantSaga(action: { type: string; payload: string }): Generator {
  try {
    yield call(api.delete, `/plants/${action.payload}`);
    yield put(deletePlantSuccess(action.payload));
  } catch (error) {
    yield put(deletePlantFailure(error instanceof Error ? error.message : 'Unknown error'));
  }
}

function* updatePlantSaga(action: { type: string; payload: Plant }): Generator {
  try {
    const response = yield call(api.put, `/plants/${action.payload._id}`, action.payload);
    yield put(updatePlantSuccess(response.data));
  } catch (error) {
    yield put(updatePlantFailure(error instanceof Error ? error.message : 'Unknown error'));
  }
}

export function* watchPlantSaga() {
  yield takeLatest(FETCH_PLANTS_REQUEST, fetchPlantsSaga);
  yield takeLatest(ADD_PLANT_REQUEST, addPlantSaga);
  yield takeLatest(DELETE_PLANT_REQUEST, deletePlantSaga);
  yield takeLatest(UPDATE_PLANT_REQUEST, updatePlantSaga);
}