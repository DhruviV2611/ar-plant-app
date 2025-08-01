import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGOUT,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  CLEAR_ERROR,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  AuthState,
} from '../types/authType';

const initialState: AuthState = {
  user: null,
  token: '',
  loading: false,
  error: null,
  userId: null,
  isAuthenticated:false,
};

const authReducer = (state = initialState, action: any): AuthState => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
    case UPDATE_PROFILE_REQUEST:
    case FETCH_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        token: action.payload.token,
        userId: action.payload.userId,
        isAuthenticated:false,
        error: null,
      };

    case UPDATE_PROFILE_SUCCESS:
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        error: null,
      };

    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
    case UPDATE_PROFILE_FAILURE:
    case FETCH_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      
    case LOGOUT:
        return initialState;

    case  CLEAR_ERROR :
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export default authReducer; 