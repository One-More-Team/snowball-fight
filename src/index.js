import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import App from "./App";
import createSagaMiddleware from "redux-saga";
import { createStore, compose, combineReducers, applyMiddleware } from "redux";
import authReducer from "./store/reducers/auth";
import siteLanguageReducer from "./store/reducers/site-language";
import IndexSaga from "./saga/index";
import websocketReducer from "./store/reducers/websocket";
import appReducer from "./store/reducers/app";
import userReducer from "./store/reducers/user";

import "./index.css";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

Sentry.init({
  dsn:
    "https://6080394ba3444783baad7b5e2a606a1a@o471316.ingest.sentry.io/5526212",
  integrations: [new Integrations.BrowserTracing()],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

const sagaMiddleware = createSagaMiddleware();
const rootReducer = combineReducers({
  authReducer,
  siteLanguageReducer,
  websocketReducer,
  appReducer,
  userReducer,
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(IndexSaga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
