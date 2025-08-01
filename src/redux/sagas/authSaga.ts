import { call, put, takeLatest, select } from 'redux-saga/effects';
import api from '../api';
import { authService } from '../../services/authService'; // Assuming authService can store full user object
import {
  loginSuccess,
  loginFailure,
  registerSuccess,
  registerFailure,
  updateProfileSuccess,
  updateProfileFailure,
  fetchUserSuccess,
  fetchUserFailure,
} from '../actions/authAction';
import { 
  LOGIN_REQUEST,
  REGISTER_REQUEST,
  UPDATE_PROFILE_REQUEST,
  FETCH_USER_REQUEST,
  LoginCredentials, 
  RegisterCredentials, 
  UpdateProfileData,
  User, // Import User interface
} from '../types/authType';


// API functions
const loginAPI = async (credentials: LoginCredentials) => {
  const response = await api.post('auth/login', credentials);
  return response.data;
};

const registerAPI = async (credentials: RegisterCredentials) => {
  const response = await api.post('auth/register', credentials);
  return response.data;
};

const fetchUserAPI = async (userId: string, token: string) => {
  const response = await api.get(`auth/getUserDetails`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const updateProfileAPI = async (data: UpdateProfileData, token: string) => {
  const response = await api.put('auth/profile', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Sagas
function* loginSaga(action: any): Generator {
  try {
    const data = yield call(loginAPI, action.payload); // { token, userId }
    yield put(loginSuccess(data)); // <-- This must update state.auth.token
  } catch (error: any) {
    yield put(loginFailure(error.message));
  }
}


function* registerSaga(action: any): Generator<any, void, any> {
  try {
    const data = yield call(registerAPI, action.payload);
    
    let user: User | null = null;
    try {
      user = yield call(fetchUserAPI, data.userId, data.token);
    } catch (userError) {
      console.warn('Failed to fetch full user details after registration, using basic info:', userError);
      user = { _id: data.userId, email: '' }; 
    }
  
    yield call(authService.setAuthData, data.token, user);
    
    yield put(registerSuccess({ token: data.token, userId: data.userId, user: user || { _id: data.userId, email: '' } }));
  } catch (error: any) {
    console.error('Registration error:', error);
    
    let errorMessage = 'Registration failed';
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      errorMessage = 'Unable to connect to server. Please check your internet connection.';
    } else if (error.response?.status === 409) {
      errorMessage = 'Email already exists. Please use a different email.';
    } else if (error.response?.status === 400) {
      errorMessage = 'Invalid registration data. Please check your input.';
    } else if (error.response?.status === 404) {
      errorMessage = 'Registration endpoint not found. Please check server configuration.';
    } else if (error.response?.status >= 500) {
      errorMessage = 'Server error. Please try again later.';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    yield put(registerFailure(errorMessage));
  }
}

function* updateProfileSaga(action: any): Generator<any, void, any> {
  try {
    const state = yield select();
    const token = state.authState.token;
    
    if (!token) {
      yield put(updateProfileFailure('No authentication token'));
      return;
    }
    
    const data = yield call(updateProfileAPI, action.payload, token);
    yield put(updateProfileSuccess(data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Profile update failed';
    yield put(updateProfileFailure(errorMessage));
  }
}

function* fetchUserSaga(): Generator<any, void, any> {
  try {
    const state = yield select();
    const token = state.authState.token;
    
    if (!token) {
      yield put(fetchUserFailure('No token available'));
      return;
    }
    const user = yield call(fetchUserAPI, '', token);
    yield put(fetchUserSuccess(user));
  } catch (error: any) {
    console.error('Fetch user error:', error);
    let errorMessage = 'Failed to fetch user details';
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    yield put(fetchUserFailure(errorMessage));
  }
}

function* logoutSaga(): Generator<any, void, any> {
  try {
    yield call(authService.clearAuthData);
  } catch (error) {
    console.error('Error during logout:', error);
  }
}

export function* authSaga() {
  yield takeLatest(LOGIN_REQUEST, loginSaga);
  yield takeLatest(REGISTER_REQUEST, registerSaga);
  yield takeLatest(UPDATE_PROFILE_REQUEST, updateProfileSaga);
  yield takeLatest(FETCH_USER_REQUEST, fetchUserSaga);
  yield takeLatest('LOGOUT', logoutSaga);
}
