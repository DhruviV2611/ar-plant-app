import { createStore, applyMiddleware, combineReducers } from 'redux';
const { default: createSagaMiddleware } = require('redux-saga');
import { plantReducer } from './reducers/plantReducer';
import rootSaga from './sagas';

const rootReducer = combineReducers({
  plantState: plantReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

export default store;
