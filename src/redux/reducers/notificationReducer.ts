import {
  FETCH_NOTIFICATION_HISTORY_REQUEST,
  FETCH_NOTIFICATION_HISTORY_SUCCESS,
  FETCH_NOTIFICATION_HISTORY_FAILURE,
} from '../types/notificationTypes';

const initialState = {
  loading: false,
  history: [],
  error: null,
};

const notificationReducer = (state = initialState, action:any) => {
  switch (action.type) {
    case FETCH_NOTIFICATION_HISTORY_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_NOTIFICATION_HISTORY_SUCCESS:
      return { ...state, loading: false, history: action.payload };
    case FETCH_NOTIFICATION_HISTORY_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default notificationReducer;
