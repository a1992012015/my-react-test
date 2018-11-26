import { DeepPartial, Middleware, Reducer, applyMiddleware, createStore } from 'redux';
import { EnhancerOptions, composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { createLogger } from 'redux-logger';
import createSagaMiddleware, { SagaMiddlewareOptions } from 'redux-saga';

import createReducerCreator from './reducers';
import { IReducers } from '../interfaces/global';

import enthusiasm from './reducers/enthusiasm';
import auth from './reducers/auth';
import sagaTest from './reducers/saga-test';

import rootSaga from './actions/Saga-test'

// Check if Redux DevTools is available for redux-logger
const devToolsAvailable = window['__REDUX_DEVTOOLS_EXTENSION__'] !== undefined;

const loggers = createLogger({
  // ...options
  // level, //级别
  // logger, //console的API
  // collapsed, //
  // predicate, //logger的条件
  duration: true, //打印每个action的持续时间
  timestamp: true //打印每个action的时间戳
  // transformer = state => state, //在打印之前转换state
  // actionTransformer = actn => actn, //在打印之前转换action
});

/** Store constructor options */
interface Options<S> extends EnhancerOptions {
  /** Redux reducer */
  reducer: Reducer<S>;
  /** Additional enhancers */
  enhancers?: Function[];
  /** Intial store state */
  initialState?: DeepPartial<S>;
  /** Optional middlewares */
  middleware?: Middleware[];
}

// Test the state default
const initState: IReducers = {
  enthusiasm: {
    name: 'typeScript',
    enthusiasmLevel: 4
  },
  auth: {
    isSignIn: false,
    userInfo: {},
    token: {
      access_token: '',
      token_type: '',
      refresh_token: '',
      expires_in: '',
      scope: '',
      jti: ''
    }
  },
  sagaTest: 0,
};

/**
 * Create a Redux store complete with potential development settings
 * @param options Options to construct store with as well
 * @return Redux store instance
 */
function configureStore<S>({
                             enhancers: baseEnhancers = [],
                             reducer,
                             initialState,
                             middleware: baseMiddleware = [],
                             ...config
                           }: Options<S>) {
  let middleware = baseMiddleware;

  // Add redux-logger middleware in development when there's no Redux DevTools
  if (process.env.NODE_ENV !== 'production' && !devToolsAvailable) {
    middleware = [...middleware, loggers];
  }

  // Create store instance
  const enhancers = [...baseEnhancers, applyMiddleware(...middleware)];
  const compose = composeWithDevTools(config);
  return initialState !== undefined
    ? createStore(reducer, initialState, compose(...enhancers))
    : createStore(reducer, compose(...enhancers));
}

const createReducer = createReducerCreator<IReducers>({
  enthusiasm,
  auth,
  sagaTest
});

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: createReducer(),
  initialState: initState,
  middleware: [sagaMiddleware]
});

sagaMiddleware.run(rootSaga);