import {
  FETCH_PLANTS_REQUEST,
  FETCH_PLANTS_SUCCESS,
  FETCH_PLANTS_FAILURE,
  ADD_PLANT_REQUEST,
  ADD_PLANT_SUCCESS,
  ADD_PLANT_FAILURE,
  Plant,
  DELETE_PLANT_REQUEST,
  DELETE_PLANT_SUCCESS,
  DELETE_PLANT_FAILURE,
  UPDATE_PLANT_REQUEST,
  UPDATE_PLANT_FAILURE,
  UPDATE_PLANT_SUCCESS,
  GET_PLANT_BY_ID_REQUEST,
  GET_PLANT_BY_ID_SUCCESS,
  GET_PLANT_BY_ID_FAILURE,
  IDENTIFY_PLANT_REQUEST,
  IDENTIFY_PLANT_SUCCESS,
  IDENTIFY_PLANT_FAILURE,
  GET_CARE_TIPS_REQUEST,
  GET_CARE_TIPS_SUCCESS,
  GET_CARE_TIPS_FAILURE,
  GET_TOXICITY_INFO_REQUEST,
  GET_TOXICITY_INFO_SUCCESS,
  GET_TOXICITY_INFO_FAILURE,
  ADD_JOURNAL_ENTRY_REQUEST,
  ADD_JOURNAL_ENTRY_SUCCESS,
  ADD_JOURNAL_ENTRY_FAILURE,
  DELETE_JOURNAL_ENTRY_REQUEST,
  DELETE_JOURNAL_ENTRY_SUCCESS,
  DELETE_JOURNAL_ENTRY_FAILURE,
  EXPORT_PDF_REQUEST,
  EXPORT_PDF_SUCCESS,
  EXPORT_PDF_FAILURE,
  PlantIdentification,
} from '../types/plantType';

// Basic CRUD actions
export const fetchPlantsRequest = () => ({
  type: FETCH_PLANTS_REQUEST,
});

export const fetchPlantsSuccess = (plants: Plant[]) => ({
  type: FETCH_PLANTS_SUCCESS,
  payload: plants,
});

export const fetchPlantsFailure = (error: string) => ({
  type: FETCH_PLANTS_FAILURE,
  payload: error,
});

export const addPlantRequest = (plant: Plant) => ({
  type: ADD_PLANT_REQUEST,
  payload: plant,
});

export const addPlantSuccess = (plant: Plant) => ({
  type: ADD_PLANT_SUCCESS,
  payload: plant,
});

export const addPlantFailure = (error: string) => ({
  type: ADD_PLANT_FAILURE,
  payload: error,
});

export const deletePlantRequest = (id: string) => ({
  type: DELETE_PLANT_REQUEST,
  payload: id,
});

export const deletePlantSuccess = (id: string) => ({
  type: DELETE_PLANT_SUCCESS,
  payload: id,
});

export const deletePlantFailure = (error: string) => ({
  type: DELETE_PLANT_FAILURE,
  payload: error,
});

export const updatePlantRequest = (plant: Plant) => ({
  type: UPDATE_PLANT_REQUEST,
  payload: plant,
});

export const updatePlantSuccess = (plant: Plant) => ({
  type: UPDATE_PLANT_SUCCESS,
  payload: plant,
});

export const updatePlantFailure = (error: string) => ({
  type: UPDATE_PLANT_FAILURE,
  payload: error,
});

// Get single plant
export const getPlantByIdRequest = (id: string) => ({
  type: GET_PLANT_BY_ID_REQUEST,
  payload: id,
});

export const getPlantByIdSuccess = (plant: Plant) => ({
  type: GET_PLANT_BY_ID_SUCCESS,
  payload: plant,
});

export const getPlantByIdFailure = (error: string) => ({
  type: GET_PLANT_BY_ID_FAILURE,
  payload: error,
});

// Plant identification
export const identifyPlantRequest = (imageBase64: string) => ({
  type: IDENTIFY_PLANT_REQUEST,
  payload: imageBase64,
});

export const identifyPlantSuccess = (identification: PlantIdentification) => ({
  type: IDENTIFY_PLANT_SUCCESS,
  payload: identification,
});

export const identifyPlantFailure = (error: string) => ({
  type: IDENTIFY_PLANT_FAILURE,
  payload: error,
});

// Care tips
export const getCareTipsRequest = (species: string) => ({
  type: GET_CARE_TIPS_REQUEST,
  payload: species,
});

export const getCareTipsSuccess = (careTips: any) => ({
  type: GET_CARE_TIPS_SUCCESS,
  payload: careTips,
});

export const getCareTipsFailure = (error: string) => ({
  type: GET_CARE_TIPS_FAILURE,
  payload: error,
});

// Toxicity info
export const getToxicityInfoRequest = (plantId: string) => ({
  type: GET_TOXICITY_INFO_REQUEST,
  payload: plantId,
});

export const getToxicityInfoSuccess = (toxicity: any) => ({
  type: GET_TOXICITY_INFO_SUCCESS,
  payload: toxicity,
});

export const getToxicityInfoFailure = (error: string) => ({
  type: GET_TOXICITY_INFO_FAILURE,
  payload: error,
});

// Journal entries
export const addJournalEntryRequest = (plantId: string, entry: { notes: string; photoUrl?: string }) => ({
  type: ADD_JOURNAL_ENTRY_REQUEST,
  payload: { plantId, entry },
});

export const addJournalEntrySuccess = (plant: Plant) => ({
  type: ADD_JOURNAL_ENTRY_SUCCESS,
  payload: plant,
});

export const addJournalEntryFailure = (error: string) => ({
  type: ADD_JOURNAL_ENTRY_FAILURE,
  payload: error,
});

export const deleteJournalEntryRequest = (plantId: string, entryId: string) => ({
  type: DELETE_JOURNAL_ENTRY_REQUEST,
  payload: { plantId, entryId },
});

export const deleteJournalEntrySuccess = (plant: Plant) => ({
  type: DELETE_JOURNAL_ENTRY_SUCCESS,
  payload: plant,
});

export const deleteJournalEntryFailure = (error: string) => ({
  type: DELETE_JOURNAL_ENTRY_FAILURE,
  payload: error,
});

// Export PDF
export const exportPDFRequest = () => ({
  type: EXPORT_PDF_REQUEST,
});

export const exportPDFSuccess = (pdfData: any) => ({
  type: EXPORT_PDF_SUCCESS,
  payload: pdfData,
});

export const exportPDFFailure = (error: string) => ({
  type: EXPORT_PDF_FAILURE,
  payload: error,
});
