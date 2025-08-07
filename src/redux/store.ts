import { createStore, applyMiddleware, combineReducers } from 'redux';
const { default: createSagaMiddleware } = require('redux-saga');
import { plantReducer } from './reducers/plantReducer';
import authReducer from './reducers/authReducer';
import rootSaga from './sagas';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notificationReducer from './reducers/notificationReducer';


const rootReducer = combineReducers({
  plantState: plantReducer,
  authState: authReducer,
   notification: notificationReducer,
});
const persistConfig = {
  key: 'root', // Key for the storage
  storage: AsyncStorage, // Storage mechanism (AsyncStorage for React Native)
  // whitelist: ['example'], // Only these reducers will be persisted
  // blacklist: ['navigation'], // These reducers will NOT be persisted
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
export type AppState = ReturnType<typeof rootReducer>;

const sagaMiddleware = createSagaMiddleware();

const store = createStore(persistedReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);
const persistor = persistStore(store);
export default store;
export { persistor };