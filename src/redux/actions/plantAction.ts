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
} from '../types/plantType';

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
