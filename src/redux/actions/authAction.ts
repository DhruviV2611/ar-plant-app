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
  LoginCredentials,
  RegisterCredentials,
  UpdateProfileData,
  User,
  AuthResponse,
} from '../types/authType';

// Login Actions
export const loginRequest = (credentials: LoginCredentials) => ({
  type: LOGIN_REQUEST,
  payload: credentials,
});

export const loginSuccess = (data: AuthResponse) => ({
  type: LOGIN_SUCCESS,
  payload: data,
});

export const loginFailure = (error: string) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

// Register Actions
export const registerRequest = (credentials: RegisterCredentials) => ({
  type: REGISTER_REQUEST,
  payload: credentials,
});

export const registerSuccess = (data: AuthResponse) => ({
  type: REGISTER_SUCCESS,
  payload: data,
});

export const registerFailure = (error: string) => ({
  type: REGISTER_FAILURE,
  payload: error,
});

// Logout Action
export const logout = () => ({
  type: LOGOUT,
});

// Update Profile Actions
export const updateProfileRequest = (data: UpdateProfileData) => ({
  type: UPDATE_PROFILE_REQUEST,
  payload: data,
});

export const updateProfileSuccess = (user: User) => ({
  type: UPDATE_PROFILE_SUCCESS,
  payload: user,
});

export const updateProfileFailure = (error: string) => ({
  type: UPDATE_PROFILE_FAILURE,
  payload: error,
});

// Clear Error Action
export const clearError = () => ({
  type: CLEAR_ERROR,
});

// Fetch User Actions
export const fetchUserRequest = () => ({
  type: FETCH_USER_REQUEST,
});

export const fetchUserSuccess = (user: User) => ({
  type: FETCH_USER_SUCCESS,
  payload: user,
});

export const fetchUserFailure = (error: string) => ({
  type: FETCH_USER_FAILURE,
  payload: error,
}); 