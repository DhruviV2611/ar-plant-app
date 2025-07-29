import {
  FETCH_PLANTS_REQUEST,
  FETCH_PLANTS_SUCCESS,
  FETCH_PLANTS_FAILURE,
  ADD_PLANT_SUCCESS,
  ADD_PLANT_FAILURE,
  Plant,
  DELETE_PLANT_SUCCESS,
  UPDATE_PLANT_SUCCESS,
} from '../types/plantType';

interface PlantState {
  loading: boolean;
  plants: Plant[];
  error: string | null;
}

const initialState: PlantState = {
  loading: false,
  plants: [],
  error: null,
};

export const plantReducer = (state = initialState, action: any): PlantState => {
  switch (action.type) {
    case FETCH_PLANTS_REQUEST:
      return { ...state, loading: true };
    case FETCH_PLANTS_SUCCESS:
      return { ...state, loading: false, plants: action.payload };
    case FETCH_PLANTS_FAILURE:
    case ADD_PLANT_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case ADD_PLANT_SUCCESS:
      return { ...state, plants: [...state.plants, action.payload] };
    case DELETE_PLANT_SUCCESS:
      return {
        ...state,
        plants: state.plants.filter(p => p._id !== action.payload),
      };
    case UPDATE_PLANT_SUCCESS:
      return {
        ...state,
        plants: state.plants.map(p =>
          p._id === action.payload._id ? action.payload : p
        ),
      };
    default:
      return state;
  }
};
