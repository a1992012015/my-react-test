import { applyMiddleware, combineReducers, createStore, } from 'redux';
import { composeWithDevTools, } from 'redux-devtools-extension';
import { persistReducer, persistStore, } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware, } from 'connected-react-router';
import storage from 'redux-persist/lib/storage';

import { combineReducer, history, } from './reducers';
import { rootSaga, } from './sagaWatch';

/**
 * Create a Redux store complete with potential development settings
 * @param options Options to construct store with as well
 * @return Store Redux store instance
 */
function configureStore(options) {
  const { enhancers = [], reducer, initialState, middleware = [], ...config } = options;

  // Create store instance
  const enhancer = [...enhancers, applyMiddleware(...middleware), ];
  const compose = composeWithDevTools(config);
  if (initialState !== undefined) {
    return createStore(reducer, initialState, compose(...enhancer));
  } else {
    return createStore(reducer, compose(...enhancer));
  }
}

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const rootPersistConfig = {
  key: 'root',
  storage: storage,
  timeout: null,
  whitelist: ['auth', ],
};

const store = configureStore({
  reducer: persistReducer(rootPersistConfig, combineReducer()),
  middleware: [sagaMiddleware, routerMiddleware(history), ],
});

const persists = persistStore(store);

// then run the saga
sagaMiddleware.run(rootSaga);

const injectedReducers = {};

function injectReducer(reducer) {
  if (Reflect.has(injectedReducers, Object.keys(reducer)[0])) {
    return;
  }
  Object.assign(injectedReducers, reducer);
  store.replaceReducer(combineReducers(injectedReducers));
}

export {
  store,
  persists,
  history,
  injectReducer,
};