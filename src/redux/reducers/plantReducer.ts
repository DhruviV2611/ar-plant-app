import {
  FETCH_PLANTS_REQUEST,
  FETCH_PLANTS_SUCCESS,
  FETCH_PLANTS_FAILURE,
  ADD_PLANT_SUCCESS,
  ADD_PLANT_FAILURE,
  Plant,
  DELETE_PLANT_SUCCESS,
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
  ADD_JOURNAL_ENTRY_SUCCESS,
  DELETE_JOURNAL_ENTRY_SUCCESS,
  EXPORT_PDF_REQUEST,
  EXPORT_PDF_SUCCESS,
  EXPORT_PDF_FAILURE,
  PlantIdentification,
} from '../types/plantType';

interface PlantState {
  loading: boolean;
  plants: Plant[];
  selectedPlant: Plant | null;
  identifiedPlant: PlantIdentification | null;
  careTips: any;
  toxicityInfo: any;
  error: string | null;
  pdfLoading: boolean;
}

const initialState: PlantState = {
  loading: false,
  plants: [],
  selectedPlant: null,
  identifiedPlant: null,
  careTips: null,
  toxicityInfo: null,
  error: null,
  pdfLoading: false,
};

export const plantReducer = (state = initialState, action: any): PlantState => {
  switch (action.type) {
    case FETCH_PLANTS_REQUEST:
      return { ...state, loading: true, error: null };
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
        selectedPlant: state.selectedPlant?._id === action.payload._id ? action.payload : state.selectedPlant,
      };

    // Get single plant
    case GET_PLANT_BY_ID_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_PLANT_BY_ID_SUCCESS:
      return { ...state, loading: false, selectedPlant: action.payload };
    case GET_PLANT_BY_ID_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Plant identification
    case IDENTIFY_PLANT_REQUEST:
      return { ...state, loading: true, error: null };
    case IDENTIFY_PLANT_SUCCESS:
      return { ...state, loading: false, identifiedPlant: action.payload };
    case IDENTIFY_PLANT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Care tips
    case GET_CARE_TIPS_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_CARE_TIPS_SUCCESS:
      return { ...state, loading: false, careTips: action.payload };
    case GET_CARE_TIPS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Toxicity info
    case GET_TOXICITY_INFO_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_TOXICITY_INFO_SUCCESS:
      return { ...state, loading: false, toxicityInfo: action.payload };
    case GET_TOXICITY_INFO_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Journal entries
    case ADD_JOURNAL_ENTRY_SUCCESS:
      return {
        ...state,
        plants: state.plants.map(p =>
          p._id === action.payload._id ? action.payload : p
        ),
        selectedPlant: state.selectedPlant?._id === action.payload._id ? action.payload : state.selectedPlant,
      };

    case DELETE_JOURNAL_ENTRY_SUCCESS:
      return {
        ...state,
        plants: state.plants.map(p =>
          p._id === action.payload._id ? action.payload : p
        ),
        selectedPlant: state.selectedPlant?._id === action.payload._id ? action.payload : state.selectedPlant,
      };

    // Export PDF
    case EXPORT_PDF_REQUEST:
      return { ...state, pdfLoading: true, error: null };
    case EXPORT_PDF_SUCCESS:
      return { ...state, pdfLoading: false };
    case EXPORT_PDF_FAILURE:
      return { ...state, pdfLoading: false, error: action.payload };

    default:
      return state;
  }
};
