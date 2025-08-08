// plantSaga.ts
import { call, put, takeLatest, select } from 'redux-saga/effects';
import {
  FETCH_PLANTS_REQUEST,
  ADD_PLANT_REQUEST,
  DELETE_PLANT_REQUEST,
  UPDATE_PLANT_REQUEST,
  GET_PLANT_BY_ID_REQUEST,
  IDENTIFY_PLANT_REQUEST,
  GET_CARE_TIPS_REQUEST,
  GET_TOXICITY_INFO_REQUEST,
  ADD_JOURNAL_ENTRY_REQUEST,
  DELETE_JOURNAL_ENTRY_REQUEST,
  UPDATE_JOURNAL_ENTRY_REQUEST,
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
  updateJournalEntrySuccess,
  updateJournalEntryFailure,
  exportPDFSuccess,
  exportPDFFailure,
  fetchPlantsRequest,
} from '../actions/plantAction';
import api from '../api';

// Helper function to get token and handle its absence
function* getToken(): Generator<any, string | null, any> {
  const token: string | null = yield select((state: any) => state.authState.token); // Corrected path to authState
  if (!token) {
    // Optionally dispatch an action to redirect to login or show an error
    yield put(fetchPlantsFailure('Authentication required. Please log in.'));
    return null;
  }
  return token;
}


export function* fetchPlantsSaga(action: any): Generator {
  const callBack = action?.payload?.callBack;

  try {
    const token = yield call(getToken); // Use the helper
    if (!token) {
      callBack?.(false);
      return; // Stop if no token
    }
    const response: any = yield call(api.get, 'plants/getPlants', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(fetchPlantsSuccess(response.data));
    callBack?.(true);
  } catch (error: any) {
    yield put(fetchPlantsFailure(error instanceof Error ? error.message : 'Unknown error'));
    callBack?.(false);
  }
}

export function* addPlantSaga(action: any): Generator {
  const {  callBack } = action.payload;
  try {
    const token = yield call(getToken); // Use the helper
    if (!token) {
      callBack?.(false);
      return;
    }
      const response = yield call(api.post, 'plants/addPlant', action.payload);
    yield put(addPlantSuccess(response.data));
    callBack?.(true);
  } catch (error: any) {
    yield put(addPlantFailure(error instanceof Error ? error.message : 'Unknown error'));
    callBack?.(false);
  }
}

export function* deletePlantSaga(action: any): Generator {
  const { plantId, callBack } = action.payload;
  try {
    const token = yield call(getToken);
    if (!token) {
      callBack?.(false);
      return;
    }
    yield call(api.delete, `/plants/${plantId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    yield put(deletePlantSuccess(plantId));
    callBack?.(true);
    yield put(fetchPlantsRequest());
  } catch (error: any) {
    yield put(deletePlantFailure(error instanceof Error ? error.message : 'Unknown error'));
    callBack?.(false);
  }
}

export function* updatePlantSaga(action: any): Generator {
  const { id, plant, callBack } = action.payload;
  try {
    const token = yield call(getToken); // Use the helper
    if (!token) {
      callBack?.(false);
      return;
    }
    const response: any = yield call(api.put, `plants/${id}`, plant, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(updatePlantSuccess(response.data));
    callBack?.(true);
  } catch (error: any) {
    yield put(updatePlantFailure(error instanceof Error ? error.message : 'Unknown error'));
    callBack?.(false);
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
export function* identifyPlantSaga(action: any): Generator {
  const { imageBase64, callBack } = action.payload;
  try {
    const token = yield call(getToken); // Use the helper
    if (!token) {
      callBack?.(false);
      return;
    }
    const response: any = yield call(api.post, 'plants/identify', { imageUrl: imageBase64 }, { // Adjusted to send as JSON body
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    yield put(identifyPlantSuccess(response.data));
    callBack?.(true);
  } catch (error: any) {
    yield put(identifyPlantFailure(error instanceof Error ? error.message : 'Unknown error'));
    callBack?.(false);
  }
}

export function* getCareTipsSaga(action: any): Generator {
  const { scientificName, callBack } = action.payload;
  try {
    const token = yield call(getToken); // Use the helper
    if (!token) {
      callBack?.(false);
      return;
    }
    const response: any = yield call(api.get, `plants/care-tips?scientificName=${scientificName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(getCareTipsSuccess(response.data));
    callBack?.(true);
  } catch (error: any) {
    yield put(getCareTipsFailure(error instanceof Error ? error.message : 'Unknown error'));
    callBack?.(false);
  }
}

export function* getToxicityInfoSaga(action: any): Generator {
  const { scientificName, callBack } = action.payload;
  try {
    const token = yield call(getToken); // Use the helper
    if (!token) {
      callBack?.(false);
      return;
    }
    const response: any = yield call(api.get, `plants/toxicity-info?scientificName=${scientificName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(getToxicityInfoSuccess(response.data));
    callBack?.(true);
  } catch (error: any) {
    yield put(getToxicityInfoFailure(error instanceof Error ? error.message : 'Unknown error'));
    callBack?.(false);
  }
}

export function* addJournalEntrySaga(action: any): Generator {
  const { plantId, entry, callBack } = action.payload;
  try {
    const token = yield call(getToken);
    if (!token) {
      callBack?.(false);
      return;
    }
    const response: any = yield call(api.post, `plants/${plantId}/journal`, entry, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(addJournalEntrySuccess(response.data));
    callBack?.(true);
  } catch (error: any) {
    yield put(addJournalEntryFailure(error instanceof Error ? error.message : 'Unknown error'));
    callBack?.(false);
  }
}

export function* deleteJournalEntrySaga(action: any): Generator {
  const { plantId, entryId, callBack } = action.payload;
  try {
    const token = yield call(getToken);
    if (!token) {
      callBack?.(false);
      return;
    }
    const response: any = yield call(api.delete, `plants/${plantId}/journal/${entryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(deleteJournalEntrySuccess(response.data)); // Assuming backend returns the updated plant
    callBack?.(true);
  } catch (error: any) {
    yield put(deleteJournalEntryFailure(error instanceof Error ? error.message : 'Unknown error'));
    callBack?.(false);
  }
}

export function* updateJournalEntrySaga(action: any): Generator {
  const { plantId, entryId, entry, callBack } = action.payload;
  try {
    const token = yield call(getToken); // Use the helper
    if (!token) {
      callBack?.(false);
      return;
    }
    const response: any = yield call(api.put, `plants/${plantId}/journal/${entryId}`, entry, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(updateJournalEntrySuccess(response.data));
    callBack?.(true);
  } catch (error: any) {
    yield put(updateJournalEntryFailure(error instanceof Error ? error.message : 'Unknown error'));
    callBack?.(false);
  }
}

function* exportPDFSaga(): Generator {
  try {
    const token: string | null = yield select((state: any) => state.authState.token); // Corrected path to authState
    if (!token) {
      yield put(exportPDFFailure('Authentication required. Please log in.'));
      return;
    }
    const response: any = yield call(api.get, 'plants/exportPDF', {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(exportPDFSuccess(response.data));
  } catch (error: any) {
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
  yield takeLatest(UPDATE_JOURNAL_ENTRY_REQUEST, updateJournalEntrySaga);
  yield takeLatest(EXPORT_PDF_REQUEST, exportPDFSaga);
}