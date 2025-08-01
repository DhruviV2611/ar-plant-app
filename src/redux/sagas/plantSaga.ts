// plantSaga.ts
import { call, put, takeLatest, select } from 'redux-saga/effects';
import {
  FETCH_PLANTS_REQUEST,
  ADD_PLANT_REQUEST,
  Plant,
  DELETE_PLANT_REQUEST,
  UPDATE_PLANT_REQUEST,
  GET_PLANT_BY_ID_REQUEST,
  IDENTIFY_PLANT_REQUEST,
  GET_CARE_TIPS_REQUEST,
  GET_TOXICITY_INFO_REQUEST,
  ADD_JOURNAL_ENTRY_REQUEST,
  DELETE_JOURNAL_ENTRY_REQUEST,
  EXPORT_PDF_REQUEST,
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
  getPlantByIdSuccess,
  getPlantByIdFailure,
  identifyPlantSuccess,
  identifyPlantFailure,
  getCareTipsSuccess,
  getCareTipsFailure,
  getToxicityInfoSuccess,
  getToxicityInfoFailure,
  addJournalEntrySuccess,
  addJournalEntryFailure,
  deleteJournalEntrySuccess,
  deleteJournalEntryFailure,
  exportPDFSuccess,
  exportPDFFailure,
} from '../actions/plantAction';
import api from '../api';


function* fetchPlantsSaga(): Generator {
  try {
    const token: string = yield select((state: any) => state.auth.token);
    console.log('[fetchPlantsSaga] token from Redux:', token);

    if (!token) throw new Error('User not authenticated');

    const response = yield call(api.get, 'plants/getPlants', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    yield put(fetchPlantsSuccess(response.data));
  } catch (error: any) {
    console.error('Fetch plants error:', error.message);
    yield put(fetchPlantsFailure(error.message));
  }
}
function* addPlantSaga(action: { type: string; payload: Plant }): Generator {
  try {
    const response = yield call(api.post, 'plants/addPlant', action.payload);
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
    yield call(api.delete, `plants/${action.payload}`);
    yield put(deletePlantSuccess(action.payload));
  } catch (error) {
    yield put(deletePlantFailure(error instanceof Error ? error.message : 'Unknown error'));
  }
}

function* updatePlantSaga(action: { type: string; payload: Plant }): Generator {
  try {
    const response = yield call(api.put, `plants/${action.payload._id}`, action.payload);
    yield put(updatePlantSuccess(response.data));
  } catch (error) {
    yield put(updatePlantFailure(error instanceof Error ? error.message : 'Unknown error'));
  }
}

function* getPlantByIdSaga(action: { type: string; payload: string }): Generator {
  try {
    const response = yield call(api.get, `plants/${action.payload}`);
    yield put(getPlantByIdSuccess(response.data));
  } catch (error) {
    yield put(getPlantByIdFailure(error instanceof Error ? error.message : 'Unknown error'));
  }
}

function* identifyPlantSaga(action: { type: string; payload: string }): Generator {
  try {
    const response = yield call(api.post, 'plants/identifyPlant', {
      imageBase64: action.payload,
    });
    yield put(identifyPlantSuccess(response.data));
  } catch (error) {
    yield put(identifyPlantFailure(error instanceof Error ? error.message : 'Unknown error'));
  }
}

function* getCareTipsSaga(action: { type: string; payload: string }): Generator {
  try {
    const response = yield call(api.get, `plants/careTips/${action.payload}`);
    yield put(getCareTipsSuccess(response.data));
  } catch (error) {
    yield put(getCareTipsFailure(error instanceof Error ? error.message : 'Unknown error'));
  }
}

function* getToxicityInfoSaga(action: { type: string; payload: string }): Generator {
  try {
    const response = yield call(api.get, `plants/${action.payload}/toxicity`);
    yield put(getToxicityInfoSuccess(response.data));
  } catch (error) {
    yield put(getToxicityInfoFailure(error instanceof Error ? error.message : 'Unknown error'));
  }
}

function* addJournalEntrySaga(action: { type: string; payload: { plantId: string; entry: { notes: string; photoUrl?: string } } }): Generator {
  try {
    const response = yield call(api.post, `plants/${action.payload.plantId}/journal`, action.payload.entry);
    yield put(addJournalEntrySuccess(response.data));
  } catch (error) {
    yield put(addJournalEntryFailure(error instanceof Error ? error.message : 'Unknown error'));
  }
}

function* deleteJournalEntrySaga(action: { type: string; payload: { plantId: string; entryId: string } }): Generator {
  try {
    const response = yield call(api.delete, `plants/${action.payload.plantId}/journal/${action.payload.entryId}`);
    yield put(deleteJournalEntrySuccess(response.data));
  } catch (error) {
    yield put(deleteJournalEntryFailure(error instanceof Error ? error.message : 'Unknown error'));
  }
}

function* exportPDFSaga(): Generator {
  try {
    const response = yield call(api.get, 'plants/exportPDF', {
      responseType: 'blob',
    });
    yield put(exportPDFSuccess(response.data));
  } catch (error) {
    yield put(exportPDFFailure(error instanceof Error ? error.message : 'Unknown error'));
  }
}

export function* watchPlantSaga() {
   yield takeLatest(FETCH_PLANTS_REQUEST, fetchPlantsSaga);
  yield takeLatest(ADD_PLANT_REQUEST, addPlantSaga);
  yield takeLatest(DELETE_PLANT_REQUEST, deletePlantSaga);
  yield takeLatest(UPDATE_PLANT_REQUEST, updatePlantSaga);
  yield takeLatest(GET_PLANT_BY_ID_REQUEST, getPlantByIdSaga);
  yield takeLatest(IDENTIFY_PLANT_REQUEST, identifyPlantSaga);
  yield takeLatest(GET_CARE_TIPS_REQUEST, getCareTipsSaga);
  yield takeLatest(GET_TOXICITY_INFO_REQUEST, getToxicityInfoSaga);
  yield takeLatest(ADD_JOURNAL_ENTRY_REQUEST, addJournalEntrySaga);
  yield takeLatest(DELETE_JOURNAL_ENTRY_REQUEST, deleteJournalEntrySaga);
  yield takeLatest(EXPORT_PDF_REQUEST, exportPDFSaga);
}