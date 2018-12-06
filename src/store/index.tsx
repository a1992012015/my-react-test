import { DeepPartial, Middleware, Reducer, applyMiddleware, createStore, ReducersMapObject } from 'redux';
import { EnhancerOptions, composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { persistStore, persistReducer } from 'redux-persist';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native

import createReducerCreator from './reducers';
import { IReducers, IStore } from '@interfaces/global';

import auth from './reducers/authReducer';
import saga from './reducers/sagaReducer';
import notification from './reducers/notificationReducer';

import rootSaga from './actions';

// Check if Redux DevTools is available for redux-logger
const devToolsAvailable = window['__REDUX_DEVTOOLS_EXTENSION__'] !== undefined;

const loggers = createLogger({
  // ...options
  // level, // 级别
  // logger, // console的API
  // collapsed, // 是否折叠日志
  // predicate, // logger的条件
  duration: true, // 打印每个action的持续时间
  timestamp: true, // 打印每个action的时间戳
  stateTransformer: state => state, // 在打印之前转换state
  actionTransformer: action => action, // 在打印之前转换action
  errorTransformer: error => error // 在打印前转换error
});

/** Store constructor options */
interface Options<S> extends EnhancerOptions {
  /** Redux reducer */
  reducer: Reducer<S>;
  /** Additional enhancers */
  enhancers?: Function[];
  /** Intial store state */
  initialState?: DeepPartial<S>;
  /** Optional Middleware */
  middleware?: Middleware[];
}

/**
 * Create a Redux store complete with potential development settings
 * @param options Options to construct store with as well
 * @return Redux store instance
 */
function configureStore<S>({ enhancers: baseEnhancers = [], reducer, initialState, middleware: baseMiddleware = [], ...config }: Options<S>) {
  let middleware = baseMiddleware;

  // Add redux-logger middleware in development when there's no Redux DevTools
  if (process.env.NODE_ENV !== 'production' && !devToolsAvailable) {
    middleware = [...middleware, loggers];
  }

  // Create store instance
  const enhancers = [...baseEnhancers, applyMiddleware(...middleware)];
  const compose = composeWithDevTools(config);
  return initialState !== undefined ?
    createStore(reducer, initialState, compose(...enhancers))
    :
    createStore(reducer, compose(...enhancers));
}

const persistAuthConfig = {
  key: 'auth',
  storage,
  blacklist: ['userInfo']
};

export const history = createBrowserHistory();

export const createReducer = createReducerCreator<IReducers>(history, {
  auth: persistReducer(persistAuthConfig, auth),
  saga,
  notification,
});

const sagaMiddleware = createSagaMiddleware();

export const store: IStore = configureStore({
  reducer: createReducer(),
  middleware: [sagaMiddleware, routerMiddleware(history)]
});

store.injectedReducers = {};

export function injectReducer(reducer: Partial<ReducersMapObject<IReducers>>) {
  if (store.injectedReducers) {
    if (Reflect.has(store.injectedReducers, Object.keys(reducer)[0])) {
      return;
    }
    Object.assign(store.injectedReducers, reducer);
    store.replaceReducer(createReducer(store.injectedReducers));
    persist = persistStore(store);
  }
}

export let persist = persistStore(store);

sagaMiddleware.run(rootSaga);
